const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()
app.use(history())
app.use(express.static(path.join(__dirname, '/../dist')))

const port = process.env.PORT || 5000

require('./config/middleware.js')(app, express)
require('./config/routes.js')(app, express)

app.listen(port)
console.log('server started ' + port)
