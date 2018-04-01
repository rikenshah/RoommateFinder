var nodemailer=require("nodemailer");
var bcrypt=require("bcrypt");
var smtpTransport=nodemailer.createTransport({
	service: "gmail",
	auth:{
		user: "aishwaryassr@gmail.com",
		pass: "Macrohard**123"
	}
});

var rand,mailOptions,host,link;
var updatedchar=false;
var hasupdatedCharacteristics=false;
var emailsess;
var hasloggedin=false;
//var logger=require('../app/views/partials')(hasloggedin);
const login = require('../app/controllers/home');
const userProfile=require('../app/controllers/profile');
const search = require('../app/controllers/search');


module.exports = function (app,User,mongoose,session) {
	app.get('/', login.index);

	app.post('/search', (req, res)=>{
		let errors=[]
		console.log(req.body);

		var minAmt = parseInt(req.body.amount.split("-")[0].substr(1,3));
		var maxAmt = parseInt(req.body.amount.split("-")[1].substr(2,3));
		var query = { email: { $ne: req.session.user[0].email}, status: {$ne: "NotAvailable"}, min_budget : {$lte : minAmt}, max_budget : {$gte : maxAmt}};
		
		var searchHistory="Min. Budget: "+minAmt+", Max. Budget: "+maxAmt;
		if(req.body.location){
			searchHistory=searchHistory.concat(", Location: ");
			if (req.body.location instanceof Array) {
				query.location = {$in: req.body.location};
				searchHistory=searchHistory.concat("["+req.body.location+"]");
			}else{
				query.location = req.body.location;
				searchHistory=searchHistory.concat(req.body.location);
			}
		}
		if(req.body.room_sharing){
			query.room_sharing = req.body.room_sharing;
			searchHistory=searchHistory.concat(", Room Sharing: "+req.body.room_sharing);
		}
		if(req.body.dietary_habit){
			query.dietary_habit = req.body.dietary_habit;
			searchHistory=searchHistory.concat(", Dietary Habit: "+req.body.dietary_habit);
		}
		if(req.body.alcoholic_habit){
			query.alcoholic_habit = req.body.alcoholic_habit;
			searchHistory=searchHistory.concat(", Alcoholic Habit: "+req.body.alcoholic_habit);
		}
		if(req.body.smoking_habit){
			query.smoking_habit = req.body.smoking_habit;
			searchHistory=searchHistory.concat(", Smoking Habit: "+req.body.smoking_habit);
		}
		if(req.body.gender){
			query.gender = req.body.gender;
			searchHistory=searchHistory.concat(", Gender: "+req.body.gender);
		}
		console.log("previous search results"+searchHistory);
		const user11={
			last_search: searchHistory
		}
    	User.update({email: emailsess},user11,(er,ds)=>{
			if(er)
			 throw er;
			 console.log("Previous search saved in DB");
		})
		if(!req.body.amount && !req.body.location && !req.body.room_sharing && !req.body.dietary_habit && !req.body.alcoholic_habit && !req.body.smoking_habit && !req.body.gender)
		errors.push({texterr: 'Choose options to search'})
		var results = User.find(query, function(errors, docs){
	    	if(docs) {
					if(docs.length == 0) {
						let message = [];
						message.push({text:'No results found'});
						console.log('No results found');
						res.render('search/search',{
							message: message,
							usersession: req.session.user[0],
							hasloggedin: hasloggedin
						});
					} else {
						console.log('Locality ' + req.session.user[0].location);
						res.render('search/search', {hasloggedin: hasloggedin,usersession: req.session.user[0], flag: true, results: docs});
					}		
				} else {
					let errors=[];
					errors.push({text:'Error in search'});
					res.render('search/search',{
						errors: errors,
						hasloggedin: hasloggedin
					});
					console.log('Error in search');
				}
				if(errors)
					throw errors
	    });
		
	});

    app.get('search/displayprofile',search.displayprofile);
	app.post('/processprofile',(req,res)=>{
		console.log("hello")
		console.log(req.body.viewprofile);
		User.find({email: req.body.viewprofile},(err,docs)=>{
			if(err)
			 throw err;
			 
			res.render('search/displayprofile',{useris: docs[0],hasloggedin: hasloggedin}); 
		})
	})

	app.get('/search', (req, res)=>{
		User.find({email: emailsess},(err,docs)=>{
			if(err)
			 throw err
			req.session.user=docs;
			var currUser = req.session.user[0];
			var query = { email: { $ne: currUser.email}, status: {$ne: "NotAvailable"} , room_sharing: currUser.room_sharing, min_budget : {$lte : currUser.max_budget}, max_budget : {$gte : currUser.min_budget}, location: {$in: currUser.location} };
			var results = User.find(query, function (errors, docs){
				if(docs) {
					if(docs.length == 0) {
						let message = [];
						message.push({text:'No results found'});
						console.log('No results found');
						res.render('search/search',{
							message: message,
							usersession: req.session.user[0],
							hasloggedin: hasloggedin
						});
					} else {
						console.log('Locality ' + req.session.user[0].location);
						res.render('search/search', {usersession: req.session.user[0],hasloggedin: hasloggedin, flag: true, results: docs});
					}		
				} else {
					let errors=[];
					errors.push({text:'Error in search'});
					res.render('search/search',{
						errors: errors,
						hasloggedin: hasloggedin
					});
					console.log('Error in search');
				}
				if(errors)
					throw errors

			});
		})
		//var currentUser = req.session.user[0];
		console.log("session email : " + emailsess);
		console.log("current user : " + req.session.user[0].email);		
	});
	
	app.post('/',(req,res)=>{
		console.log();
		let errors=[];
		User.find({email: req.body.signupEmail},(err,docs)=>{
			if(docs.length>0)
			 {
				 errors.push({text: 'Account already exists. Please sign in'});
			 }
			
		})
		if(!req.body.signupEmail){
			errors.push({text: 'Please enter valid NCSU username'});

		}
		if(!req.body.password)
		{
			errors.push({text: "Please enter a valid password"});
		}
		if(req.body.password!=req.body.confirmPassword)
		{
			errors.push({text: 'Passwords don\'t match'})
		}
		User.find({email: req.body.signupEmail}, function (err, docs) {
			if (docs.length){
				errors.push({text: "User is already registered"})
			 //req.session.user=docs;
				//	res.render('login/signupsuccess',{answer: docs[0]});
				//	console.log(req.session.user);
		}
			});
	
		if(errors.length>0){
			res.render('login/index',{
				errors: errors,
				email: req.body.signupEmail,
				password: req.body.password
			});
		}
		else{
			
			bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
				console.log('success signup')
				const newUser={
					email: req.body.signupEmail,
					password: bcryptedPassword
				}
				new User(newUser).save((err,docs)=>{
					if(err)
					throw err;
					console.log("saved to db"); 
				});
			});
			
		
			//smtp logic
			rand=Math.floor((Math.random()*100)+54);
			host=req.get('host');
			link="https://"+req.get('host')+"/verify?id="+rand;
			mailOptions={
				to: req.body.signupEmail+"@ncsu.edu",
				subject: "Please confirm your email account",
				html: "Hello,<br> Please click and verify<br><a href="+link+">Click here to verify</a>"
			}
			console.log(mailOptions);
			console.log("Test print: ",link);
			smtpTransport.sendMail(mailOptions,(error,response)=>{
			if(error){
				console.log(error);
				res.end("error"); 
			}else{
				console.log("Message sent:"+res.message);
				let emailMessage = [];
				emailMessage.push({text:'Your email has been verified successfully! Please log into your account to use our services.'});
				res.render('login/index',{emailMessage: emailMessage});
				//res.end("sent");
			}
		});
	}});
	
	app.post('/signin',(req,res)=>{
		console.log(req.body.loginEmail)
		//Check if the user has already set his characteristics
		
		User.find({email: req.body.loginEmail}, function (err, docs) {
			if (docs.length){

			bcrypt.compare(req.body.loginPassword, docs[0].password, function(err, doesMatch){
				if (doesMatch){
					hasloggedin=true;
					console.log(hasloggedin)
					req.session.user=docs;
					console.log('session id is'+req.sessionID)
					console.log(docs[0].first_name);
							//res.render('login/signinsuccess',{answer: docs[0]});
						if(docs[0].dietary_habit)
						var updatedCharacteristics=true
							if(!docs[0].first_name)
							res.render('login/register',{emailer: req.body.loginEmail,userid: req.session.user[0] })
							else
							{
								emailsess=req.session.user[0].email;
							res.render('landing/landing',{usersession: req.session.user[0],flag: updatedCharacteristics,hasloggedin :hasloggedin})

							console.log(req.session.user);
							}
				}else{
					let errors=[];
					errors.push({text:'Invalid Password'});
					res.render('login/index',{
						errors: errors
					});
				}
			});

			 
			} else {
				let errors=[];
				errors.push({text:'Invalid Email'});
				res.render('login/index',{
					errors: errors
				});
			}
		});
	});
	
	app.get('/verify',(req,res)=>{
		console.log(req.protocol+":/"+req.get('host'));
		if(("https://"+req.get('host'))==("https://"+host)){
    		console.log("Domain is matched. Information is from Authentic email");
			if(req.query.id==rand){
				console.log("email is verified");
				//	res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
					//res.render('login/register',{emailer: req.body.signupEmail})
					let message = [];
					message.push({text:'Your email has been verified successfully! Please log into your account to use our services.'});
					res.render('login/index',{message: message});
			}else{
				console.log("email is not verified");
				res.end("<h1>Bad Request</h1>");
			}
		}else{
    		res.end("<h1>Request is from unknown source");
		}
	});

	//Register user
	app.get('/register', login.register);
	app.post('/register',(req,res)=>{
		let errors=[];
		if(!req.body.firstName){
			errors.push({text: 'Please enter valid firstname'});
		}
		if(!req.body.lastName)
		{
			errors.push({text: "Please enter a valid lastname"});
		}
		if(!req.body.genderRadio)
		{
			errors.push({text: "Please select a valid gender"});
		}
		if(!req.body.phoneNumber)
		{
			errors.push({text: "Please enter a valid phone number"})
		}

	
		if(errors.length>0){
			res.render('userProfile/register',{
				errors: errors
			});
		}
		else{

			console.log("Form Body: ",req.body);
			console.log('registration successful signup')
			hasloggedin=true;
			var minAmt = parseInt(req.body.amount.split("-")[0].substr(1,3));
			var maxAmt = parseInt(req.body.amount.split("-")[1].substr(2,3));
			const newUser={
				email: req.session.user[0].email,
				first_name: req.body.firstName,
				last_name: req.body.lastName,
				gender: req.body.genderRadio,
				phone_no: req.body.phoneNumber,
				min_budget: minAmt,
				max_budget: maxAmt,
				location: req.body.locations,
				room_sharing: req.body.room_sharing,
				dietary_habit: req.body.dietary_habit,
				smoking_habit: req.body.smoking_habit,
				alcoholic_habit: req.body.alcoholic_habit,
				earliest_move_in_date: req.body.earlydate,
				latest_move_in_date: req.body.latedate,
			}
			console.log("New User: ",newUser);
			console.log("ACCOUNT SESSSSSION:"+req.session.user)
			User.update({email: req.session.user[0].email},newUser,function(err,docs){
				if(err)
				 throw err;
			});
			res.render('userProfile/index',{usersession: newUser,hasloggedin: hasloggedin});
		}
	});
	
	
	app.get('/index',(req,res)=>{
		
		User.find({email: emailsess},(err,docs)=>{
			 if(err)
				throw err;
				req.session.user=docs;
			res.render('userProfile/index',{usersession: req.session.user[0],flag: true,hasloggedin: hasloggedin})
		})
	});


	app.post('/index',(req,res)=>{
		console.log('Hello')
		let errs=[]
		if(!req.body.oldpassword)
		 errs.push({updater: "Enter a password"})
		 if(req.body.newpassword != req.body.confirmnewpassword)
		 errs.push({updater: "Passwords don't match"})
		 if(errs.length>0)
		 {
			res.render('userProfile/index',{
				errs: errs,
				
			});
		 }
		 
		User.find({email: req.session.user[0].email,password: req.body.oldpassword},(err,docs)=>{
			if(err)
			{
			 throw err;	
			 errs.push({updater: "Old password is wrong"})
			 //res.render('/index',{errs: errs});
			}
			else{
			 const user1={password: req.body.newpassword};
			 User.update({email: req.session.user[0].email},user1,(err,docs)=>{
				 if(err)
					throw err;
					//var emailsess=req.session.user[0].email
					emailsess=req.session.user[0].email;
					User.find({email: emailsess},(errs,resp)=>{
						if(errs)
						 throw errs;
            updatedpassword=true
						res.render('userProfile/index',{flagpass: updatedpassword,flag: true,usersession: resp[0],hasloggedin: hasloggedin});
					})
				//	res.render('userProfile/index',{answer: docs[0]});
					console.log('Updated password');
			 })
			}	})
	
	})

	//Update characteristics such as dietary and smoking
	app.post('/updatedetails',(req,res)=>{
		console.log('Hello updating dietary and smoking')
		let errs=[]
		User.find({email: req.session.user[0].email},(err,docs)=>{
			if(err)
			{
			 throw err;	
			 errs.push({updater: "Old password is wrong"})
			 //res.render('/index',{errs: errs});
			}
			
			else{
				console.log("update details"+docs[0]);
				if(docs[0].dietary_habit)
				hasupdatedCharacteristics=true;
			 const user1={dietary_habit: req.body.dietary_habit,
				smoking_habit: req.body.smoking_habit,
				alcoholic_habit: req.body.alcoholic_habit,
				location: req.body.location,
				min_budget: req.body.min_budget,
				max_budget: req.body.max_budget,
				room_sharing: req.body.room_sharing,
				status: req.body.status,
				earliest_move_in_date: req.body.earlydate,
				latest_move_in_date: req.body.latedate
			};
			 User.update({email: req.session.user[0].email},user1,(err,docs1)=>{
				 if(err)
					throw err;
					console.log('Updated characteristics');
					hasupdatedCharacteristics=true;
					
			 })
			 emailsess=req.session.user[0].email
			 User.find({email: emailsess},(errs,resp)=>{
				 
			 console.log("resp is"+resp[0])
				 if(errs)
					throw errs;
				 updatedchar=true;
				 res.render('userProfile/index',{flag: hasupdatedCharacteristics,flagger: updatedchar,hasloggedin: hasloggedin,usersession: resp[0]});
			 })

			}	
		})
		
	})

	app.post('/connect',(req,res)=>{
		let errors=[]
		console.log("hello!!!!");
		console.log("testing"+req.body.connectprofile);
		if(!req.body.connectprofile)
		 errors.push({text: 'Connect with people'})
		User.find({email: req.body.connectprofile},(err,docs)=>{
			if(err)
			 throw err;
			 console.log("Amulya is"+docs[0]);
			 rand=Math.floor((Math.random()*100)+54);
			 host=req.get('host');
			 link="https://"+req.get('host')+"/verify?id="+rand;
			 mailOptions={
				to: req.body.connectprofile+"@ncsu.edu",
				subject: "Connect Request on Roommate Finder",
				html: "Hello,<br>"+req.session.user[0].last_name+"\t"+req.session.user[0].first_name+"wants to connect with you to become a roommate!!<br><a>Please contact this person!!<br>This is the email id of the user:"+req.session.user[0].email+"@ncsu.edu"+"</a>"
			 }
			 smtpTransport.sendMail(mailOptions,(error,response)=>{
			 if(error){
				console.log(error);
				res.end("error"); 
			 }else{
				let connectmessage = [];
				connectmessage.push({text:'Your connection email has been sent successfully with your contact details! The person will contact you if interested!!'});
				res.render('search/connectprofile',{connectmessage: connectmessage});
			}
		})
	})

	})

	//Logout
	app.get('/logout', function (req, res) {
		req.session.destroy();
		res.render('login/index');
	});
}