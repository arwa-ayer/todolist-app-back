var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'ddddizyz';
module.exports = {
	generateTokenForUser: function(userData) {
		return jwt.sign({
		   userId: userData.id,

		   user:  userData
		   
		},
		JWT_SIGN_SECRET,
		{
			expiresIn:'24h'
		})
	},

	parseAuthorization: function(authorization) {
		return (authorization != null) ? authorization.replace('Bearer ', '') : null;
	},

	getUser: function(authorization) {
		var user ;
		var userId = -1;
		var token = module.exports.parseAuthorization(authorization);
		if(token != null) {
		  try {
		    var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
		    if(jwtToken != null)
		      user=jwtToken.user;
		     // userId = jwtToken.user.id;
		      
		  } catch(err) { }
		}

		return user;
	}
}