const path = require('path')
const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const fetchConfig = require('zero-config')
var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'})
const urlFormat = require('url').format
const db = new PouchDB(urlFormat(config.get("couch")))

var dal = {
    listShoes: listShoes,
    getShoes: getShoes,
    createShoes: createShoes,
    createView: createView
}

function listShoes(sortBy, startKey, limit, callback) {
    db.query(sortBy, {
        startKey: '',
        limit: limit,
        include_docs: true
    }, function(err, response) {
        if (err) {
            return callback(err)
        }
        if (response) {
            callback(null, response.rows.map(row => row.doc))
        }
    })
}

function getShoes(id, callback) {
    db.get(id, function(err, response) {
        if (err) {
            return callback(err)
        }
        if (response) {
            return callback(response)
        }
    })
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

module.exports = dal
