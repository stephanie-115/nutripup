const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'stal5',
  database: 'Nutripup'
});


module.exports = {
  query: (text, params, callback) => {
    console.log('execute query:', text);
    return pool.query(text, params, callback);
  }
};