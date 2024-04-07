const Pool = require('pg').Pool
const pool = new Pool({
    user: '', // fill in username
    host: '', // fill in hostname
    database: '', // fill in database name
    password: '', // fill in password
    port: 0, // fill in port number
})

module.exports = pool;