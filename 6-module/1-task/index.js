const mongoose = require('mongoose');
const User = require('./User');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const users = new User({
  email: '111qwe@qwe.com',
  displayName:' ASDFGHJ '
});

users.save();

