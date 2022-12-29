const connection = require('../model/connection');
connection.connecting();

class CategoryService {
    static getCategory() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
           connect.query('SELECT * FROM category', (err, categories) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(categories);
                }
            }) 
        });
    }


}

module.exports = CategoryService;