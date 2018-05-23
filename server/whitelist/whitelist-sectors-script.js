var fs = require('fs')
var csv = require('csv')

var input = fs.createReadStream('./server/whitelist/all-audiences.csv')
var parser = csv.parse({
  delimiter: ',',
  columns: true
})

var sectorsObject = {
  sectors: []
}

var transform = csv.transform(function (row) {
  for (var sector in row) { // a sector corresponds to a column header on the google spreadsheet
    if (sectorsObject.sectors.indexOf(sector) === -1) {
      sectorsObject.sectors.push(sector)
    }
  }
  var sectorsJSON = JSON.stringify(sectorsObject, null, 2)
  fs.writeFileSync('./server/whitelist/whitelist-sectors.json', sectorsJSON, 'utf-8')
})

input.pipe(parser).pipe(transform)
