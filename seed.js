// models = require('./models');
// var mongoose = require('mongoose');

// var SchoolUserSchema = models.SchoolUserSchema;

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "SUNY Oneonta",
//   userEmails: ["testemailOneonta@aol.com"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: Oneonta User Doc');
//                   // process.exit();
//                 }
//               });
// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "University of Central Florida",
//   userEmails: ["testemailCF@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: Central Florida User Doc');
//                   // process.exit();
//                 }
//               });


// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "SUNY Binghamton",
//   userEmails: ["testemailBU@aol.com"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: BU User Doc');
//                   // process.exit();
//                 }
//               });

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "George Washington University",
//   userEmails: ["testemailGW@aol.com"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: GW User Doc');
//                   // process.exit();
//                 }
//               });
process.exit();

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "Michigan State University",
//   userEmails: ["testemailMS@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: Michigan State User Doc');
//                   process.exit();
//                 }
//               });
// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "University of Michigan",
//   userEmails: ["testemailUM@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: University of Michigan User Doc');
//                   // process.exit();
//                 }
//               });

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "University of Illinois at Urbana-Champaign",
//   userEmails: ["testemailUIUC@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: University of Illinois at Urbana-Champaign User Doc');
//                   // process.exit();
//                 }
//               });

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "University of Hawaii",
//   userEmails: ["testemailUH@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   // process.exit();
//                 }
//                 else{
//                   console.log('saved: University of Hawaii User Doc');
//                   // process.exit();
//                 }
//               });

// var schoolUserDoc = new SchoolUserSchema({
//   schoolName: "Central Michigan University",
//   userEmails: ["testemailCM@aol.com1"]
// });

// schoolUserDoc.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   process.exit();
//                 }
//                 else{
//                   console.log('saved: Central Michigan User Doc');
//                   process.exit();
//                 }
//               });



// var binghamtonUser = new SchoolUserSchema({
//   schoolEmails: ["testemail@aol.com1"]
// });

// binghamtonUser.save(function (err, saved) {
//                 if (err){
//                   return console.error(err);
//                   process.exit();
//                 }
//                 else{
//                   console.log('saved: Binghamton User Doc');
//                   process.exit();
//                 }
//               });

// var School = models.School;


// var mongoose = require('mongoose');

// School.remove({}, function(err) {
//    console.log('collection removed')


// console.log("Inserting data");

// var schoolUpload = (function(){
// 				var school = new School({
// 				  schoolLongMax: '-75.4',
// 				  schoolLongMin: '-76.1',
// 				  schoolLatMax: '42.4',
// 				  schoolLatMin: '41.7',
// 				  schoolFriendMin: 30,
// 				  schoolName: 'Binghamton',
// 				  schoolTown: 'Binghamton',
// 				  emailEnding: '@binghamton.edu',
// 				  emailLength: 18,
// 				  schoolEvents: {} });


// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: SB');
// 							  }
// 							});


// 				var school = new School({
// 				  schoolLongMax : "-76.8", schoolLongMin : "-77.3", schoolLatMax : "39.1", schoolLatMin : "38.4", schoolFriendMin : 30, schoolName : "George Washington University", schoolTown : "District of Columbia",schoolEvents: {}, emailEnding : "gwu.edu", emailLength : 11 });

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: GW');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-74.8", schoolLongMin : "-75.4", schoolLatMax : "42.7", schoolLatMin : "42.1", schoolFriendMin : 30, schoolName : "SUNY Oneonta",schoolEvents: {}, schoolTown : "Oneonta", emailEnding : "@suny.oneonta.edu", emailLength : 20 });

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: SO');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-80.9", schoolLongMin : "-81.6", schoolLatMax : "28.9", schoolLatMin : "28.3", schoolFriendMin : 30,schoolEvents: {}, schoolName : "University of Central Florida", schoolTown : "Orlando", emailEnding : "@knights.ucf.edu", emailLength : 19});

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: CFU');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-84.22", schoolLongMin : "-84.64", schoolLatMax : "43", schoolLatMin : "42.55", schoolFriendMin : 30,schoolEvents: {}, schoolName : "Michigan State University", schoolTown : "East Lansing", emailEnding : "@msu.edu", emailLength : 11 });

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: MS');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-83.45", schoolLongMin : "-83.95", schoolLatMax : "42.5", schoolLatMin : "42", schoolFriendMin : 30,schoolEvents: {}, schoolName : "University of Michigan", schoolTown : "Ann Arbor", emailEnding : "@umich.edu", emailLength : 13});

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: UM');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-84.65", schoolLongMin : "-84.99", schoolLatMax : "43.64", schoolLatMin : "43.35", schoolFriendMin : 30,schoolEvents: {}, schoolName : "Central Michigan University", schoolTown : "Mt Pleasant", emailEnding : "@cmich.edu", emailLength : 13});

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: CMU');
// 							  }
// 							});

// 				var school = new School({schoolLongMax : "-157.6", schoolLongMin : "-158", schoolLatMax : "21.49", schoolLatMin : "21.05", schoolFriendMin : 30,schoolEvents: {}, schoolName : "University of Hawaii", schoolTown : "Manoa", emailEnding : "@hawaii.edu", emailLength : 14 });

// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: UH');
// 							  }
// 							});

// 				var school = new School({ schoolLongMax : "-88", schoolLongMin : "-88.5", schoolLatMax : "40.5", schoolLatMin : "39.8", schoolFriendMin : 30,schoolEvents: {}, schoolName : "University of Illinois at Urbana-Champaign", schoolTown : "Champaign", emailEnding : "@illinois.edu", emailLength : 15 });
// 				school.save(function (err, saved) {
// 							  if (err){ return console.error(err);}
// 							  else{
// 							  	console.log('saved: UI');
// 							  	setTimeout(process.exit,3000);
// 							  }
// 							});


// });
// schoolUpload();
// });


