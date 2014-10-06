
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

app.post('/getUser', function(req,res){
  User.Update({userSchool: "George Washington University"},
            {
                followers: [],
  following: [],
            },
            {upsert: true},
            function(err,res){
              if(err){console.log('user maybe doesnt exist?')}
              else{console.log("workeddddddddddddddddd");}
            });
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



