var mongoose = require('mongoose');

if(process.env.NODE_ENV === "production") {
	mongoose.connect(process.env.MONGOLAB_URI);
} else {
  mongoose.connect('mongodb://localhost/UNApp');
}
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstNameLetter: String,
  schoolFriendCount: String,
  userProfId: String,
  userAge: String,
  userGender: String,
  userName: String,
  userEmail: String,
  entranceEmail: String,
  followers: [],
  following: [],
  notifications: [],
  watchList: [],
  privateEvents: {},
  userSchool: String
});

//event schema

//name of the event is the key
//description: string
// cover: string(image source url)
// privacy: string (OPEN,SECRET)
// start_time: string (2014-03-22T21:00:00-0400')
// location: string (65 Front Street Binghamton NY')
// name: string (Awesome Frat Party!)
// venue: object (includes venue info including long, lat)
// id: number (facebook event id i believe)
// longitude: string ("Longitude: (val)")
// latitude: string ("Latitude: (val)")



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
  emailLength: Number,
  inviteNum: Number,
  ticketCount: Number
});

var schoolUserSchema = new Schema({
  schoolName: String,
  userEmails: []
});

var privateListSchema = new Schema({
  events: {}
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

var PrivateList = mongoose.model('PrivateList', privateListSchema);

var SchoolUserSchema = mongoose.model('SchoolUserSchema', schoolUserSchema);

// exports.Binghamton = mongoose.model('Binghamton', binghamtonSchema);

module.exports = {
  School: School,
  User: User,
  PrivateList: PrivateList,
  SchoolUserSchema: SchoolUserSchema
}
