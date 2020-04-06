const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/notes-db-app', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(db => console.log('DB is conected'))
  .catch(err => console.error(err));

