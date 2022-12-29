const productRouting = require('./handler/productRouting');

const handler = {
    "home": productRouting.showHome,
    "/productcreate": productRouting.createProduct,
    "/productdelete": productRouting.deleteProduct,
    "/productedit": productRouting.editProduct,
    "upload": productRouting.uploadImage
}

module.exports = handler;