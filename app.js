
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var nodemailer = require('nodemailer');
var path = require('path');
var graph = require('fbgraph');
var swig = require('swig');
var app = express();
var conf = require('./config');
var models = require('./models');
var MongoStore = require('connect-mongo')(express);
var School = require('./models')["School"];
var User = require('./models')["User"];
var SchoolUserSchema = require('./models')["SchoolUserSchema"];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var today = new Date();
var currentDay = today.getDate();
var currentMonth = today.getMonth()+1; //January is 0
var currentYear = today.getFullYear();

//calculates age
// function getAge(dateString) {
//     var today = new Date();
//     var birthDate = new Date(dateString);
//     var age = today.getFullYear() - birthDate.getFullYear();
//     var m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//     }
//     return age;
// }


// //populates yourEvents for successful 1st queries
// var eventPopulater = function(listOfAllEvents){
// 			//start of pull from school events
// 				if (!schoolItem.schoolEvents){
// 					schoolItem.schoolEvents = {};
// 				}
// 				else{
// 					var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
// 					for (i=0;i<schoolEventsInAnArray.length;i++){
// 		 	 			if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){

// 								var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
// 								var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
// 				 	 			var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];

// 								if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
// 									yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
// 								}
// 						 }
// 					}
// 				}//end of school event pull
// 				//start of pull from fb result
// 				var allEventsInAnArray = Object.keys(listOfAllEvents);

// 				for (i=0;i<allEventsInAnArray.length;i++){
// 					if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
// 						yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
// 					}
// 					if (listOfAllEvents[allEventsInAnArray[i]].longitude){
// 						longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
// 						latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];
// 						//defining long and lat values

// 						if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){//if close to school

// 							yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
// 							if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
// 								schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
// 							}
// 						}
// 						if (listOfAllEvents[allEventsInAnArray[i]].location){
// 							if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){//if close to school
// 								yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
// 								if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
// 									schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
// 								 }
// 							}
// 						}
// 					}
// 				}

// 		}

// //populates your events and school events from your facebook events pulled 2
// var popYoursAndSchoolEvents = function(result){
// 						console.log('starting to populate with user pulled data');
// 						if(!schoolItem.schoolEvents){
// 							schoolItem.schoolEvents = {};
// 						}
// 						result.events.data.forEach(function(event){
// 						// console.log(event);
// 								startMonth = event.start_time.split('-')[1];
// 				 	 			startDay = event.start_time.split('-')[2].split('T')[0];
// 				 	 			startYear = event.start_time.split('-')[0];


// 				 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
// 				 	 				if(event.venue){
// 				 	 					if (event.venue.longitude){
// 										longValue = event.venue.longitude;
// 										latValue = event.venue.latitude;

// 										if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
// 											yourEvents[event.name.replace(/\./g,"")] = event;
// 											if(event.privacy!='SECRET'){
// 												schoolItem.schoolEvents[event.name.replace(/\./g,"")] = event;
// 											}
// 										}
// 										// else{
// 										// 	yourEvents[event.name.replace(/\./g,"")] = event;
// 										// }
// 									}
// 				 	 			}

// 								if (event.location){
// 										if (event.location.indexOf(schoolItem.schoolTown)>-1){
// 												yourEvents[event.name.replace(/\./g,"")] = event;
// 												if(event.privacy!='SECRET'){
// 													schoolItem.schoolEvents[event.name.replace(/\./g,"")] = event;
// 												}
// 										}
// 										// else{
// 										// 		yourEvents[event.name.replace(/\./g,"")] = event;
// 										// }
// 								}
// 								if (event.cover){
// 										// yourEvents[event.name.replace(/\./g,"")] = event;
// 				 	 					yourEvents[event.name.replace(/\./g,"")]['cover']=event.cover.source;
// 				 	 					if(event.privacy!='SECRET'){
// 												schoolItem.schoolEvents[event.name.replace(/\./g,"")]['cover']=event.cover.source;
// 										}
// 				 	 			}
// 									// else{
// 									// 	yourEvents[event.name.replace(/\./g,"")] = event;
// 									// }
// 							}
// 					});
// 				console.log('School Events Populated');

// 				}

// //checks friend education count
// var friendChecker = function(result){

// 			result.friends.data.forEach(function(friend){
//      		if (friend.education){
//      			friend.education.forEach(function(schoolObj){
//      				if(schoolObj.school){
// 	     				if (schoolObj.school.name.indexOf(schoolItem.schoolName)>-1){
// 	     					schoolFriendCount++;
// 	     				}
// 	     			}
//      			});}
//      	});
// 	console.log(schoolFriendCount);
// }

// //adds from school events to your events 1
// 	var pullSchoolEventsFunc = function(){
// 						if (!schoolItem.schoolEvents){
// 							schoolItem.schoolEvents = {};
// 						}
// 						else{
// 							var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
// 							for (i=0;i<schoolEventsInAnArray.length;i++){
// 				 	 			if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){
// 										var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
// 										var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
// 						 	 			var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];
// 										if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
// 											yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
// 										}
// 							}
// 						}
// 					}
// 			}


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render("index");
});

app.get('/denied', function(req, res){
  res.render("denied",{schoolName: schoolItem.schoolName});
});


app.post('/getSchool', function(req,res){
incSchoolName = req.body.schoolName;
console.log(incSchoolName);

School.findOne({schoolName: incSchoolName}, function(err, school){
		console.log('error?: '+err);
		schoolItem = school;
		console.log('Fetched Info for: '+incSchoolName);
    // console.log(JSON.stringify(schoolItem));
		res.json({Item: schoolItem});

	});
});

app.post('/ticketCount', function(req,res){
  incSchoolName = req.body.schoolName;
 School.findOne({schoolName: incSchoolName},function(err,school){
  console.log('error?: '+err);
    schoolItem = school;
    upCount = schoolItem.ticketCount+=1;

    School.findOneAndUpdate({schoolName: incSchoolName},
            {
             ticketCount: upCount
            },
            {upsert: true},
            function(err,res){
              if(err){console.log('upCount failed')}
              else{console.log("upCount success for : "+incSchoolName);}
            });
 });
});

app.post('/followCount', function(req,res){
  userProfId = req.body.userProfId;
 User.findOne({userProfId: userProfId},function(err,user){
  if(err){
    console.log('error?: '+err);
  }
  else{
    var count = user.following.length;
    res.json({count:count});
  }
    // schoolItem = school;
    // upCount = schoolItem.ticketCount+=1;
 });
});

app.post('/notifications', function(req,res){
  userProfId = req.body.userProfId;
 User.findOne({userProfId: userProfId},function(err,user){
  if(err){
    console.log('error?: '+err);
  }
  else{
    var notifications = user.notifications;
    res.json({notifications:notifications});
  }
    // schoolItem = school;
    // upCount = schoolItem.ticketCount+=1;
 });
});

app.post('/userSchoolPost',function(req,res){
	// console.log(req.body.userEmail);
  User.findOneAndUpdate({userEmail: req.body.userEmail},
            {
            userSchool: req.body.userSchool
            },
            {upsert: true},
            function(err,res){
              if(err){console.log(err.message)}
              else{

                  console.log("User School Updated for: "+req.body.userEmail);

              }
            });

      res.json({success:'Worked!'});

  });
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'unrepteam@gmail.com',
        pass: 'University'
    }
});

app.post('/userEventSubmit',function(req,res){
	// manualEventCount++;
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'UN App', // sender address
	    to: 'unrepteam@gmail.com', // list of receivers
	    subject: 'New Event Submitted ✔', // Subject line
	    text: 'New UN Event', // plaintext body
	    html: 'User Name: '+req.body.userName+'<br><br>User Email: '+req.body.userEmail+'<br><br>Event Name: '+req.body.eventName+'<br><br>Event Contact Email: '+req.body.eventEmail+'<br><br>Event Date: '+req.body.eventDate+'<br><br>Event Time (24 Hour Clock): '+req.body.eventTime+'<br><br>Event Address: '+req.body.eventAddress+'<br><br>Event Info: '+req.body.eventInfo+'<br><br>School: '+req.body.userSchool // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }
	    else{
	        console.log('Message sent: ' + info.response);
	    }
	});

      res.json({success:'Worked!'});

});
app.post('/newFriend', function(req,res){

fbFriends = req.body.fbFriends;
userName = req.body.userName;
userProfId = req.body.userProfId;

for(z=0;z<fbFriends.length;z++){
  // console.log(fbFriends[z].userName);
  // otherUser.notifications.push({message:message,date:notDate})
  message = "Your Facebook friend "+userName+" just joined U Nightlife. Tap this message to follow them!";
  notDate = "9/11/1210";
  tap = "follow";
  // fbFriends[z].notifications.push({message:message,date:notDate,tap:tap,followId:userProfId});
   User.update({userProfId: fbFriends[z].userProfId},
    {$pushAll: {notifications:[{message:message,date:notDate,tap:tap,followId:userProfId}]}},
            { multi: false },
            //upsert true
            function(err,red){
              if(err){console.log('friend joined un notifications update failed')}
              else{console.log("workeddddddddddddddddd");
          res.json({success:'Worked!'});
        }
            });

}



});


app.post('/findFriends', function(req,res){
fbFriends = req.body.fbFriends;
userIds = [];
userSchool = req.body.userSchool;
// users
// console.log(req.body.userProfId);

 User.find({userSchool: userSchool},
            function(err,req){
              if(err){
                console.log('trouble finding user school mates');
              }
              else{
                for(i=0;i<req.length;i++){
                   currentUserId=req[i].userProfId;

                  for(z=0;z<fbFriends.length;z++){
                    // console.log(fbFriends[z].name);
                    // console.log(fbFriends[z].id);
                    // console.log('res id'+res[i].id);
                    // if(res[i].userName=="Jonathanfp Salas"){
                    //   console.log('found justing');

                    // }
                     if(currentUserId==fbFriends[z].id){
                       // console.log('hierrereerre');
                        userIds.push(req[i]);
                     }
                  }
                }
              }
              res.json({userIds: userIds});
            });


  // console.log(res[0].id);
                // res.forEach()

//existing ids
//take fb friends array and limit it to only users that exists


});

app.post('/watchEvent', function(req,res){

  userProfId = req.body.userProfId;
  // followingId = req.body.followingId;
  message = req.body.message;
  message2 = req.body.message2;
  notDate = req.body.notDate;
  eventName = req.body.eventName;
  eventObj = req.body.eventObj;

  //push event into user watch list
 User.update({ userProfId: userProfId},
  {$pushAll: {watchList:[eventObj]}},
            {upsert: true},
            function(err,red){
              if(err){console.log('watch notification event update failed')}
              else{
                console.log("watch notification event update success");
                  //create notification for user
   User.update({ userProfId: userProfId},
  {$pushAll: {notifications:[{message:message,date:notDate}]}},
            {upsert: true},
            function(err,red){
              if(err){console.log('watch22 notification event update failed')}
              else{
                console.log("watch22 notification event update success");
                  //create notification for followers
User.findOne({ userProfId: userProfId},function(err,appUser){
  if(err){
    console.log('error?: '+err);
  }
  else{
    // console.log(appUser.userName);
    // console.log(appUser.followers.length);

    for(z=0;z<appUser.followers.length;z++){
      // console.log('IGOTHEREe');
  // console.log(fbFriends[z].userName);
  // otherUser.notifications.push({message:message,date:notDate})
  // message = "Your Facebook friend "+userName+" just joined U Nightlife. Tap this message to follow them!";
  // notDate = "9/11/1210";
  // tap = "follow";
  // fbFriends[z].notifications.push({message:message,date:notDate,tap:tap,followId:userProfId});
  // if(appUser.followers[])
  followerId = appUser.followers[z];

  // console.log(followerId);

   User.update({userProfId:followerId },
    {$pushAll: {notifications:[{message:message2,date:notDate}]}},
            {upsert: true},
            function(err,red){
              if(err){
                console.log('friend joined un notifications update failed')
              }
              else{
                console.log("workeddddddddddddddddd");
                // var a = z+=1;
                // if(a == appUser.followers.length){
                //   console.log("shamwowwwwww");

                // }
        }
            });

      }
      res.json({success:'Worked!'});


   }
});


            }
            });
                // res.json({success:'Worked!'});
            }
            });
});

app.post('/unwatchEvent', function(req,res){

  userProfId = req.body.userProfId;
  // followingId = req.body.followingId;
  message = req.body.message;
  message2 = req.body.message2;
  notDate = req.body.notDate;
  eventName = req.body.eventName;
  eventObj = req.body.eventObj;

  //pull event from user watch list
 User.update({ userProfId: userProfId},
   { $pull:  {"watchList" : [eventObj] } },
            {upsert: true},
            function(err,red){
              if(err){console.log('watch event pull failed')}
              else{
                console.log("watch event pull success");
                 res.json({success:'Worked!'});
              }
            });

                  //create notification for user
//    User.update({ userProfId: userProfId},
//   {$pushAll: {notifications:[{message:message,date:notDate}]}},
//             {upsert: true},
//             function(err,red){
//               if(err){console.log('watch22 notification event update failed')}
//               else{
//                 console.log("watch22 notification event update success");
//                   //create notification for followers
// User.findOne({ userProfId: userProfId},function(err,appUser){
//   if(err){
//     console.log('error?: '+err);
//   }
//   else{
//     // console.log(appUser.userName);
//     // console.log(appUser.followers.length);

//     for(z=0;z<appUser.followers.length;z++){
//       // console.log('IGOTHEREe');
//   // console.log(fbFriends[z].userName);
//   // otherUser.notifications.push({message:message,date:notDate})
//   // message = "Your Facebook friend "+userName+" just joined U Nightlife. Tap this message to follow them!";
//   // notDate = "9/11/1210";
//   // tap = "follow";
//   // fbFriends[z].notifications.push({message:message,date:notDate,tap:tap,followId:userProfId});
//   // if(appUser.followers[])
//   followerId = appUser.followers[z];

//   // console.log(followerId);

//    User.update({userProfId:followerId },
//     {$pushAll: {notifications:[{message:message2,date:notDate}]}},
//             {upsert: true},
//             function(err,red){
//               if(err){
//                 console.log('friend joined un notifications update failed')
//               }
//               else{
//                 console.log("workeddddddddddddddddd");
//                 // var a = z+=1;
//                 // if(a == appUser.followers.length){
//                 //   console.log("shamwowwwwww");

//                 // }
//         }
//             });

//       }
//       res.json({success:'Worked!'});


//    }
// });


            // }
            // });
            //     // res.json({success:'Worked!'});
            // }
            // });
});




  // console.log(eventName);
  // console.log(message);
  // console.log(notDate);
  // console.log(userProfId);
  // res.json({success:'Worked!'});

// User.findOne({ userProfId: userProfId},function(err,appUser){
//   if(err){
//     console.log('error?: '+err);
//   }
//   else{
//     // appUser = appUser;
//     if(appUser.notifications.indexOf(message)>-1){
//       console.log("user already has watch event notification");
//       // res.json({success:'follow already'});
//     }
//     else{
//        // appUser.following.push(followingId);

//     // User.update({ userProfId: userProfId},
//     //         {$pushAll: {following:[followingId]}},
//     //         {upsert: true},
//     //         function(err,red){
//     //           if(err){console.log('following update failed')}
//     //             else{

//     //             }
//   }
// }



//               else{
//                 console.log("following update for app user success");
//         User.findOne({ userProfId: followingId},function(err,otherUser){
//             if(err){
//               console.log('error?: '+err);
//             }
//             else{
//               // appUser = appUser;
//               // otherUser.followers.push(userProfId);
//               // otherUser.notifications.push({message:message,date:notDate});

//               User.update({ userProfId: followingId},
//             {$pushAll: {followers:[userProfId]},notifications:[{message:message,date:notDate}]},
//             {upsert: true},
//             function(err,red){
//               if(err){console.log('otheruser follower update failed')}
//               else{
//                 console.log("otheruser follower update success");
//                 res.json({success:'Worked!'});
//             }
//             });
//   }
//  });



// //                 // res.json({success:"following update success"});
//             }
            // });

    // }
 //  }
 // });




// });

app.post('/follow', function(req,res){

  userProfId = req.body.userProfId;
  followingId = req.body.followingId;
  message = req.body.message;
  notDate = req.body.notDate;

User.findOne({ userProfId: userProfId},function(err,appUser){
  if(err){
    console.log('error?: '+err);
  }
  else{
    // appUser = appUser;
    if(appUser.following.indexOf(followingId)>-1){
      console.log("other user is already being followed");
      res.json({success:'follow already'});
    }
    else{
       // appUser.following.push(followingId);

    User.update({ userProfId: userProfId},
            {$pushAll: {following:[followingId]}},
            {upsert: true},
            function(err,red){
              if(err){console.log('following update failed')}
              else{
                console.log("following update for app user success");
        User.findOne({ userProfId: followingId},function(err,otherUser){
            if(err){
              console.log('error?: '+err);
            }
            else{
              // appUser = appUser;
              // otherUser.followers.push(userProfId);
              // otherUser.notifications.push({message:message,date:notDate});

              User.update({ userProfId: followingId},
            {$pushAll: {followers:[userProfId]},notifications:[{message:message,date:notDate}]},
            {upsert: true},
            function(err,red){
              if(err){console.log('otheruser follower update failed')}
              else{
                console.log("otheruser follower update success");
                res.json({success:'Worked!'});
            }
            });
  }
 });



                // res.json({success:"following update success"});
            }
            });

    }
  }
 });




});


app.post('/unfollow', function(req,res){

  userProfId = req.body.userProfId;
  followingId = req.body.followingId;
  message = req.body.message;

User.findOne({ userProfId: userProfId},function(err,appUser){
  if(err){
    console.log('error?: '+err);
  }
  else{
    // appUser = appUser;
    // appUser.following.pop(followingId);

    User.update({ userProfId: userProfId},
      { $pull:  {"following" : followingId } },
            {upsert: true},
            function(err,red){
              if(err){
                console.log('unfollowing update failed')
              }
              else{
                console.log("unfollowing update success");
        User.findOne({ userProfId: followingId},function(err,otherUser){
          if(err){
            console.log('error?: '+err);
          }
          else{
            // appUser = appUser;
            // otherUser.followers.pop(userProfId);
            // for(q=0;q<otherUser.notifications.length;q++){
            //   if(otherUser.notifications[q].message==message){
            //     // arr1.splice(x,1);
            //     otherUser.notifications.splice(q,1);
            //     console.log("note Poppedd!!!!!!!!");
            //   }
            // }


            User.update({ userProfId: followingId},
              { $pull:  {"followers" : userProfId, "notifications" : {message:message} } },
            {upsert: true},
            function(err,red){
              if(err){console.log('2nd unfollow update failed')}
              else{
                console.log("2nd unfollow update success");
                res.json({success:'Worked!'});
            }
          });
         }
        });

            }
            });
  }
 });




});


  // User.findOneAndUpdate({ userProfId: userProfId},{following:}).exec(function (err, appUser) {
  //   if(err){
  //     console.log('error?'+err);
  //   }
  //   else{

  //     if(appUser){
  //       User.findOneAndUpdate({userEmail: req.body.userEmail},
  //           {firstNameLetter: req.body.firstNameLetter,
  //           userProfId: req.body.userProfId,
  //           userName: req.body.userName,
  //           userSchool: req.body.userSchool,
  //           privateEvents: req.body.privateEvents,
  //           userGender: req.body.userGender,
  //           entranceEmail: req.body.entranceEmail,
  //           userEmail: req.body.userEmail},
  //           {upsert: true},
  //           function(err,res){
  //             if(err){console.log(err.message)}
  //             else{console.log("User Info Updated for: "+req.body.userName);}
  //           });

  //     }
  //     else{
  //       console.log('Couldnt fetch user following list');
  //     }
  //   }

  // });
// });

app.post('/getUser', function(req,res){

//   User.update({userSchool: "George Washington University"},
//             {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
// User.update({userSchool: "University of Illinois at Urbana-Champaign"},
//             {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });

//     User.update({userSchool: "University of Hawaii"},
//           {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
//       User.update({userSchool: "Central Michigan University"},
//            {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
//        User.update({userSchool: "SUNY Oneonta"},
//             {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
//         User.update({userSchool: "University of Michigan"},
//             {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
         // User.update({userSchool: "SUNY Binghamton"},
         //   {
         //        watchList: []
         //    },
         //    { multi: true },
         //    //upsert true
         //    function(err,res){
         //      if(err){console.log('notifications update failed')}
         //      else{console.log("workeddddddddddddddddd");}
         //    });
//           User.update({userSchool: "University of Central Florida"},
//            {
//                 notifications: []
//             },
//             { multi: true },
//             //upsert true
//             function(err,res){
//               if(err){console.log('notifications update failed')}
//               else{console.log("workeddddddddddddddddd");}
//             });
      // console.log('stored school event data on server, responding');
      // res.json({success:'Worked!'});


//   User.update({userEmail:"nmg2225@yahoo.com"},{
//     followers: [],
//   following: [],
// },
//    {
//      upsert: true,
//      multi: true
//    }
// ).exec(function (err, follower) {
//     if(err){
//       console.log('follower worked!'+err);
//     }
//     else{
//       console.log('follower didnt work!'+err);

//     }});

  userEmail = req.body.userEmail;
  userSchool = req.body.userSchool;
  SchoolUserSchema.findOne({ schoolName: userSchool}).exec(function (err, schoolUserList) {
    if(err){
      console.log('error?'+err);
    }
    else{
      if(schoolUserList){
        console.log('Found School User List for: '+userSchool+' fetching user info');
         //checking the school list for email
          // console.log('school user list exists, fetching user info');
          if(schoolUserList.userEmails.indexOf(userEmail)>-1){
            console.log("Found user email, fetching user info.");
            User.findOne({ userEmail: userEmail}).exec(function (err, user){
              if(err){
                console.log('error?'+err);
              }
              else{
                console.log('user info sent back');
                res.json({Item: user});
              }
            })
          }
          else{
            console.log("User doesn't exist");
            user = "DE";
            res.json({Item: user});
          }
      }
      else{
        console.log('Couldnt fetch school user list');
      }
    }

  });
});

app.post('/schoolPost', function(req,res){
console.log('looking for ' + req.body.schoolName);

School.findOneAndUpdate({schoolName: req.body.schoolName},
            {
              schoolEvents: req.body.schoolEvents
            },
            {upsert: true},
            function(err,res){
              if(err){console.log('user maybe doesnt exist?')}
              else{console.log("School Events Updated: "+req.body.schoolName);}
            });
      console.log('stored school event data on server, responding');
      res.json({success:'Worked!'});

});

var regExNums = /[0-9]/g;

app.post('/userPost',function(req,res){
	if(!req.body.entranceEmail){
		req.body.entranceEmail="none";
	}
  if(!req.body.userEmail){
    req.body.userEmail=req.body.userProfId;
  }
  if(!req.body.userName){
    req.body.userName="none";
  }

			User.findOneAndUpdate({userEmail: req.body.userEmail},
		 				{firstNameLetter: req.body.firstNameLetter,
					  userProfId: req.body.userProfId,
					  userName: req.body.userName,
            userSchool: req.body.userSchool,
					  privateEvents: req.body.privateEvents,
					  userGender: req.body.userGender,
					  entranceEmail: req.body.entranceEmail,
					  userEmail: req.body.userEmail},
					  {upsert: true},
					  function(err,res){
					  	if(err){console.log(err.message)}
					  	else{console.log("User Info Updated for: "+req.body.userName);}
					  });

        SchoolUserSchema.update({schoolName: req.body.userSchool},
          {$pushAll: {userEmails:[req.body.userEmail]}},
            {upsert: true},
            function(err,res){
              if(err){console.log(err.message)}
              else{console.log("School User List Updated for: "+req.body.userSchool);}
            });

			console.log('stored user data on server, responding');
			res.json({success:'Worked!'});

});


app.post('/privateUserEventAdd',function(req,res){
 userEmail = req.body.userEmail;
      User.findOneAndUpdate({userEmail: userEmail},
              {privateEvents:req.body.privateEvents},{upsert: true},function(req,result){

                  console.log('User Private events saved for: ',userEmail);

              });

        res.json({success:'Worked!'});

});

// app.post('/loginTry2', function(req, res){
// 	 var loginTryEmail = req.body.name;
// 	 console.log(loginTryEmail);
// 	 loginTryEmail = loginTryEmail.toLowerCase();
// 	 if (schoolItem.schoolName=='Central Florida'||schoolItem.schoolName=='Michigan State'||schoolItem.schoolName=='University of Michigan'||schoolItem.schoolName=='University of Hawaii'||schoolItem.schoolName=='Central Michigan'){
// 			 	if((loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){
// 			 		schoolFriendCount=301;
// 			 		// pullSchoolEventsFunc();
// 			 		res.redirect('/personalEventDisplay');
// 			 	}
// 			 	else{
// 			 		res.redirect('/denied');
// 			 	}
// 	 }

// 	 else {
// 		 	if(loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.indexOf(' ')<0&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
// 			 	schoolFriendCount=301;
// 			 	res.redirect('/personalEventDisplay');
// 			  }
// 		 	else{
// 		 		res.redirect('/denied');
// 		 	}
// 	 }

// });

// app.get('/Login2', function(req, res){
//   res.render("Login2",{schoolName: schoolItem.schoolName});
// });

// app.get('/location/:locationID', function(req, res){
// 	var locationID = req.params.locationID.toString();
// 	yourEvents = {};
// 	listOfAllEvents = {};
// 	School.findOne({schoolName: locationID}, function(err, school){
// 		schoolItem = school;
// 		console.log(schoolItem);
// 		res.render("Login",{schoolName: schoolItem.schoolName});

// 	});
// });

// app.get('/personalEventDisplay', function(req, res) {
// 							School.findOneAndUpdate({schoolName: schoolItem.schoolName},
// 							{schoolEvents:schoolItem.schoolEvents},{upsert: true},function(req,res){
// 								console.log('School Events Saved');
// 							});
// 		console.log(schoolItem.schoolFriendMin);
// 		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){

// 		 	User.findOneAndUpdate({userProfId: userProfId},
// 		 				{firstNameLetter: firstNameLetter,
// 					  userProfId: userProfId,
// 					  userAge: userAge,
// 					  userName: userName,
// 					  privateEvents: privateEvents,
// 					  userGender: userGender,
// 					  userEmail: userEmail,
// 					  school: schoolItem.schoolName},
// 					  {upsert: true},
// 					  function(err,res){
// 					  	if(err){console.log(err.message)}
// 					  	else{console.log("User Updated: "+userName);}
// 					  });


// 			res.render('personalEventDisplay', {friends: yourEvents, school: schoolItem.schoolName});

// 		}
// 		else{
// 			res.render('Login2',{schoolName: schoolItem.schoolName});}
// 	});


// app.get('/allEvents', function(req, res) {
// 		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){
// 				res.render('allEvents', {friends: listOfAllEvents})}
// 		else{
// 			res.render('Login2',{schoolName: schoolItem.schoolName});}
// 	});




// app.get('/auth/facebook', function(req, res) {

//   if (!req.query.code) {
//     var authUrl = graph.getOauthUrl({
//         "client_id":     conf.client_id
//       , "redirect_uri":  conf.redirect_uri
//       , "scope":         conf.scope

//     });

//     if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
//       res.redirect(authUrl);
//     } else {  //req.query.error == 'access_denied'
//       res.send('access denied');
//     }
//     return;
//   }

//   // code is set
//   // we'll send that and get the access token
//   graph.authorize({
//       "client_id":      conf.client_id
//     , "redirect_uri":   conf.redirect_uri
//     , "client_secret":  conf.client_secret
//     , "code":           req.query.code

//   	}, function (err, facebookRes) {
//      graph.setAccessToken(facebookRes.access_token);
//      graph.setAppSecret(conf.client_secret);

//     graph.get("/me",function(err,result) {
// 			userProfId = result.id;
// 			userName = result.name;
// 			userGender = result.gender;
// 			userAge = getAge(result.birthday);
// 			if(result.email){
// 				userEmail = result.email.toLowerCase();
// 			}
// 			else{
// 				userEmail = 'none';
// 			}
// 			schoolFriendCount = 0;
// 			firstNameLetter = result.name[0].toLowerCase();
// //first query
// 	graph.get("/me?fields=friends.limit(670).fields(events.fields(description,cover,privacy,start_time,location,name,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))", function(err, firstQresult) {
// 		// firstQresult.friends=undefined;

// 		if(!firstQresult.friends){//if the first query broke/did not work

// 			User.findOne({userProfId: userProfId}, function(err, user){//look for the user

// 				if (user&&user.school==schoolItem.schoolName){//if user is already existing
// 					console.log('First query didnt work, User Exists');
// 					//skip education process, events, then display

// 					schoolFriendCount=301;//allow entrance
// 									//find their own events with a smaller query
// 					graph.get("/me?fields=events.limit(400).fields(cover,privacy,name,location,start_time,description,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+"))",function(err,smallResult){

// 							popYoursAndSchoolEvents(smallResult);
// 							pullSchoolEventsFunc();
// 							setTimeout(function() { res.redirect('personalEventDisplay'); },3400);
// 						})
// 				}
// 				else{//user does not exist
// 					console.log('first query didnt work, User does not Exist');

// 					graph.get("/me?fields=friends.limit(250).fields(education),events.limit(250).fields(cover,privacy,name,location,start_time,description,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+"))",function(err,queryResult){//do education and event grab
// 							popYoursAndSchoolEvents(queryResult);
// 							pullSchoolEventsFunc();
// 							friendChecker(queryResult);
// 							setTimeout(function() { res.redirect('personalEventDisplay'); },3400);
// 					})
// 				}
// 			});
// 		}//end of if original query didnt work
// 		else{//if original query did work
// 			User.findOne({userProfId: userProfId}, function(err, user){//search for user

// 				if(user&&user.school==schoolItem.schoolName){//if user exists
// 					schoolFriendCount=301;//allow access
// 					console.log('User exists and 1st query worked');
// 					console.log('One Users Events:');
// 		 			console.log(user.personalEvents);
// 					// redirectMe = 'yes';
// 				}
// 				else{//if user doesnt exist
// 					console.log('1st query worked, user doesnt exist, starting to scan education');
// 					graph.get("/me?fields=friends.limit(500).fields(education)",function(err,eduResult){

// 						console.log('got to friend checker');

// 						friendChecker(eduResult);


// 					});//end of education query
// 				}//else end of if user doesnt exist and 1st query worked

// //proceed to put all events into an object with event names being the keys
// 	 var friends = firstQresult.friends.data.filter(function(friend){
//  	 		if (friend.events){
//  	 			return true;
//  	 		}
//  	 });

// 	friends.forEach(function(friend){

// 		setEventsList = friend.events.data.map(function(singleEvent){

// 					startMonth = singleEvent.start_time.split('-')[1];
// 	 	 			startDay = singleEvent.start_time.split('-')[2].split('T')[0];
// 	 	 			startYear = singleEvent.start_time.split('-')[0];

// 	 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
// 			 	 		listOfAllEvents[singleEvent.name.replace(/\./g,"")] = singleEvent;
// 			 	 				if (singleEvent.venue){
// 			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['longitude']="Longitude: "+singleEvent.venue.longitude;
// 			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['latitude']="Latitude: "+singleEvent.venue.latitude;
// 			 	 				}
// 			 	 				if (singleEvent.cover){
// 			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['cover'] = singleEvent.cover.source;
// 			 	 				}

//  	 			}//end of date check
//  	 		});//set events list
// 		});//friends.forEach
// 			eventPopulater(listOfAllEvents);


// 		});//user.findone end
// 			setTimeout(function() {res.redirect('personalEventDisplay') },3400);
// 	}//end of else from query 1 succeeding




// 					});//end of graph.get(first query)

//  			});//graph.get(me) end

// 	}); //graph.authorize end
// }); //end of /auth/facebook


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


	// oneFriendsEvents = friend.events.data.map(function(singleEvent){

 	// eachFriend[friend.id] = oneFriendsEvents;



