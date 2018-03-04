var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Session = require('../models/session');
var passport = require('passport');
var multer = require('multer');
var fs = require('fs');
var picmulter = multer({
  dest:'./public/uploads',
  limits: {fileSize: 100000000, files:1},
});

router.get('/'
  , function(req, res){
  res.render('home',{title:"Home - Campus Owl",user:req.user});
});

router.get('/about'
  , function(req, res){
  res.render('about',{title:"About- Campus Owl",user:req.user});
});

router.get('/joincall'
  , function(req, res){
  req.session.returnTo = req.url;
  if(req.user){
    if (req.user.type == "HSS"){
        Session.find({seshid:{$in:req.user.sessions}}, function(err, seshs){
        res.render('joincall', {title: "Join a call - Campus Owl" , user: req.user, 'mysession': seshs});
        })
    }else
    res.send("you do not have permission");
  }else
  res.redirect('login');
});


router.get('/example'
  , function(req, res){
  req.session.returnTo = req.url;    
  res.render('example',{title: "Join Server - Campus Owl", user: req.user});
});

/*router.post('/call'
  ,function(req,res){
  console.log(req.body.email);
  seshcollect.find({"emails":req.body.email},{},function(e,data){
    console.log(data);
    res.render('joincall',{'si':data, title: "Call - Campus Owl", user: req.user});
  })
});*/

router.get('/call/:session'
  , function(req,res){
  if (req.user){
    if(req.user.sessions){
              console.log("whoot");

      if (req.user.sessions.indexOf(req.params.session)!=-1){
        Session.findOne({seshid:req.params.session}, function(err, sesh){

          if (new Array(sesh.seshmembers[0],sesh.seshmembers[1]).indexOf(req.user._id.toString()) != -1){
          console.log("whoot");
            var OpenTok = require('opentok'),
                opentok = new OpenTok("45622712", "deee25ee4517f57564e0127bddc71fdd38e3d803");
            var token = opentok.generateToken(req.params.session);
            res.render('call',{tk: token, session:sesh, title: sesh.seshid+" - Campus Owl", user: req.user});
            }else{res.send("The server doesn't want you here")}
          })
        }else{res.send("You do not own this session time");}
      //}else{res.send("You are not a caller");}
    }else{res.send("You are not authorized to join this call");}
  }
  else{
    req.session.returnTo = req.url;
    res.redirect("/login");
  }
});

router.get('/register'
  ,function(req,res){
  res.render('register',{'HSS': true, title: "Become a Student - Campus Owl", user: req.user});
});

router.post('/register'
  , function(req, res) {
  var accountdata;
  var data; 
  if(req.body.type == "HSS"){
        accountdata = { username : req.body.username, email: req.body.username, name: req.body.name, type: "HSS" };
          data = {HSS: true, title: "Become a Student - Campus Owl", user: req.user} ;
   }
   if(req.body.type == "IEC"){
        accountdata = {username : req.body.username, email: req.body.username, name: req.body.name, type: "IEC", image:""};
        data = {IEC: true, title: "Register an IEC - Campus Owl", user: req.user};
   }
   if(req.body.type == "OWL"){
        accountdata = { username : req.body.username, email: req.body.username, name: req.body.name, type: "OWL", approved: true, schoolcode: "578840fe2c13495b8de10bf4", description: req.body.description};
        data = {OWL: true, title: "Become an Owl - Campus Owl", user: req.user};
   }
   Account.register(new Account(accountdata), req.body.password, function(err, account) {
    if (err) {
            data.error = err;
            return res.render('register', data);
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/picture');
    });
  });
});

router.get('/login'
  , function(req, res) {
    res.render('login', {title: "Login - Campus Owl", user: req.user});
});

router.post('/login'
  , passport.authenticate('local'), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});

router.get('/logout'
  , function(req, res) {
    req.logout();
    res.redirect(req.session.returnTo || '/');
});

router.get('/picture'
  , function(req, res){
  if (req.user){
    res.render('picture',{title: "Profile Picture - Campus Owl", user: req.user});
  }
  else {
    res.redirect('/');
  }
});

router.post('/picture'
  , picmulter.single('image'), function(req,res,err){
  if (req.file){
    var old = req.user.image;
    fs.stat('./public/'+ old, function(err, stats){
      if (err){
        return console.log(err);
      }
      fs.unlink('./public/'+old,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
      });  
    });
    
    var path = req.file.path.substring(req.file.path.indexOf("uploads"));
    fs.rename('./public/'+ path, './public/'+ path+'.jpeg', function(err){
      if (err) return console.log(err);
    });
    req.user.image= path+'.jpeg';
    req.user.save(function(err){
      if (err) return console.log(err);
    })
  res.redirect(req.session.returnTo || '/');
  }
});

router.get('/test'
  , function(req, res){
  
});


module.exports = router;
  