
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
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}



//populates yourEvents for successful 1st queries
var eventPopulater = function(listOfAllEvents){
			//start of pull from school events
				if (!schoolItem.schoolEvents){
					schoolItem.schoolEvents = {};
				}
				else{
					var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
					for (i=0;i<schoolEventsInAnArray.length;i++){
		 	 			if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){

								var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
								var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
				 	 			var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];

								if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
									yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
								}
						 }
					}
				}//end of school event pull
				//start of pull from fb result
				var allEventsInAnArray = Object.keys(listOfAllEvents);

				for (i=0;i<allEventsInAnArray.length;i++){
					if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
						yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
					}
					if (listOfAllEvents[allEventsInAnArray[i]].longitude){
						longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
						latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];
						//defining long and lat values

						if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){//if close to school

							yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
								schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							}
						}
						if (listOfAllEvents[allEventsInAnArray[i]].location){
							if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){//if close to school
								yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
								if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
									schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
								 }
							}
						}
					}
				}

		}

//populates your events and school events from your facebook events pulled 2
var popYoursAndSchoolEvents = function(result){
						console.log('starting to populate with user pulled data');
						if(!schoolItem.schoolEvents){
							schoolItem.schoolEvents = {};
						}
						result.events.data.forEach(function(event){
						// console.log(event);
								startMonth = event.start_time.split('-')[1];
				 	 			startDay = event.start_time.split('-')[2].split('T')[0];
				 	 			startYear = event.start_time.split('-')[0];


				 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
				 	 				if(event.venue){
				 	 					if (event.venue.longitude){
										longValue = event.venue.longitude;
										latValue = event.venue.latitude;

										if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
											yourEvents[event.name.replace(/\./g,"")] = event;
											if(event.privacy!='SECRET'){
												schoolItem.schoolEvents[event.name.replace(/\./g,"")] = event;
											}
										}
										// else{
										// 	yourEvents[event.name.replace(/\./g,"")] = event;
										// }
									}
				 	 			}

								if (event.location){
										if (event.location.indexOf(schoolItem.schoolTown)>-1){
												yourEvents[event.name.replace(/\./g,"")] = event;
												if(event.privacy!='SECRET'){
													schoolItem.schoolEvents[event.name.replace(/\./g,"")] = event;
												}
										}
										// else{
										// 		yourEvents[event.name.replace(/\./g,"")] = event;
										// }
								}
								if (event.cover){
										// yourEvents[event.name.replace(/\./g,"")] = event;
				 	 					yourEvents[event.name.replace(/\./g,"")]['cover']=event.cover.source;
				 	 					if(event.privacy!='SECRET'){
												schoolItem.schoolEvents[event.name.replace(/\./g,"")]['cover']=event.cover.source;
										}
				 	 			}
									// else{
									// 	yourEvents[event.name.replace(/\./g,"")] = event;
									// }
							}
					});
				console.log('School Events Populated');

				}

//checks friend education count
var friendChecker = function(result){

			result.friends.data.forEach(function(friend){
     		if (friend.education){
     			friend.education.forEach(function(schoolObj){
     				if(schoolObj.school){
	     				if (schoolObj.school.name.indexOf(schoolItem.schoolName)>-1){
	     					schoolFriendCount++;
	     				}
	     			}
     			});}
     	});
	console.log(schoolFriendCount);
}

//adds from school events to your events 1
	var pullSchoolEventsFunc = function(){
						if (!schoolItem.schoolEvents){
							schoolItem.schoolEvents = {};
						}
						else{
							var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
							for (i=0;i<schoolEventsInAnArray.length;i++){
				 	 			if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){
										var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
										var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
						 	 			var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];
										if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
											yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
										}
							}
						}
					}
			}


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

var data = [
{ description: 'ADDRESS!!!:\nSEARCH BAR (Grand Opening) @:\n65 Front Street Binghamton NY \n\nDOOR!!!:\n10$ Cover\n\nEVENT TIME!!!:\n9:00pm to 3:00am\n(after-party begins @ same venue at 3:00!!!)\n\n18+\n21 TO DRINK\n\nPERFORMERS!!! (order T.B.D.):\n\n-(Winner of the March 7th B.U. DJ Competition)\n\n-BARNZY\nhttps://www.facebook.com/pages/Barnzy/287809151249767\n\n-SYNDROME\nhttps://www.facebook.com/pages/Syndrome/137295163135288\n\n-FEEL REAL\nhttps://www.facebook.com/djfeelreal\n\n-DJ ALFRED MOONBOOTS\nhttps://www.facebook.com/alfred.m.williams.5?fref=ts\n\n-DJ HYPEMAN MIKE\nhttps://www.facebook.com/djhypemanmike?fref=ts\n\n-DJ mjDUKE\nhttps://www.facebook.com/djmjduke\n\n-THE TEMPLAR\nhttps://m.facebook.com/profile.php?id=283623618363281\n\n(AFTER PARTY PERFORMER SPOTS AVAILABLE)\n\n\nSAVE THE DATE: MARCH 22ND!!!\n\n*Rooms and Lodging available in connected hotel!\n*Full bar service upstairs and downstairs!\n*Incredible fusion of the best contemporary music!\n*Coat-checking!\n*Qualified security teams!\n*Professional photographers!\n*Intense lighting!\n*Joyful environment!\n*Open and inviting space!\n*A new and exciting place for nightlife in Binghamton!',
     cover: 'https://scontent-b.xx.fbcdn.net/hphotos-frc3/t1.0-9/1781910_656960461036617_1718525739_n.jpg',
     privacy: 'OPEN',
     start_time: '2014-03-22T21:00:00-0400',
     location: '65 Front Street Binghamton NY',
     name: 'FOREVER GLOW',
     venue: { name: '65 Front Street Binghamton NY' },
     id: '231107280410210',
     longitude: 'Longitude: undefined',
     latitude: 'Latitude: undefined' },
   { description: 'Help raise critical funds to ensure that Chabad at Binghamton can continue to thrive and sustain itself! \n\nWe have $10,000 in matching donations already pledged by three generous donors. This means that the first $10,000 we raise by making calls will be matched DOLLAR FOR DOLLAR. However, this match expires Sunday at 4pm, so come on out and #makethecall! \n\nThere will be food, prizes, and tons of friends. \n\nThere is an optional Phoning Training on THIS Thursday at 7pm at Chabad with Alumnus Lori Ben-Ezra and Justin Hayet to give YOU the tools you need to be successful.\n\nPlease register below:\nhttp://www.chabadofbinghamton.com/templates/binghamton/article_cdo/aid/2522495/jewish/Phone-a-thon-registration.htm',
     cover: 'https://scontent-b.xx.fbcdn.net/hphotos-prn1/t1.0-9/1911825_10152036437112825_889068526_n.jpg',
     start_time: '2014-03-23T12:00:00-0400',
     location: 'Chabad at Binghamton',
     name: 'Chabad Phone-A-Thon #Makethecall',
     venue:
      { latitude: 42.08786,
        longitude: -75.959679,
        city: 'Vestal',
        state: 'NY',
        country: 'United States',
        id: '161148093688',
        street: '420 Murray Hill Road',
        zip: '13850' },
     id: '1450063491895625',
     longitude: 'Longitude: -75.959679',
     latitude: 'Latitude: 42.08786' },
   { description: 'This year\'s Spring Fling announcement will be announced live on BTV (channel 6 on campus) Monday at 8pm.\n\nEach day, between Monday and Thursday at 8pm, you will find out who will be performing on campus this year!\n\nIt\'s a 20 minute special where questions about Spring Fling featuring International Fest will be asked, each show will end with the announcement of a Spring Fling Performer.\n\nStudents will have an opportunity to live tweet their questions for the SAPB during the show @BTV6 \n\nThe announcement will be in conjunction with Pipe Dream and WHRW.',
     cover: 'https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-ash3/t1.0-9/1174779_10152282294727302_171625422_n.jpg',
     privacy: 'OPEN',
     start_time: '2014-03-18T20:00:00-0400',
     location: 'Binghamton University',
     name: '2014 Spring Fling 2nd artist Announcement',
     venue:
      { latitude: 42.094140540422,
        longitude: -75.960751539691,
        city: 'Binghamton',
        state: 'NY',
        country: 'United States',
        id: '106105042754834',
        street: '4400 Vestal Parkway East',
        zip: '13850' },
     id: '211991975676202',
     longitude: 'Longitude: -75.960751539691',
     latitude: 'Latitude: 42.094140540422' },
   { description: 'University Nightlife is an app dedicated to making nightlife easier for you!\n\nDownload the app, bring it to the show, GET FREE STUFF.\nGOOGLE PLAY DOWNLOAD LINK: https://play.google.com/store/apps/details?id=com.app_bunightlife.layout\n\niTUNES DOWNLOAD LINK:\nhttps://itunes.apple.com/us/app/u-nightlife/id584570898?mt=8\n\nLive music the whole time by\nHello, Seattle\nBaked Potatoes\nSomewhere Up There\nThe Maloy Brothers \nBrian Milligram\n\n Gallagher\'s Pub Club & Grill\nSaturday April 19th, 7-10pm\n18+, $3 at the door\n\nAdditional Event Promotion Provided by Swanky Media https://www.facebook.com/swankymediany',
     cover: 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-prn1/t1/s720x720/10001285_10152005410563977_564120441_n.jpg',
     privacy: 'OPEN',
     start_time: '2014-04-19T18:00:00-0400',
     location: 'Gallagher\'s Pub Club & Grill',
     name: 'UNIVERSITY NIGHT LIFE PRESENTS: UN Launch Party with Hello, Seattle, Baked Potatoes, Somewhere Up There, The Maloy Brothers, &  Brian Milligram!',
     venue:
      { latitude: 42.4518863935,
        longitude: -75.0640402497,
        city: 'Oneonta',
        state: 'NY',
        country: 'United States',
        id: '502103413205938',
        street: '99 Main Street',
        zip: '13820' },
     id: '251467345033458',
     attending: { data: [Object], paging: [Object] },
     longitude: 'Longitude: -75.0640402497',
     latitude: 'Latitude: 42.4518863935' },
   { description: 'CU Entertainment and, Power n Soul Pro. PRESENT\n\nPRESENTS:\n\n********DE NOCHE**HighDive********\n********Two Dance floors********\n\nCome out and join Dance2XS UIUC and Dance2XS Caliente for Little Urb: The Urbanite Preview and Party! Guests can mingle with the dancers and get a small look of what we will be bringing to URBANITE XVII CHICAGO this April 26th! If you can\'t wait for Urbanite, Little Urb is the place to be!\n\nPERFORMANCES BY:\nDance 2XS UIUC\nDance 2XS Caliente \nDance 2XS Purdue\nThe RainDodgers\n\nPARTY CONTINUES:\nDJs play before, during and after the showcase!!\nDj Locolounny Entertainment\n\nHOSTED BY:\nMichael Henry\n\nWHEN: Saturday, March 15th\nTIME: Doors at 9pm\nWHERE: The HighDive \nCOST: $5 Pre-sale, $7 at the Door! \nFor tickets, contact your favorite 2XS member!! \n\nSPECIALS:\n$5 Long Islands\n$3 Corona, Modelo Especial, Negra Modelo, Dos Equis\n\nAnd be sure the check out the Workshop with Austin Lim on Sunday, March 16th! Details below.\nhttps://www.facebook.com/events/600434050051468/',
     cover: 'https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-ash3/t1.0-9/558739_745266738825627_612968190_n.jpg',
     privacy: 'OPEN',
     start_time: '2014-03-22T21:00:00-0500',
     location: 'Champaign, Illinois',
     name: 'DE NOCHE -HighDive-LITTLE URBANITE',
     venue: { name: 'Champaign, Illinois' },
     id: '634515929935531',
     maybe: { data: [Object], paging: [Object] },
     longitude: 'Longitude: undefined',
     latitude: 'Latitude: undefined' },
   { description: 'CU Entertainment , Power n Soul Pro., and The HighDive \n\nPRESENTS:\n\n********DE NOCHE**HighDive********\n********Two Dance floors********\n\nCome out and join Dance2XS UIUC and Dance2XS Caliente for Little Urb: The Urbanite Preview and Party! Guests can mingle with the dancers and get a small look of what we will be bringing to URBANITE XVII CHICAGO this April 26th! If you can\'t wait for Urbanite, Little Urb is the place to be!\n\nPERFORMANCES BY:\nDance 2XS UIUC\nDance 2XS Caliente \nDance 2XS Purdue\nThe RainDodgers\n\nPARTY CONTINUES:\nDJs play before, during and after the showcase!!\n\nHOSTED BY:\nMichael Henry\n\nWHEN: Saturday, March 15th\nTIME: Doors at 9pm\nWHERE: The HighDive \nCOST: $5 Pre-sale, $7 at the Door! \nFor tickets, contact your favorite 2XS member!! \n\nSPECIALS:\n$5 Long Islands\n$3 Corona, Modelo Especial, Negra Modelo, Dos Equis\n\nAnd be sure the check out the Workshop with Austin Lim on Sunday, March 16th! Details below.\nhttps://www.facebook.com/events/600434050051468/',
     cover: 'https://scontent-a.xx.fbcdn.net/hphotos-prn2/t1.0-9/1975003_745264972159137_31835349_n.jpg',
     privacy: 'OPEN',
     start_time: '2014-03-22T21:00:00-0500',
     location: 'Champaign, Illinois',
     name: 'DE NOCHE --HighDive--LITTLE URBANITE',
     venue: { name: 'Champaign, Illinois' },
     id: '187994541410547',
     attending: { data: [Object], paging: [Object] },
     longitude: 'Longitude: undefined',
     latitude: 'Latitude: undefined' }
    ];

app.post('/getSchool', function(req,res){
incSchoolName = req.body.schoolName;
// console.log(incSchoolName);

School.findOne({schoolName: incSchoolName}, function(err, school){
		console.log('error?: '+err);
		schoolItem = school;
		console.log('Fetched Info for: '+schoolItem.schoolName);
    // console.log(JSON.stringify(schoolItem.schoolEvents));
		res.json({Item: schoolItem});

	});
});

app.post('/getUser', function(req,res){
userEmail = req.body.userEmail;
// console.log(incSchoolName);
User.findOne({ userEmail: userEmail}).reject(function(){
  alert('got rejected')
}).resolve(function (err, user) {
  if(err){
    console.log('got here');
  }
  else{
    console.log('user is ',user);
  }
});


// User.findOne({userEmail: userEmail}, function(err, user){
//     console.log('error?: '+err);
//     userItem = user;
//     console.log('Fetched Info for: '+userItem.name);

//     res.json({Item: userItem});

//   });
});

app.post('/schoolPost', function(req,res){
console.log('looking for ' + req.body.schoolName);

School.findOneAndUpdate({schoolName: req.body.schoolName},
            {
              schoolEvents: req.body.schoolEvents
              // timestamp: req.body.timestamp
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
			// console.log(req);
			// console.log(req.body);
			// console.log(req.body.userName);
			User.findOneAndUpdate({userProfId: req.body.userProfId},
		 				{firstNameLetter: req.body.firstNameLetter,
					  schoolFriendCount: req.body.schoolFriendCount,
					  userProfId: req.body.userProfId,
					  userAge: req.body.userAge,
					  userName: req.body.userName,
					  personalEvents: req.body.yourEvents,
					  userGender: req.body.userGender,
					  userEmail: req.body.userEmail},
					  {upsert: true},
					  function(err,res){
					  	if(err){console.log(err.message)}
					  	else{console.log("User Updated: "+req.body.userName);}
					  });
			console.log('stored user data on server, responding');
			res.json({success:'Worked!'});
		 	//

});

app.post('/loginTry2', function(req, res){
	 var loginTryEmail = req.body.name;
	 console.log(loginTryEmail);
	 loginTryEmail = loginTryEmail.toLowerCase();
	 if (schoolItem.schoolName=='Central Florida'||schoolItem.schoolName=='Michigan State'||schoolItem.schoolName=='University of Michigan'||schoolItem.schoolName=='University of Hawaii'||schoolItem.schoolName=='Central Michigan'){
			 	if((loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){
			 		schoolFriendCount=301;
			 		// pullSchoolEventsFunc();
			 		res.redirect('/personalEventDisplay');
			 	}
			 	else{
			 		res.redirect('/denied');
			 	}
	 }

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
	yourEvents = {};
	listOfAllEvents = {};
	School.findOne({schoolName: locationID}, function(err, school){
		schoolItem = school;
		console.log(schoolItem);
		res.render("Login",{schoolName: schoolItem.schoolName});

	});
});

app.get('/personalEventDisplay', function(req, res) {
							School.findOneAndUpdate({schoolName: schoolItem.schoolName},
							{schoolEvents:schoolItem.schoolEvents},{upsert: true},function(req,res){
								console.log('School Events Saved');
							});
		console.log(schoolItem.schoolFriendMin);
		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){

		 	User.findOneAndUpdate({userProfId: userProfId},
		 				{firstNameLetter: firstNameLetter,
					  schoolFriendCount: schoolFriendCount,
					  userProfId: userProfId,
					  userAge: userAge,
					  userName: userName,
					  personalEvents: yourEvents,
					  userGender: userGender,
					  userEmail: userEmail,
					  school: schoolItem.schoolName},
					  {upsert: true},
					  function(err,res){
					  	if(err){console.log(err.message)}
					  	else{console.log("User Updated: "+userName);}
					  });


			res.render('personalEventDisplay', {friends: yourEvents, school: schoolItem.schoolName});

		}
		else{
			res.render('Login2',{schoolName: schoolItem.schoolName});}
	});


app.get('/allEvents', function(req, res) {
		if(schoolFriendCount>=schoolItem.schoolFriendMin||userEmail.indexOf(schoolItem.emailEnding)>-1){
				res.render('allEvents', {friends: listOfAllEvents})}
		else{
			res.render('Login2',{schoolName: schoolItem.schoolName});}
	});








app.get('/auth/facebook', function(req, res) {

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
     graph.setAccessToken(facebookRes.access_token);
     graph.setAppSecret(conf.client_secret);

    graph.get("/me",function(err,result) {
			userProfId = result.id;
			userName = result.name;
			userGender = result.gender;
			userAge = getAge(result.birthday);
			if(result.email){
				userEmail = result.email.toLowerCase();
			}
			else{
				userEmail = 'none';
			}
			schoolFriendCount = 0;
			firstNameLetter = result.name[0].toLowerCase();
//first query
	graph.get("/me?fields=friends.limit(670).fields(events.fields(description,cover,privacy,start_time,location,name,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))", function(err, firstQresult) {
		// firstQresult.friends=undefined;

		if(!firstQresult.friends){//if the first query broke/did not work

			User.findOne({userProfId: userProfId}, function(err, user){//look for the user

				if (user&&user.school==schoolItem.schoolName){//if user is already existing
					console.log('First query didnt work, User Exists');
					//skip education process, events, then display

					schoolFriendCount=301;//allow entrance
									//find their own events with a smaller query
					graph.get("/me?fields=events.limit(400).fields(cover,privacy,name,location,start_time,description,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+"))",function(err,smallResult){

							popYoursAndSchoolEvents(smallResult);
							pullSchoolEventsFunc();
							setTimeout(function() { res.redirect('personalEventDisplay'); },3400);
						})
				}
				else{//user does not exist
					console.log('first query didnt work, User does not Exist');

					graph.get("/me?fields=friends.limit(250).fields(education),events.limit(250).fields(cover,privacy,name,location,start_time,description,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+"))",function(err,queryResult){//do education and event grab
							popYoursAndSchoolEvents(queryResult);
							pullSchoolEventsFunc();
							friendChecker(queryResult);
							setTimeout(function() { res.redirect('personalEventDisplay'); },3400);
					})
				}
			});
		}//end of if original query didnt work
		else{//if original query did work
			User.findOne({userProfId: userProfId}, function(err, user){//search for user

				if(user&&user.school==schoolItem.schoolName){//if user exists
					schoolFriendCount=301;//allow access
					console.log('User exists and 1st query worked');
					console.log('One Users Events:');
		 			console.log(user.personalEvents);
					// redirectMe = 'yes';
				}
				else{//if user doesnt exist
					console.log('1st query worked, user doesnt exist, starting to scan education');
					graph.get("/me?fields=friends.limit(500).fields(education)",function(err,eduResult){

						console.log('got to friend checker');

						friendChecker(eduResult);


					});//end of education query
				}//else end of if user doesnt exist and 1st query worked

//proceed to put all events into an object with event names being the keys
	 var friends = firstQresult.friends.data.filter(function(friend){
 	 		if (friend.events){
 	 			return true;
 	 		}
 	 });

	friends.forEach(function(friend){

		setEventsList = friend.events.data.map(function(singleEvent){

					startMonth = singleEvent.start_time.split('-')[1];
	 	 			startDay = singleEvent.start_time.split('-')[2].split('T')[0];
	 	 			startYear = singleEvent.start_time.split('-')[0];

	 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
			 	 		listOfAllEvents[singleEvent.name.replace(/\./g,"")] = singleEvent;
			 	 				if (singleEvent.venue){
			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['longitude']="Longitude: "+singleEvent.venue.longitude;
			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['latitude']="Latitude: "+singleEvent.venue.latitude;
			 	 				}
			 	 				if (singleEvent.cover){
			 	 					listOfAllEvents[singleEvent.name.replace(/\./g,"")]['cover'] = singleEvent.cover.source;
			 	 				}

 	 			}//end of date check
 	 		});//set events list
		});//friends.forEach
			eventPopulater(listOfAllEvents);


		});//user.findone end
			setTimeout(function() {res.redirect('personalEventDisplay') },3400);
	}//end of else from query 1 succeeding




					});//end of graph.get(first query)

 			});//graph.get(me) end

	}); //graph.authorize end
}); //end of /auth/facebook


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


	// oneFriendsEvents = friend.events.data.map(function(singleEvent){

 	// eachFriend[friend.id] = oneFriendsEvents;



