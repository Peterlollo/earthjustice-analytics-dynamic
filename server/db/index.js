const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/earthjustice';

const pool = new Pool({
  connectionString: connectionString,
})

const client = new Client({
  connectionString: connectionString,
})
client.connect()


const query = (text, params, callback) => {
   return pool.query(text, params, callback)
}

client.query('CREATE TABLE IF NOT EXISTS watchlist (provider varchar(450) NOT NULL)')
client.query('CREATE TABLE IF NOT EXISTS whitelist (provider varchar(450) NOT NULL, sector varchar(450) NOT NULL)')

// client.end()

module.exports = {
  query: query
}
