var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/UNApp');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstNameLetter: String,
  schoolFriendCount: String,
  userProfId: String,
  userGender: String,
  userEmail: String,
  personalEvents: Object,
  allEvents: Object,
  school: String
});

var schoolSchema = new Schema({
  emailEnding: String,
  schoolFriendMin: Number,
  schoolName: String,
  schoolLongMax: String,
  schoolLongMin: String,
  schoolLatMax: String,
  schoolLatMin: String
});

// var binghamtonSchema = new schoolSchema({
// 	schoolLongMax:'-75.4',
// 	schoolLongMin: '-76.1',
// 	schoolLatMax: '42.4',
// 	schoolLatMin: '41.7',
// 	schoolFriendMin: 60,
// 	schoolName: 'Binghamton',
// 	emailEnding:'@binghamton.edu'
// });

var User = mongoose.model('User', userSchema);

var School = mongoose.model('School', schoolSchema);

// exports.Binghamton = mongoose.model('Binghamton', binghamtonSchema);

module.exports = {
  School: School
}
