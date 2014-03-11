module.exports = {

		 if(process.env.NODE_ENV === "production") {
			var red_uri = "heroku_app22911946:3a257utnok8p61i3oj8incvr2v@ds033419.mongolab.com:33419/heroku_app22911946/auth/facebook";
		} else {
		  var red_uri ='http://localhost:3000/auth/facebook';
		}

    client_id:      '1474435556106076'
  , client_secret:  '00afc8e4df8e0f46ce547c59bf67378b'
  , scope:          'user_events, email,user_about_me,user_friends,user_location,friends_events,friends_education_history,friends_actions.news,friends_photos,friends_activities'
  , redirect_uri: red_uri
  // , token: 'CAACEdEose0cBAJTrpLg7je3fbqs1Qo5OwFetvNnTzkPYLWZCcjceOWJGqD9uk7u5YuO7HPmAyuLiZBa04Dir0hm8jl4GCbPjzAR5wxuLncsO4fdoA2Ykct1KZAGqSitqofFfNnhF0gVtBBg1zCZAXLlxwPTZChsUAUtmo3iaTLAT90ZCx5c2hnsxCojGErSgAZD'

};
