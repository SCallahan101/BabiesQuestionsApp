const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// what other data do you require inside the user schema - ex. users post references etc?
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.set('timestamps', true);

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username
  };
};

userSchema.methods.validatePassword = function(pwd) {
  const currentUser = this;
  return bcrypt.compare(pwd, currentUser.password);
};

userSchema.statics.hashPassword = function(pwd) {
  return bcrypt.hash(pwd, 10);
};

module.exports = mongoose.model('User', userSchema);
