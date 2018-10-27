const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/earthjustice';

const pool = new Pool({
  connectionString: connectionString,
})

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

const client = new Client({
  connectionString: connectionString,
})
client.connect()


const query = (text, params, callback) => {
   return pool.query(text, params, callback)
}

// const text = `INSERT INTO "watchlist"(provider) VALUES ('abbot laboratories')`

// callback
// client.query('CREATE TABLE IF NOT EXISTS watchlist (provider varchar(450) NOT NULL)')
// client.query('CREATE TABLE IF NOT EXISTS whitelist (provider varchar(450) NOT NULL, sector varchar(450) NOT NULL)')
// client.query('SELECT * from watchlist', null, (err, res) => {
// 	if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// })
// client.query(text, null, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   }
// })

// client.end()

module.exports = {
  query: query
}
