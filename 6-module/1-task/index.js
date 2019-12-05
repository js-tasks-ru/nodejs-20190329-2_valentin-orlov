const mongoose = require('mongoose');
const User = require('./User');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// const Cat = mongoose.model('Cat', { name: String });
const users = new User({
  email: '111qwe@qwe.com',
  displayName:' ASDFGHJ '
});
console.log(users);
users.save()
  .then(() => console.log('meow'))
  .catch((err) => console.log(err));

