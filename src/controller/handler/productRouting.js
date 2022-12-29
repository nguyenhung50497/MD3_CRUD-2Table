const fs = require('fs');
const qs = require('qs');
const formidable = require('formidable');
const path = require("path");
const productService = require('../../service/ProductService');
const CategoryService = require('../../service/CategoryService');

class ProductRouting {
    static getHomeHtml(homeHtml , products) {
        let tbody = '';
        products.map((product, index) => {
            tbody +=`
                    <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td><img src="./public/${product.image}" alt="k co" style="width: 100px;height: 100px;"></td>
                    <td>${product.idCategory}</td>
                    <td><a href="/product/edit/${product.id}"><button class="btn btn-primary">Edit</button></a></td>
                    <td><a href="/product/delete/${product.id}"><button class="btn btn-danger">Delete</button></a></td>
                    </tr>
                    `
        });
        homeHtml = homeHtml.replace('{products}' , tbody);
        return homeHtml;
    }

    static showHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let products = await productService.findAll();
                    homeHtml = ProductRouting.getHomeHtml(homeHtml, products);
                    res.writeHead(200, 'text/html');
                    res.write(homeHtml);
                    res.end();
                }
            });
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err);
                }
                else {
                    const products = qs.parse(data);
                    const mess = await productService.findByNameContaining(products.search);
                    fs.readFile('./views/home.html', 'utf-8', (err, searchHtml) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(1);
                            searchHtml = ProductRouting.getHomeHtml(searchHtml, mess);
                            res.writeHead(200, 'text/html');
                            res.write(searchHtml);
                            res.end();
                        }
                    });
                }
            })
        }
    }

    static createProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let categories = await CategoryService.getCategory();
                    let optionHtml = ''
                    categories.map((category) => {
                        optionHtml += `<option value="${category.id}">${category.name}</option>`
                    })
                    createHtml = createHtml.replace('{categories}', optionHtml);
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            });
        }
        else {
            let create = '';
            req.on('data', chunk => {
                create += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err);
                }
                else {
                    const product = qs.parse(create);
                    let data = await productService.save(product);
                    res.writeHead(301, {'location': `/product/upload/${data.insertId}`});
                    res.end();
                }
            })
        }
    }

    static async deleteProduct(req, res, id) {
        if (req.method === 'GET') {
        
            fs.readFile('./views/delete.html', 'utf-8', async (err, removeHtml) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.writeHead(200, 'text/html');
                    removeHtml = removeHtml.replace('{id}', id);
                    res.write(removeHtml);
                    res.end();
                }
            });
        }
        else {
            let mess = await productService.remove(id);
            console.log(mess);
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    static editProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let categories = await CategoryService.getCategory();
                    let optionHtml = ''
                    categories.map((category) => {
                        optionHtml += `<option value="${category.id}">${category.name}</option>`
                    })
                    let product = await productService.findById(id);
                    console.log(product);
                    editHtml = editHtml.replace('{name}', product[0].name);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    editHtml = editHtml.replace('{description}', product[0].description);
                    editHtml = editHtml.replace('{idCategory}', product[0].idCategory);
                    editHtml = editHtml.replace('{categories}', optionHtml);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            });
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err);
                }
                else {
                    const product = qs.parse(data);
                    const mess = await productService.update(product, id);
                    console.log(mess);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    static showFormUpLoad(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/upload.html', 'utf-8', (err, upLoadHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(upLoadHtml);
                    res.end();
                }
            })
        } else {
            let form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err)
                }
                let tmpPath = files.img.filepath;
                let newPath = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
                fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                await productService.editImage(files.img.originalFilename, id);
                res.writeHead(301, {'location': '/home'})
                res.end();
            });
        }
    }
    
}

module.exports = ProductRouting;