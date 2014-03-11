var mongoose = require('mongoose');

if(process.env.NODE_ENV === "production") {
	mongoose.connect("mongodb://heroku_app22911946:3a257utnok8p61i3oj8incvr2v@ds033419.mongolab.com:33419/heroku_app22911946");
} else {
  mongoose.connect('mongodb://localhost/UNApp');
}
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstNameLetter: String,
  schoolFriendCount: String,
  userProfId: String,
  userGender: String,
  userName: String,
  userEmail: String,
  personalEvents: {},
  allEvents: {},
  school: String
});

var schoolSchema = new Schema({
  emailEnding: String,
  schoolFriendMin: Number,
  schoolName: String,
  schoolLongMax: String,
  schoolLongMin: String,
  schoolLatMax: String,
  schoolLatMin: String,
  schoolTown: String,
  schoolEvents: {},
  emailLength: Number
});

// var eventsSchema = new Schema ({

// })

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
  School: School,
  User: User
}
