const mongoose = require('mongoose');

mongoose.set("useFindAndModify", false);
mongoose.connect('mongodb://localhost/notes-db-app', {
  useCreateIndex: true,
  useNewUrlParser: true // useFindAndModify: false, useUnifiedTopology: true
})
  .then(db => console.log('DB is conected'))
  .catch(err => console.error(err));