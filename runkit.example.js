var F = require('futil-js')

var cities = ['London', 'Boston', 'Lisbon']

F.dotJoinWith((c) => c.startsWith('L'))(cities)
// "London.Lisbon"

F.arrayToObject(
  (c) => c.toLowerCase(),
  (c) => c.toUpperCase()
)(cities)
// {boston: "BOSTON", lisbon: "LISBON", london: "LONDON"}
