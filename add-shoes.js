var dalNoSQL = require('./DAL/no-sql.js')

const shoeData = [
    {
        name: "Adidas Ultra Boost",
        description: "Triple White Running Sneaker",
        inStock: true,
        retailCost: "180.00",
        dateAvailable: "11/11/2016",
        type: "shoe"
    }, {
        name: "Adidas Crazy Light",
        description: "Basketball Shoes",
        inStock: false,
        retailCost: "125.00",
        dateAvailable: "9/03/2015",
        type: "shoe"
    }, {
        name: "NIKE Kyrie 2",
        description: "Basketball Shoes Pendelton Colorway",
        inStock: true,
        retailCost: "225.00",
        dateAvailable: "4/15/2016",
        type: "shoe"
    }, {
        name: "NIKE KD 8",
        description: "Basketball Shoes Olympic Colorway",
        inStock: true,
        retailCost: "160.00",
        dateAvailable: "7/11/2016",
        type: "shoe"
    }, {
        name: "Birkenstock",
        description: "Mens Arizona Sandal",
        inStock: true,
        retailCost: "135.00",
        dateAvailable: "2/01/2013",
        type: "shoe"
    }
]

function callback(err, response) {
    if (err) {
        return console.log(err.message)
    }
    if (response) {
        return console.log(null, response)
    }
}

shoeData.forEach(function(shoe) {
    dalNoSQL.createShoes(shoe, callback('Shoe(s) Added'))
})
