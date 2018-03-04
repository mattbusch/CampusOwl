var express = require('express');
var router = express.Router();
//var passport = require('passport');
var Account = require('../models/account');
router.get('/'
	, function(req, res){
	req.session.returnTo = './iec'+req.url;
  res.render('./iec/home',{title:"IEC - Campus Owl",user:req.user});
});
router.get('/account'
	, function(req, res){
	if (req.user){
		if (req.user.type == "IEC"){
			res.render('./iec/account',{title: req.user.name + " - Campus Owl",user:req.user});
		}
	}
	else{
		res.redirect('/');
	}
});

router.get('/send'
	, function(req, res){
	if (req.user.type == "IEC"){
		Account.find({type: "HSS", ieccode:req.user.ieccode}, function(err, myStudents){
				console.log(myStudents);
			res.render('./iec/send',{title: "Send Session - Campus Owl",user:req.user, mystudents:myStudents});
		});
		
	}
	else{
		res.redirect('/');
	}
});

router.get('/register'
	,function(req,res){
  res.render('./register',{'IEC': true, title: "Register an IEC - Campus Owl", user: req.user});
});

router.get('/codes'
	, function(req,res){
		Account.find({"type":"IEC"},function(err, iecs){
			console.log("HELPMEEEE");

			console.log(iecs);
			res.render('./iec/codes', {title: "IEC Codes - Campus Owl", user: req.user, iec: iecs});
		});
	});

module.exports = router;
