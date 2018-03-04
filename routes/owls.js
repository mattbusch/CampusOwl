var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var Account = require('../models/account');


router.get('/'
	, function(req, res){
  res.render('owl/home',{title:"OWL - Campus Owl",user:req.user});
});

router.get('/account'
	, function(req, res){
	if (req.user.type == "OWL"){
		res.render('owl/account',{title: req.user.name + " - Campus Owl",user:req.user});
	}
	else{
		res.redirect('/');
	}
});

router.get('/register'
	,function(req,res){
  res.render('register',{'OWL': true, title: "Become an Owl - Campus Owl", user: req.user});
});

module.exports = router;
