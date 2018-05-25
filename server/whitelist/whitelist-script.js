var fs = require('fs')
var csv = require('csv')

var input = fs.createReadStream('./server/whitelist/all-audiences.csv')
var parser = csv.parse({
  delimiter: ',',
  columns: true
})

var providers = {}

var transform = csv.transform(function (row) {
  for (var sector in row) { // a sector corresponds to a column header on the google spreadsheet
    var providerName = row[sector]
    if (providerName) { // checks that a value was entered for this column on this row
      const resultObj = { sector }
      providers[providerName] = resultObj
    }
  }
  providersJSON = JSON.stringify(providers, null, 2)
  fs.writeFileSync('./server/whitelist/whitelist.json', providersJSON, 'utf-8')
})

input.pipe(parser).pipe(transform)
