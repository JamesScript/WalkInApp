// Dependencies
const mongoose = require('mongoose');

// Mongoose Connection
mongoose.connect(process.env.DB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => { console.log('connected to database') });

// Mongoose Schemas and Models
// User
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isRestaurant: Boolean
});
const User = mongoose.model('User', userSchema);

// Table
const tableSchema = new mongoose.Schema({
  numberOrName: String,
  ratings: [Number]
});
const Table = mongoose.model('Table', tableSchema);

// Exports
module.exports.table = Table;
module.exports.user = User;