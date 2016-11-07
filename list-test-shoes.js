const dalNoSQL = require('./DAL/no-sql.js')

var listShoeTestCallback = function(err, response) {
    if (err)
        return console.log(err.message)
    console.log(JSON.stringify(response.rows, null, 2))
}

var sortBy = 'shoeSort'

dalNoSQL.listShoes(sortBy, listShoeTestCallback)
