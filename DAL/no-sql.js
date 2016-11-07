const path = require('path')
const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const fetchConfig = require('zero-config')
var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'})
const urlFormat = require('url').format
const db = new PouchDB(urlFormat(config.get("couch")))

var dal = {
    getShoe: getShoe,
    createShoes: createShoes,
    createView: createView,
    listShoe: listShoe,
    updateShoe: updateShoe,
    deleteShoe: deleteShoe
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

function listShoe(couchView, type, callback) {
    db.query(couchView, {
        include_docs: true,
        key: type
    }, function(err, queryRows) {
        if (err) {
            return callback(err)
        }
        if (queryRows) {
            callback(null, queryRows.rows.map(row => row.doc))
            //callback(null, queryRows.rows.map(row => row.doc.team))
            //callback(null, queryRows)
        }
    })
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

function updateShoe(data, callback) {
    db.put(data, function(err, response) {
        if (err) {
            return callback(err)
        }
        if (response) {
            return callback(null, response)
        }
    })
}

function deleteShoe(data, callback) {
    db.remove(data, function(err, response) {
        if (err) {
            return callback(err)
        }
        if (response) {
            return callback(null, response)
        }
    })
}

module.exports = dal
