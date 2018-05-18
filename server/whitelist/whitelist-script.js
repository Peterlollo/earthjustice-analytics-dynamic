var fs = require('fs')
var csv = require('csv')
var Provider = require('./provider')

var input = fs.createReadStream('./server/provider/all-audiences.csv')
var parser = csv.parse({
  delimiter: ',',
  columns: true
})

var transform = csv.transform(function (row) {
  for (var sector in row) { // a sector corresponds to a column header on the google spreadsheet
    var providerName = row[sector]
    if (providerName) { // checks that a value was entered for this column on this row
      const resultObj = {
        name: providerName,
        important: true,
        sector: sector
      }
      Provider
        .findOrCreate({
          where: { name: providerName },
          defaults: resultObj
        })
        .spread((provider, created) => {
          if (!created) { // if provider already existed in db, update it
            provider.update({important: true, sector: resultObj['sector']})
          }
        })
    }
  }
})

input.pipe(parser).pipe(transform)
