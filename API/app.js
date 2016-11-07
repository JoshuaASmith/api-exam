const express = require('express')
var app = express()
const dal = require('../DAL/no-sql.js')
var http = require('http')
const HTTPError = require('node-http-error')
// body parser?
var bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
app.use(bodyParser.json())
const port = process.env.PORT || 4000
/////////////////////////////////////
/////////// GET FUNCTIONS ///////////
/////////////////////////////////////

app.get('/shoes/:id', function(req, res, next) {
    dal.getShoes
})

app.get('*', function(req, res) {
    var body = '<h1>404 - Page Not Found</h1>'
    body += '<ul>'
    body += '<li>METHOD: ' + req.method + '</li>'
    body += '<li>PATH: ' + req.path + '</li>'
    body += '<li>QUERY: ' + JSON.stringify(req.query, null, 2) + '</li>'
    body += '</ul>'
    res.send(body)
})

/////////////////////////////////////
/////////// POST FUNCTIONS //////////
/////////////////////////////////////
app.post('/shoes', function(req, res) {
    dal.createShoes
})
/////////////////////////////////////
/////////// LIST FUNCTIONS //////////
/////////////////////////////////////

app.get('/shoes', function(req, res, next) {
    const sortByParam = 'shoeSort'
    const sortBy = sortByParam
    const sortToken = req.query.sorttoken || ''
    const limit = req.query.limit || 5
    dal.listShoes(sortBy, sortToken, limit, function callback(err, response) {
        if (err) {
            return next(new HTTPError('400 No Data'))
        }
        if (data) {
            console.log('GET' + req.path, " query: ", req.query, data)
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

///////////////////////////////////////
/////////// HELPER FUNCTIONS //////////
///////////////////////////////////////

function callback(req, res, next) {
    return function(err, response) {
        if (err) {
            return next(new Error(error.status, error.message, error))
        }
        console.log('METHOD:', req.method, '\nPATH:', req.path, '\nRESPONSE:', response)
        res.send(response)
    }
}

function buildResponseError(err, req) {
    const statuscheck = isNaN(err.message.substring(0, 3)) === true
        ? '400'
        : err.message.substring(0, 3)
    const status = err.status
        ? Number(err.status)
        : Number(statuscheck)
    const message = err.status
        ? err.message
        : err.message.substring(3)
    const reason = message
    const error = status === 400
        ? 'Bad Request'
        : err.name
    const name = error
    var errormsg = {
        error: error,
        status: status,
        message: message,
        //method: req.method,
        //path: req.path
    }
    console.log('BuildResponseError-->', errormsg)
    return errormsg
}

app.use(function(err, req, res, next) {
    console.log(err)
    res.status(err.status || 500)
    res.send(err.message)
})

app.get('/bad', function(req, res, next) {
    var firstErr = new HTTPError(500, 'error', {m: "Please try another route"}) //can add extra info for dev
    return next(firstErr)
})

var server = http.createServer(app)

server.listen(port, function() {
    console.log('Serverd on', server.address())
})
