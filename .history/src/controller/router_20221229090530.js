const productRouting = require('./handler/productRouting');

const handler = {
    "home": productRouting.showHome,
    "/product/create": productRouting.createProduct,
    "//": productRouting.deleteProduct,
    "/product/edit": productRouting.editProduct,
    "/productupload": productRouting.uploadImage
}

module.exports = handler;