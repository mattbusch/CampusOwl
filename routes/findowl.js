var express = require('express');
var router = express.Router();
var School = require('../models/school');
var Account = require('../models/account');
var Session = require('../models/session');
var moment = require('moment');
moment().format();

function createaserver(){
	
}
	
router.get('/'
  , function(req, res){
  req.session.returnTo = '/find-an-owl'+req.url;
  School.find({},function(err, schools){
    console.log(schools);
    res.render('./find-an-owl/home', {title: "Find an Owl - Campus Owl", user: req.user, school: schools});
  });
});

router.get('/school/:school'
  , function(req, res){
  req.session.returnTo = '/find-an-owl'+req.url;
  School.findOne({name: req.params.school}, function(err, school)
  	{Account.find({type:"OWL",schoolcode: school.id, approved: true},function(err, owls){
      res.render('./find-an-owl/school', {title: (school.name+" - Campus Owl"), user: req.user, owl: owls, sch: school});
    });		
  });
});

router.get('/owl/:owl'
  , function(req, res){
  	if (req.user){	
  		Account.findById(req.params.owl, function(err, owly){ 
		 var datees = {};
		  	for (h = 2; h<28; h++){
		  		var key= moment().startOf('day').add(h, 'days').format('ddMMDDYYYY');
		  		datees[key]= [moment().startOf('day').add(h, 'days').format('MMM DD'),[]];
			}
			owly.sched.forEach(function(time, index, err){
				var idit= moment(time,"ddMMDDYYYYHHmm").format('ddMMDDYYYY');
				if (datees[idit]){
					datees[idit][1].push([time,moment(time,"ddMMDDYYYYHHmm").format('h:mmA')]);
				}
			})
			owly.sched=[];
		      res.render('./find-an-owl/owl', {title: (owly.name+" - Campus Owl"), user: req.user, owl: owly, dates:datees});
		 });
  	}
  	else{
  		req.session.returnTo = '/find-an-owl'+req.url;
  		res.redirect('/login');
  	}
});

router.post('/confirm',
	function(req,res){
	if (req.user.type == "HSS"){
	console.log(req.body.userid);
		Account.findById(req.body.userid, function(err,owly){
		console.log('whoot');
			School.findById(owly.schoolcode,function(err, owlschool){
			console.log('whoot');
				var readable = moment(req.body.time, "ddMMDDYYYYHHmm").format("dddd MMMM D, YYYY [at] h:mm A")
				res.render('./find-an-owl/confirm',{title: ("Confirm Purchase - Campus Owl"), user: req.user, schedtime: readable, owl: owly, school:owlschool, token:req.user.tokens});
			});
		});
	}else{
		res.redirect('/');
	}
});

router.post('/paid', function(req,res){
	var stripe = require("stripe")("sk_test_J5Gtl0skXvwVeVdKmutBHvw8");
	var stripeToken = req.body.stripeToken;
	console.log(stripeToken);
	var charge = stripe.charges.create({
	  	amount: 3499, // amount in cents, again
	  	currency: "usd",
	  	source: stripeToken,
	  	description: "Campus Owl Charge"
		}, function(err, charge) {
	  		if (err && err.type === 'StripeCardError') {
		    res.send(err);
	  		}
		});
		console.log(req.body.userid);
	Account.findById(req.body.userid, function(err,owly){
	console.log(owly);
		
		var OpenTok = require('opentok'),
	            opentok = new OpenTok("45622712", "deee25ee4517f57564e0127bddc71fdd38e3d803");
	            var sessionId;
		opentok.createSession({mediaMode:"routed"}, function(error, session) {
	  	if (error) {
	    		console.log("Error creating session:", error)
	  	} else {
	  	sessionId = session.sessionId;
	    	console.log("Session ID: " + sessionId);	
	  	}
		
		
		console.log(req.user.sessions);
		console.log(sessionId);
		req.user.sessions.push(sessionId);
		owly.sessions.push(sessionId);
		Session.create({seshid:sessionId,seshmembers:[req.user._id,owly.id],token:req.body.stripeTokens,seshname:owly.name});
		req.user.save(function(err){
      			if (err) return console.log(err);
    		});
    		owly.save(function(err){
      			if (err) return console.log(err);
    		});
	});
		console.log("its out");
	
	});
	res.redirect('/find-an-owl');
});

router.post('/tokenuse', function(req,res){
	console.log(req.body.token);
	var customerID= req.body.token;
	if (req.user.tokens[tokenindex]){
		var stripe = require("stripe")("sk_test_J5Gtl0skXvwVeVdKmutBHvw8");
		var stripeToken = req.user.tokens[tokenindex];
		var charge = stripe.charges.create({
	  	amount: 3499, // amount in cents, again
	  	currency: "usd",
	  	customer: customerId
	  }, function(err, charge) {
	  	if (err && err.type === 'StripeCardError') {
	  		res.send(err);
	  	}
	  });
		console.log(req.body.userid);
		Account.findById(req.body.userid, function(err,owly){
			console.log(owly);

			var OpenTok = require('opentok'),
			opentok = new OpenTok("45622712", "deee25ee4517f57564e0127bddc71fdd38e3d803");
			var sessionId;
			opentok.createSession({mediaMode:"routed"}, function(error, session) {
				if (error) {
					console.log("Error creating session:", error)
				} else {
					sessionId = session.sessionId;
					console.log("Session ID: " + sessionId);	
				}


				console.log(req.user.sessions);
				console.log(sessionId);
				req.user.sessions.push(sessionId);
				owly.sessions.push(sessionId);
				Session.create({seshid:sessionId,seshmembers:[req.user._id,owly.id],token:req.body.stripeTokens,seshname:owly.name});
						req.user.tokens.splice(tokenindex,1);		

				req.user.save(function(err){
					if (err) return console.log(err);
				});
				owly.save(function(err){
					if (err) return console.log(err);
				});
				
			});
			console.log("its out");

		});
	}
	else{
		res.send("There was a problem");
	}
	res.redirect('/find-an-owl');

});

module.exports = router;