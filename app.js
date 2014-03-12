
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var graph = require('fbgraph');
var swig = require('swig');
var app = express();
var conf = require('./config');
var models = require('./models');
var MongoStore = require('connect-mongo')(express);
var School = require('./models')["School"];
var User = require('./models')["User"];

// {
//     client_id:      '1474435556106076'
//   , client_secret:  '00afc8e4df8e0f46ce547c59bf67378b'
//   , scope:          'user_events, email, user_location,friends_events,friends_education_history'
//   , redirect_uri:   'http://localhost:3000/auth/facebook'
//   // , token: 'CAACEdEose0cBAJTrpLg7je3fbqs1Qo5OwFetvNnTzkPYLWZCcjceOWJGqD9uk7u5YuO7HPmAyuLiZBa04Dir0hm8jl4GCbPjzAR5wxuLncsO4fdoA2Ykct1KZAGqSitqofFfNnhF0gVtBBg1zCZAXLlxwPTZChsUAUtmo3iaTLAT90ZCx5c2hnsxCojGErSgAZD'

// };

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render("index");
});

app.get('/denied', function(req, res){
  res.render("denied");
});

var regExNums = /[0-9]/g;

app.post('/loginTry2', function(req, res){
	 var loginTryEmail = req.body.name;
	 // console.log(loginTryEmail);
	 loginTryEmail = loginTryEmail.toLowerCase();
	 // console.log(loginTryEmail);
	 // loginTryEmail = "N@BINGHAMTON.EDU"
	 // console.log(schoolItem.inspect());
	 // console.log(schoolItem.emailLength);
	 // console.log(schoolItem.schoolFriendMin);
	 // console.log(schoolItem.emailEnding);
	 // console.log(loginTryEmail.length);

	 // schoolItem.emailLength = 10;
	 if (schoolItem.schoolName=='Central Florida'||schoolItem.schoolName=='Michigan State'||schoolItem.schoolName=='University of Michigan'||schoolItem.schoolName=='University of Hawaii'){
			 	if((loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){
			 		schoolFriendCount=301;
			 		res.redirect('/personalEventDisplay');
			 	}
			 	else{
			 		res.redirect('/denied');
			 	}
	 }
	 // &&loginTryEmail.indexOf(' ')<0
	 //&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)

	 else {
		 	if(loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.indexOf(' ')<0&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
			 	schoolFriendCount=301;
			 	res.redirect('/personalEventDisplay');
			  }
		 	else{
		 		res.redirect('/denied');
		 	}
	 }

});

app.get('/Login2', function(req, res){
  res.render("Login2",{schoolName: schoolItem.schoolName});
});

app.get('/location/:locationID', function(req, res){
	var locationID = req.params.locationID.toString();

	// console.log(locationID);
	School.findOne({schoolName: locationID}, function(err, school){
		schoolItem = school;
		console.log(schoolItem);

		// console.log(locationID);
		// console.log(schoolItem.schoolEvents);
		// res.send(200);
		res.render("Login",{schoolName: schoolItem.schoolName});
		// ,{schoolName: schoolItem.schoolName}
	});
});
	// schoolLongMax = '-75.4';
	// schoolLongMin = '-76.1';
	// schoolLatMax = '42.4';
	// schoolLatMin = '41.7';
	// schoolFriendMin = 60;
	// schoolName = 'Binghamton';
	// emailEnding = '@binghamton.edu';
	// console.log(schoolItem);
	// models.School.find(function(err, result){
	// 	console.log(result);
	// });

// , {schoolName: schoolName}

// app.get('/michLogin', function(req, res){
//   res.render("Login");
// });


// //userProfId = result.id;
// 			userGender = result.gender;
// 			userEmail = result.email.toLowerCase();
// 			schoolFriendCount = 0;
// 			firstNameLetter = result.name[0].toLowerCase();


				// var allEventKeysInAnArray = Object.keys(listOfAllEvents);
				// var yourEventKeysInAnArray = Object.keys(yourEvents).forEach(function(eventKey){eventKey.replace(".","_");});

				// console.log(yourEventKeysInAnArray);

				// cleanAllEvents = allEventKeysInAnArray.forEach(function(eventKey){
				// 	eventKey.replace(".","_");
				// });
				// cleanYourEvents = yourEventKeysInAnArray.forEach(function(eventKey){
				// 	eventKey.replace(".","_");
				// });
								// for(var index in yourEvents) { var attr = object[index];
				// 	console.log(attr);
				// }
				// friendlyEvents = yourEvents.forEach(function(eventKey){
				// 	console.log(eventKey);
				// })


app.get('/personalEventDisplay', function(req, res) {
		// console.log(schoolFriendCount);
		// console.log('made it to ped');
		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){
		 	// console.log({firstNameLetter: firstNameLetter,
				// 	  schoolFriendCount: schoolFriendCount,
				// 	  userProfId: userProfId,
				// 	  userName: userName,
				// 	  userGender: userGender,
				// 	  userEmail: userEmail,
				// 	  personalEvents: yourEvents,
				// 	  allEvents: listOfAllEvents,
				// 	  school: schoolItem.schoolName});

// personalEvents: yourEvents,
// 					  allEvents: listOfAllEvents,
// allEvents: listOfAllEvents,
// userEmail: userEmail,
		 	User.findOneAndUpdate({userProfId: userProfId},
		 				{firstNameLetter: firstNameLetter,
					  schoolFriendCount: schoolFriendCount,
					  userProfId: userProfId,
					  userName: userName,
					  personalEvents: yourEvents,
					  userGender: userGender,
					  userEmail: userEmail,
					  school: schoolItem.schoolName},
					  {upsert: true},
					  function(err,res){
					  	if(err){console.log(err.message)}
					  	else{console.log("User Updated");}
					  	// console.log(res);
					  });
					// console.log(user.yourEvents);
					// user.save(function (err, person) {
			  // 		if (err){ return console.error(err);}
					// });


 		 	// console.log(user);
			res.render('personalEventDisplay', {friends: yourEvents, school: schoolItem.schoolName});
			// console.log(yourEvents);
		}
		else{
			res.render('Login2',{schoolName: schoolItem.schoolName});}
	});


app.get('/allEvents', function(req, res) {
		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){
			// console.log()
				res.render('allEvents', {friends: listOfAllEvents})}
		else{
			res.render('Login2',{schoolName: schoolItem.schoolName});}
	});

// app.get('/UserHasLoggedIn', function(req, res) {
//   res.render("index", { title: "Logged In" });
// });








app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog

  // console.log('now im here');
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope

    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  	}

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code

  	}, function (err, facebookRes) {
  		// console.log(err);

    // console.log(facebookRes)
     graph.setAccessToken(facebookRes.access_token);
     // console.log(graph.get("/me?fields=id"));
     // userProfId = "";
     // userGender = "";
     // console.log('ive made it here');
     graph.get("/me",function(err,result) {
			userProfId = result.id;
			console.log(facebookRes.access_token);
			userName = result.name;
			userGender = result.gender;
			if(result.email){
				userEmail = result.email.toLowerCase();
			}
			schoolFriendCount = 0;
			console.log(result.name)
			firstNameLetter = result.name[0].toLowerCase();
			// friendMinimum = schoolFriendMin;


			// graph.get("/me?fields=friends.fields(education,name)", function(err,result) {




//this graph .get below needs a dynamic user
// var userID = '1424263346'
// var userID = '/me';
// userEmail="ngrotti1@binghamton.edu"
// console.log(userEmail);

// events.fields(cover,privacy,name,location,start_time,description,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")),

// graph.get("1424263346?fields=friends.fields(events.fields(picture))", function(err,res1){
// 	console.log(res1.friends.data[0].picture.data.url);
// });

//cover not working for some reason
//cover,privacy,
//maybe.user("+userProfId+"), attending.user(" +userProfId+")
		// graph.get("/me?fields=friends.fields(education,events.fields(description,cover,start_time,location,name,privacy,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))", function(err, result) {
	graph.get("/me?fields=friends.fields(education,events.fields(description,start_time,location,name,venue))", function(err, result) {
		// console.log(JSON.stringify(result));
//friend checker
   		result.friends.data.forEach(function(friend){
     		if (friend.education){
     			friend.education.forEach(function(schoolObj){
     				// console.log(schoolObj);
     				if(schoolObj.school){
     					// console.log(schoolObj.school.name);
	     				if (schoolObj.school.name.indexOf(schoolItem.schoolName)>-1){
	     					// console.log("Bing friend found");
	     					// console.log(friend.name);
	     					schoolFriendCount++;
	     				}
	     			}
     			});}
     	});
     		// console.log(schoolFriendCount);

// fb graph query: 1424263346?fields=events.fields(cover,privacy,name,location,start_time,description,venue),friends.fields(events.fields(description,start_time,location,name,privacy,venue))
// console.log(result);

	 	 var friends = result.friends.data.filter(function(friend){
	 	 		if (friend.events){
	 	 			return true;
	 	 		}
	 	 });
	 	 // var eachFriend = {};
	 	 listOfAllEvents = {};
		 var today = new Date();
		 var currentDay = today.getDate();
		 var currentMonth = today.getMonth()+1; //January is 0
		 var currentYear = today.getFullYear();

	 		friends.forEach(function(friend){

	 	 		// oneFriendsEvents = friend.events.data.map(function(singleEvent){

	 	 		// 	// console.log(startDay);
		 	 	// 		return(singleEvent.name);});


	 	 		setEventsList = friend.events.data.map(function(singleEvent){

	 	 // 			setEventsPics = {
	 	 // 				listOfAllEvents[singleEvent.name] = {cover:
				// }

	 	 				// 	listOfAllEvents[singleEvent.name][location]='"Location: "+singleEvent.location'
	 	 				// }
					startMonth = singleEvent.start_time.split('-')[1];
	 	 			startDay = singleEvent.start_time.split('-')[2].split('T')[0];
	 	 			startYear = singleEvent.start_time.split('-')[0];
	 	 			// console.log(startDay);

	 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
	 	 				// console.log(singleEvent.picture);
	 	 				if (singleEvent.cover){
							listOfAllEvents[singleEvent.name.replace(/\./g,"")] = {cover: singleEvent.cover.source, privacy: "Privacy: "+singleEvent.privacy, begins: "Event Starts: "+singleEvent.start_time, beginDay: "Event Date: "+singleEvent.start_time.split('T')[0],beginTime: "Event Time: "+singleEvent.start_time.split('T')[1], description:"Event Description: " + singleEvent.description, imGoing: singleEvent.attending, maybeGoing: singleEvent.maybe,};
							// console.log(singleEvent.cover.source);
						}
						else{
							listOfAllEvents[singleEvent.name.replace(/\./g,"")] = {privacy: "Privacy: "+singleEvent.privacy, begins: "Event Starts: "+singleEvent.start_time, beginDay: "Event Date: "+singleEvent.start_time.split('T')[0],beginTime: "Event Time: "+singleEvent.start_time.split('T')[1], description:"Event Description: " + singleEvent.description, imGoing: singleEvent.attending, maybeGoing: singleEvent.maybe,};
						}
						// else{
						// 	listOfAllEvents[singleEvent.name] = {privacy: "Privacy: "+singleEvent.privacy, begins: "Event Starts: "+singleEvent.start_time, description:"Event Description: " + singleEvent.description};}

						if (singleEvent.location){
	 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['location']="Location: "+singleEvent.location;
	 	 					// console.log(singleEvent.name);
	 	 				}
	 	 				if (singleEvent.venue){
	 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['longitude']="Longitude: "+singleEvent.venue.longitude;
	 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['latitude']="Latitude: "+singleEvent.venue.latitude;

	 	 					// console.log(singleEvent.name);
	 	 				}
	 	 				// if (singleEvent.cover){
	 	 				// 	listOfAllEvents[singleEvent.name]['cover']=singleEvent.cover.source;
	 	 				// 	// console.log(singleEvent.name);
	 	 				// }
	 	 			}}
						);
// console.log(eventsInfo);

 			// eachFriend[friend.id] = oneFriendsEvents;
	 	 	});//end of friends.map

	 		// console.log(eachEvent);

			// myEvents = result.events.data.map(function(myEvent){
			// 	console.log(myEvent.cover);
			// 	if(myEvent.cover){
			// 		return myEvent.cover.source;
			// 	}

//below is the binghamton filter


				yourEvents = {};
				var allEventsInAnArray = Object.keys(listOfAllEvents);


				if (!schoolItem.schoolEvents){
					schoolItem.schoolEvents = {};
				}
				else{
					// startMonth = singleEvent.start_time.split('-')[1];
	 	 	// 		startDay = singleEvent.start_time.split('-')[2].split('T')[0];
	 	 	// 		startYear = singleEvent.start_time.split('-')[0];
					var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
					// console.log(schoolEventsInAnArray);
					for (i=0;i<schoolEventsInAnArray.length;i++){
						// console.log(schoolItem.schoolEvents[schoolEventsInAnArray[i]].beginDay);
						var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].beginDay.split(' ')[2].split('-')[1];
						var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].beginDay.split(' ')[2].split('-')[2];
		 	 			var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].beginDay.split(' ')[2].split('-')[0];
		 	 			// console.log(startDay);
		 	 			// console.log(currentYear);
						if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
							yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
						}
					}
				}

				for (i=0;i<allEventsInAnArray.length;i++){
					// startMonth = listOfAllEvents[allEventsInAnArray[i]].begins.split('-')[1];
					// startDay = listOfAllEvents[allEventsInAnArray[i]].begins.split('-')[2].split('T')[0];
					// console.log(startDay);

////////////
					if (listOfAllEvents[allEventsInAnArray[i]].imGoing||listOfAllEvents[allEventsInAnArray[i]].maybeGoing){
						yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
						// console.log(listOfAllEvents[allEventsInAnArray[i]]);
						// console.log(listOfAllEvents[allEventsInAnArray[i]].imGoing);
					}
					if (listOfAllEvents[allEventsInAnArray[i]].longitude){
						longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
						latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];

						//this is the only specific to bing parts
						if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
							yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
						}
						if (listOfAllEvents[allEventsInAnArray[i]].location){
							if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){
								yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
								schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							}
						}
					}
				}
// //User.findOneAndUpdate({userProfId: userProfId},
// 		 				{firstNameLetter: firstNameLetter,
// 					  schoolFriendCount: schoolFriendCount,
// 					  userProfId: userProfId,
// 					  userName: userName,
// 					  personalEvents: yourEvents,
// 					  userGender: userGender,
// 					  userEmail: userEmail,

// 					  school: schoolItem.schoolName},
// 					  {upsert: true},

				School.findOneAndUpdate({schoolName: schoolItem.schoolName},
					{schoolEvents:schoolItem.schoolEvents},{upsert: true},function(req,res){
						console.log('School Events Updated');
					});

			// schoolItem.save(function (err, person) {
			//   if (err){ return console.error(err);}
			//   // else{console.log(person);}
			// });
				// console.log(bingEvents);

// &&startMonth>=currentMonth&&startDay>=currentDay

			//  	var myEventInfo = {};
			// 	myEvents = result.events.data.map(function(myEvent){

			// 	if(myEvent.cover&&myEvent.venue){
			// 		myEventInfo[myEvent.name] = {cover:"Cover Photo: "+myEvent.cover.source, longitude: "Longitude: "+myEvent.venue.longitude,latitude: "latitude: "+myEvent.venue.latitude, maybeGoing: myEvent.maybe,imGoing: myEvent.attending, privacy: "Privacy: "+myEvent.privacy, begins: "Event Starts: "+myEvent.start_time, description:"Event Description: " + myEvent.description};
			// 		// console.log(myEventInfo[myEvent.name]);
			// 	}
			// 	else if(myEvent.venue) {
			// 		myEventInfo[myEvent.name] = {longitude: "Longitude: "+myEvent.venue.longitude,latitude: "latitude: "+myEvent.venue.latitude, maybeGoing: myEvent.maybe,imGoing: myEvent.attending, privacy: "Privacy: "+myEvent.privacy, begins: "Event Starts: "+myEvent.start_time, description:"Event Description: " + myEvent.description};
			// 	}
			// 	else{
			// 		myEventInfo[myEvent.name] = {privacy: "Privacy: "+myEvent.privacy,maybeGoing: myEvent.maybe,imGoing: myEvent.attending, begins: "Event Starts: "+myEvent.start_time, description:"Event Description: " + myEvent.description};
			// 	}

			// });


// , myEvents: myEventInfo}, myEvents: myEventInfo} ## for use my personal events data

// console.log('all da way here');
		// console.log(listOfAllEvents);
			res.redirect('/personalEventDisplay');
	 	 // res.render('index', {friends: eachFriend, myEvents: myEvents});
		});//end of get auth
// res.redirect('/allEvents');

// else{
// 	// window.alert('Sorry, this section is for Binghamton students only');
// 	res.redirect("/bingLogin2");
// 	// res.redirect("/denied");
// }
// res.redirect('/UserHasLoggedIn');
 });//end of callback
// });
}); //end of get me
}); //end of authentication

// user gets sent here after being authorized


// app.get('/showResult', function(req,res){
// 	res.render("index", {title: req})
// });

// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





