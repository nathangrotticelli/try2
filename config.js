


 if(process.env.NODE_ENV === "production") {
			var red_uri = "http://stark-eyrie-6720.herokuapp.com/auth/facebook";
		} else {
		  var red_uri ='http://localhost:3000/auth/facebook';
		}
module.exports =

{

    client_id:      '1474435556106076'
  , client_secret:  '00afc8e4df8e0f46ce547c59bf67378b'
  , scope:          'user_events, email,user_about_me,user_friends,friends_events,friends_education_history,friends_actions.news,friends_activities,basic_info'
  , redirect_uri: red_uri

};

//friends_photos,