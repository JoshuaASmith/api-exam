const express = require('express')
var app = express()
const dal = require('../DAL/no-sql.js')
var http = require('http')
const HTTPError = require('node-http-error')
const port = process.env.PORT || 4000
var bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
app.use(bodyParser.json())
/////////////////////////////////////
/////////// GET FUNCTIONS ///////////
/////////////////////////////////////

app.get('/shoe/:id', function(req, res, next) {
    const shoeID = req.params.id
    console.log("shoe id is: ", shoeID)
    dal.getShoe(shoeID, function(err, data) {
        if (err) {
            return next(new HTTPError('400 No Shoe Found'))
        }
        if (data) {
            res.append('Content-type', 'application/json')
            res.send(data)
        }
    })
})

/////////////////////////////////////
/////////// POST FUNCTIONS //////////
/////////////////////////////////////
app.post('/shoes', function(req, res, next) {
    console.log(req.body)
    dal.createShoes(req.body, function(err, data) {
        if (err) {
            return next(new HTTPError('400 No Data to Add'))
        }
        if (data) {
            res.send(data)
        }
    })
})
/////////////////////////////////////
/////////// LIST FUNCTIONS //////////
/////////////////////////////////////

app.get('/shoe', function(req, res, next) {
    const couchView = 'shoeSort'
    const type = req.params.type
    dal.listShoe(couchView, type, function callback(err, data) {
        if (err) {
            var responseError = buildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
            console.log('GET', + req.path, ' query: ', req.query, data)
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

app.get('*', function(req, res) {
    var body = '<h1>404 - Page Not Found</h1>'
    body += '<ul>'
    body += '<li>METHOD: ' + req.method + '</li>'
    body += '<li>PATH: ' + req.path + '</li>'
    body += '<li>QUERY: ' + JSON.stringify(req.query, null, 2) + '</li>'
    body += '</ul>'
    res.send(body)
})

app.use(function(err, req, res, next) {
    console.log(err)
    res.status(err.status || 500)
    res.send(err.message)
})

app.get('/bad', function(req, res, next) {
    var firstErr = new HTTPError(500, 'error', {m: "Please try another route"})
    return next(firstErr)
})

var server = http.createServer(app)

server.listen(port, function() {
    console.log('Serverd on', server.address())
})
