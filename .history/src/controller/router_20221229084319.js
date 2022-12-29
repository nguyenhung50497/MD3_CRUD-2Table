const productRouting = require('./handler/productRouting');

const handler = {
    "home": productRouting.showHome,
    "create": productRouting.createProduct,
    "delete": productRouting.deleteProduct,
    "edit": productRouting.editProduct,
    "upload": productRouting.searchProduct
}

module.exports = handler;