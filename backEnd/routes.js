const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const models = require('./models');
const passportSetup = require('./passportSetup');

module.exports = (app, socket) => {  
  // Passport Set Up, authentication, session etc.
  passportSetup(app);

  // Am I Logged In? Returns Boolean
  app.get("/amILoggedIn", (req, res) => {
    res.send(typeof req.user === "object");
  });
  
  // User Data
  app.get("/userData", (req, res) => {
    // don't send back password even hashed for obvioius reasons
    let sendBack;
    if (req.user) {
      sendBack = {
        username: req.user.username,
        realname: req.user.realname,
        isRestaurant: req.user.isRestaurant
      }
    }
    res.send(sendBack);
  });
  
  // Login - authenticate using passport-local npm package
  app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      // console.log("login reached on routes.js");
      // res.redirect('/');
      res.send(req.user);
  });
  
  // Log out
  app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  // Register user
  app.post('/register', (req, res) => {
    // Check if username exists, if not - go ahead and save the new user
    models.user.find({username: req.body.username}, (err, docs) => {
      if (err) return console.error(err);
      // If username already exists:
      if (docs.length > 0) {
        return res.send("username exists");
      }
      // Good to go if not returned by this point
      bcrypt.hash(req.body.password, process.env.SALT_ROUNDS*1, (err, hash) => {
        const newUser = new models.user({
          realname: req.body.realname,
          username: req.body.username,
          password: hash,
          isRestaurant: req.body.isRestaurant,
          dateCreated: new Date(),
          tables: [],
          shortid: shortid.generate()
        });
        newUser.save((err) => {
          if (err) return console.error(err);
          return res.send("registration successful");
        });
      });
    });
  });
  
  // Add multiple tables in one go
  app.post('/addMultiTables', (req, res) => {
    models.user.find({username: req.user.username}, (err, docs) => {
      if (err) return console.error(err);
      let tables = docs[0].tables;
      const tableNames = tables.map(table => table.numberOrName);
      for (let i = 1; i <= req.body.tables*1; i++) {
        if (!tableNames.includes('Table_'+i)) {
          tables.push(new models.table({
            numberOrName: 'Table_'+i,
            available: true,
            ratings: []
          }));
        }
      }
      models.user.findOneAndUpdate({username: req.user.username}, {tables: tables}, err => {
        if (err) return console.error(err);
        res.send('tables updated');
      });
    });
  });
  
  // Add a table with your custom name (e.g. 'outdoor_1') 
  app.post('/addCustomTable', (req, res) => {
    models.user.find({username: req.user.username}, (err, docs) => {
      if (err) return console.error(err);
      let tables = docs[0].tables;
      const tableNames = tables.map(table => table.numberOrName);
      if (!tableNames.includes(req.body.tableName)) {
        tables.push(new models.table({
          numberOrName: req.body.tableName,
          available: true,
          ratings: []
        }));
        models.user.findOneAndUpdate({username: req.user.username}, {tables: tables}, err => {
          if (err) return console.error(err);
          res.send('tables updated');
        });
      } else {
        res.send('table not updated - name already exists');
      }
    });
  });
  
  // List All Tables - this will be the data sent every time socket.io emits so all users can see real-time updates
  app.get('/listAllTables', (req, res) => {
    models.user.find({isRestaurant: true}, (err, docs) => {
      let tablesToSend = []
      docs.forEach(doc => {
        tablesToSend.push({restaurant: doc.realname, shortid: doc.shortid, tables: doc.tables});
      });
      res.send(tablesToSend);
    });
  });
  
  // List My Tables - for own Restaurant Settings
  app.get('/listMyTables', (req, res) => {
    if (req.user) {
      models.user.find({username: req.user.username}, (err, docs) => {
        res.send(docs[0].tables);
      });
    }
  });
  
  // Delete a table
  app.post('/deleteTable', (req, res) => {
    models.user.find({username: req.user.username}, (err, docs) => {
      if (err) return console.error(err);
      let tables = docs[0].tables;
      tables = tables.filter(table => table.numberOrName !== req.body.tableToDelete);
      console.log(req.body);
      console.log(tables);
      models.user.findOneAndUpdate({username: req.user.username}, {tables: tables}, err => {
        if (err) return console.error(err);
        res.send('tables updated');
      });
    });
  });
  
  // Delete All Tables
  app.post('/removeAllTables', (req, res) => {
    models.user.findOneAndUpdate({username: req.user.username}, {tables: []}, err => {
      if (err) return console.error(err);
      res.send('tables updated');
    });
  });
  
  // Toggle Whether A Table is Available or Not
  app.post('/toggleAvailability', (req, res) => {
    models.user.find({username: req.user.username}, (err, docs) => {
      if (err) return console.error(err);
      let tables = docs[0].tables;
      tables = tables.map(table => {
        if (req.body.tableToToggle === table.numberOrName) {
          table.available = !table.available;
        } 
        return table;
      });
      models.user.findOneAndUpdate({username: req.user.username}, {tables: tables}, err => {
        if (err) return console.error(err);
        res.send('tables updated');
      });
    });
  });
  
  // Rate A Table from 0 - 5
  app.post('/rateTable', (req, res) => {
    models.user.find({realname: req.body.restaurant}, (err, docs) => {
      if (err) return console.error(err);
      // Cannot rate tables in own restaurant
      if (docs[0].username === req.user.username) return res.send('You cannot rate your own tables');
      let tables = docs[0].tables;
      tables = tables.map(table => {
        if (req.body.tableName === table.numberOrName) {
          const usersWhoHaveRated = table.ratings.map(rating => rating.username);
          // If this is the first time the user has rated, add them to the ratings array
          if (!usersWhoHaveRated.includes(req.user.username)) {
            table.ratings.push({
              username: req.user.username,
              rating: req.body.rating
            });
          } else {
            // If this is not the first time, overwrite their previous rating
            table.ratings = table.ratings.map(rating => {
              if (rating.username === req.user.username) {
                rating.rating = req.body.rating;
              }
              return rating;
            });
          }
        } 
        return table;
      });
      models.user.findOneAndUpdate({realname: req.body.restaurant}, {tables: tables}, err => {
        if (err) return console.error(err);
        res.send('Ratings successfully updated');
      });
    });
  });
}