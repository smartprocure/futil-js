var f = require('futil-js')

var cities = ['London', 'Boston', 'Lisbon']

f.dotJoinWith(c => c.startsWith('L'))(cities)
// "London.Lisbon"

f.arrayToObject(c => c.toLowerCase(), c => c.toUpperCase())(cities)
// {boston: "BOSTON", lisbon: "LISBON", london: "LONDON"}
