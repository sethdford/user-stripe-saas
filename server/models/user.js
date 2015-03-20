var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var stripeCustomer = require('./plugins/stripe-customer');
var secrets = require('../config/secrets');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  // Verified
  verfiy: {
    status: { type: Boolean, default: false },
    verifedToken: String,
    verifedExpires: Date
  },

  // Admin Users / Sales Users Details
  updated: { type: Date, default: Date.now },
  admin: { type: Boolean, default: false },

  // User basic Information
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' },
    age: { type: Number, min: 18, max: 120 }
  },

  // Users Company Listing
  listing: {

    // Business Name
    name: String,

    // Business Contact Information
    contact: {
      phone: Number,
      cell: Number,
      fax: Number,
       website: { type: String }
    },

    // Business Social Media accounts
    social: {
      facebook: String,
      linkedin: String,
      twitter: String,
      google: String
    },

    // Business Address
    address: {
      street: String,
      state: String,
      zipcode: { type: Number,  min: 5, max: 5 },

      // Business Geolocation from Zipcode
      geo: {
        lat: Number,
        lng: Number
      }

    },

    // Business Paid Features
    paid: {
      images:{ type: Array, max: 5 },
      subdomain: { type: String, unique: true, lowercase: true }
    }

  },

  // User Password Reset Options
  resetPasswordToken: String,
  resetPasswordExpires: Date

});

var stripeOptions = secrets.stripeOptions;

userSchema.plugin(stripeCustomer, stripeOptions);

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
