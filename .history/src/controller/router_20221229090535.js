const productRouting = require('./handler/productRouting');

const handler = {
    "home": productRouting.showHome,
    "/product/create": productRouting.createProduct,
    "/product/delete": productRouting.deleteProduct,
    "/productedit": productRouting.editProduct,
    "/productupload": productRouting.uploadImage
}

module.exports = handler;