var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var Account = require('../models/account');
var moment = require('moment');
moment().format();

router.get('/set'
	, function(req,res){
		console.log('whoot');
	if (req.user){ 
		if(req.user.type == "OWL"){
		    var stoptime = moment(moment().startOf('day')).add(2,'days');
		    var deletecount = 0;	
		    req.user.sched.forEach(function(time, index, err){
		        if (stoptime.isAfter(moment(time,"ddMMDDYYYYHHmm").format())) {  
		          deletecount++;
		          console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOldy")
		        }
		    });
		    console.log('whoot');
		    req.user.sched.splice(0,deletecount);
		    console.log('whoot');
		    req.user.save(function(err){
	      		if (err) return console.log(err);
	    	});
	    	console.log('whoot');
		 var timeholder = [
				['0000','0030'],
				['0100','0130'],
				['0200','0230'],
				['0300','0330'],
				['0400','0430'],
				['0500','0530'],
				['0600','0630'],
				['0700','0730'],
				['0800','0830'],
				['0900','0930'],
				['1000','1030'],
				['1100','1130'],
				['1200','1230'],
				['1300','1330'],
				['1400','1430'],
				['1500','1530'],
				['1600','1630'],
				['1700','1730'],
				['1800','1830'],
				['1900','1930'],
				['2000','2030'],
				['2100','2130'],
				['2200','2230'],
				['2300','2330']
			];
			var timeseer = [
				['12:00am','12:30am'],
				['1:00am','1:30am'],
				['2:00am','2:30am'],
				['3:00am','3:30am'],
				['4:00am','4:30am'],
				['5:00am','5:30am'],
				['6:00am','6:30am'],
				['7:00am','7:30am'],
				['8:00am','9:30am'],
				['9:00am','8:30am'],
				['10:00am','10:30am'],
				['11:00am','11:30am'],
				['12:00pm','12:30pm'],
				['1:00pm','1:30pm'],
				['2:00pm','2:30pm'],
				['3:00pm','3:30pm'],
				['4:00pm','4:30pm'],
				['5:00pm','5:30pm'],
				['6:00pm','6:30pm'],
				['7:00pm','7:30pm'],
				['8:00pm','9:30pm'],
				['9:00pm','8:30pm'],
				['10:00pm','10:30pm'],
				['11:00pm','11:30pm']
			];
			var dates = [];
			var dates2= [];
			console.log('whoot');
			for (h = 2; h<15; h++){
				dates.push([moment().startOf('day').add(h, 'days').format('ddMMDDYYYY'),moment().startOf('day').add(h, 'days').format('MMM DD')]);
			}
			for (h = 15; h<28; h++){
				dates2.push([moment().startOf('day').add(h, 'days').format('ddMMDDYYYY'),moment().startOf('day').add(h, 'days').format('MMM DD')]);
			}
			console.log('whoot');
			res.render('./schedule/set', {title: "Schedule - Campus Owl", user: req.user, days:dates,days2:dates2, times:timeholder, saved:req.user.sched, timesee: timeseer});


	  	}
	  	else{
	  		res.redirect(req.session.returnTo || './');
  		}
  	}else{
  		console.log('whoot');
  		req.session.returnTo = 'schedule'+req.url;
  		console.log(req.session.returnTo);
  		res.redirect('/login');
  	}
});

router.post('/set'
	, function(req,res){
	req.user.sched = [];
	for(var on in req.body) {
   		req.user.sched.push(on);
	}
	req.user.save(function(err){
      if (err) return console.log(err);
    });
	res.redirect('/owl/account');
});

module.exports = router;