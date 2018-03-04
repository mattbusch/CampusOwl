var express = require('express');
var router = express.Router();
var School = require('../models/school');
var Account = require('../models/account');
var Session = require('../models/session');
var passport = require('passport');

router.get('/'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				res.render('admin/home',{title:"Admin Page - Campus Owl", user:req.user});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});

router.get('/users'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				Account.find({},function(err, allUsers){
				console.log(allUsers);
					res.render('admin/users',{title:"All Users - Campus Owl", user:req.user, all:allUsers});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	router.get('/users/:type'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				Account.find({type:req.params.type},function(err, allUsers){
				console.log(allUsers);
					res.render('admin/users',{title:req.params.type+" Users - Campus Owl", user:req.user, all:allUsers});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	router.get('/users/:type'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				Account.find({type:req.params.type},function(err, allUsers){
				console.log(allUsers);
					res.render('admin/users',{title:req.params.type+" Users - Campus Owl", user:req.user, all:allUsers});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	
router.get('/user/:user'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				Account.findById(req.params.user,function(err, myUser){
				
					res.render('admin/user',{title:"All Users - Campus Owl", user:req.user, theUser:myUser});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	
	router.get('/approve'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				Account.find({approved:false},function(err, allUsers){
				console.log(allUsers);
					res.render('admin/users',{title:req.params.type+" Users - Campus Owl", user:req.user, all:allUsers});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	
	router.post('/user'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
			console.log("WHOOOOOOOOOOOOOOT");
			console.log(req.body);
			console.log(req.body._id);

				Account.update({_id:req.body._id},{$set: {name:req.body.name, username:req.body.username, email:req.body.email, type:req.body.type, schoolcode:req.body.schoolcode, image: req.body.image}}, function(err, theUser){
				console.log("noncalocholic");
					if (err){
					router.send(err);
					}
					else{
					res.redirect('/admin');
					}
			});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
	});
	router.get('/schools'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				School.find({},function(err, allSchools){
				console.log(allSchools);
					res.render('admin/schools',{title:"All Schools- Campus Owl", user:req.user, all:allSchools});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	
	router.get('/school/:school'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
				School.findById(req.params.school,function(err, mySchool){
				
					res.render('admin/school',{title:"This School - Campus Owl", user:req.user, theSchool:mySchool});
					console.log("whoot");
				});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
		
	});
	router.post('/school'
	, function(req, res){
		if(req.user){
			if (req.user.type == "ADM"){
			console.log("WHOOOOOOOOOOOOOOT");
			console.log(req.body);
			console.log(req.body._id);

				School.update({_id:req.body._id},{$set: {name:req.body.name, city:req.body.city, state:req.body.state, code:req.body.code, bcolor:req.body.bcolor, fcolor: req.body.fcolor, desc: req.body.desc}}, function(err, theSchool){
				console.log("noncalocholic");
					if (err){
					router.send(err);
					}
					else{
					res.redirect('/admin');
					}
			});
			}
			else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
	});


module.exports = router;