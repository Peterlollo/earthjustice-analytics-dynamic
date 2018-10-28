// This script was used to create the initial whitelist JSON file
// This script took the CSV information downloaded from the spreadsheet originally created 
// for Earthjustice by Measure Creative
// The CSV information is stored in the file entitled "all-audiences.csv"
// The CSV data is transformed through this script into a JSON file
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
