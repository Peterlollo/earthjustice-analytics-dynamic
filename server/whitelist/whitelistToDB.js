// This script was used to transfer the whitelist JSON file information into a postgres db
const db = require('../db')
const whitelistJSON = require('./whitelist.json')

const providers = Object.keys(whitelistJSON)
const limit = providers.length
const addToDB = (index) => {
	const provider = providers[index]
	const sector = whitelistJSON[provider].sector
	const text = 'INSERT INTO whitelist(provider, sector) VALUES($1, $2)'
	db.query(text, [provider, sector])
	  .then((res) => {
	  	index++
	  	if (index < limit) {
	  		addToDB(index)
	  	}
	  })
	  .catch(e => console.error(e.stack))
} 

addToDB(0)
