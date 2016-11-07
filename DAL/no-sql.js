const path = require('path')
const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const fetchConfig = require('zero-config')
var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'})
const urlFormat = require('url').format
const db = new PouchDB(urlFormat(config.get("couch")))

var dal = {
    listShoes: listShoes,
    getShoe: getShoe,
    createShoes: createShoes,
    createView: createView
}

function getShoeByID(id, callback) {
    if (typeof id == 'undefined' || id === null) {
        return callback(new Error('400Missing data for update'))
    } else {
        db.get(id, function(err, response) {
            if (err) {
                return callback(err)
            }
            if (response) {
                return callback(null, response)
            }
        })
    }
}

function queryDB(sortBy, startKey, limit, callback) {
    if (typeof sortBy == 'undefined' || sortBy === null) {
        return callback(new Error('400 Missing data for query'), null)
    } else {
        limit = startKey !== ''
            ? limit + 1
            : limit
        console.log("sortBy:", sortBy, " startKey: ", startKey, " limit: ", limit)
        db.query(sortBy, {
            startKey: '',
            limit: limit,
            include_docs: true
        }, function(err, response) {
            if (err) {
                return callback(err)
            }
            if (response) {
                if (startKey !== '') {
                    response.rows.shift()
                }
                callback(null, response.rows.map(row => row.doc))
            }
        })
    }
}

// function listShoes(sortBy, startKey, limit, callback) {
//     console.log("sortBy:", sortBy, " startKey: ", startKey, " limit: ", limit)
//     db.query(sortBy, {
//         startKey: '',
//         limit: limit,
//         include_docs: true
//     }, function(err, response) {
//         if (err) {
//             return callback(err)
//         }
//         if (response) {
//             if (startKey !== '') {
//                 response.rows.shift()
//             }
//             callback(null, response.rows.map(convertPersons))
//         }
//     })
// }
function listShoes(sortBy, startKey, limit, callback) {
    queryDB(sortBy, startKey, limit, callback)
}

function getShoe(id, callback) {
    getShoeByID(id, callback)
}

function createShoes(data, callback) {
    if (typeof data == 'undefined' || data === null) {
        return callback(new Error('400 Missing Data'))
    } else {
        data.type = 'shoe'
        data._id = 'shoe_' + data.name
        db.post(data, function(err, response) {
            if (err) {
                return callback(err)
            }
            if (response) {
                callback(null, response)
            }
        })
    }
}

function createView(designDoc, callback) {
    if (typeof designDoc == 'undefined' || designDoc === null) {
        return callback(new Error('400 Missing data for createView'))
    } else {
        db.put(designDoc, function(err, response) {
            if (err) {
                return callback(err)
            }
            if (response) {
                return callback(null, response)
            }
        })
    }
}

var convertPersons = function(queryRow) {
    queryRow.doc.sortToken = queryRow.key
    return queryRow.doc
}

module.exports = dal
