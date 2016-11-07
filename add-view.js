const dalNoSQL = require('./DAL/no-sql.js')

var designDoc = {
    _id: '_design/shoeSort',
    views: {
        'shoeSort': {
            map: function(doc) {
                if (doc.type === 'shoe') {
                    emit([doc.name], {'name': doc.name})
                }
            }.toString()
        }
    }
}

dalNoSQL.createView(designDoc, function callback(err, response) {
    if (err) {
        return console.log(err)
    }
    if (response) {
        console.log(response)
    }
})
