const express = require('express')
const User = require('../models/user')
const {auth} = require('../middleware/auth')
const router = express.Router()

router.get('/login', (req, res) => {
	res.status(200).send('Welcome to login, sign-up api')
})

//Registering new users
router.post('/register', (req, res) =>{
	const newUser = new User(req.body)

	if(newUser.password != newUser.password2){
		return res.status(400).json({
			message:"password no match idiot"
		})
	}

	User.findOne({email:newUser.email}, (err, user) =>{
		if(user){
			return res.status(400).json({
				auth:false,
				message:"email exists moron"
			})
		}

		newUser.save((err, doc)=>{
			if(err) {console.log(err)
				return res.status(400).json({
					success:false
				})
			}
			res.status(200).json({
				success:true,
				user:doc
			})
		})
	})
})

//Logging users in
router.post('/login', (req, res) =>{
	let token = req.cookies.auth

	User.findByToken(token, (err, user) =>{
		if(err) return res(err)
		if(user) return res.status(400).json({
			error:true,
			message:"You are already in dumbass"
		})

		
		User.findOne({email:req.body.email}, function(err, user){
			if(!user) return res.json({
				isAuth:false,
				message:"Auth failed, email not found dipshit"
			})

			user.comparepassword(req.body.password, (err, isMatch) =>{
				if(!isMatch) return res.json({
					isAuth:false,
					message:"Password is wrong, your stupid and I hate you"
				})

				user.generateToken((err, user) =>{
					if(err) return res.status(400).send(err)

					res.cookie('auth', user.token).json({
						isAuth:true,
						id:user._id,
						email:user.email
					})
				})
			})
		})
	})
})

//Who that
router.get('/profile', auth, (req, res)=>{
	res.jsonp({
		isAuth:true,
		id: req.user._id,
		email: req.user.email,
		name: req.user.firstname + req.user.lastname 
	})
})

//Logout users
router.get('/logout', auth, (req, res)=>{
	req.user.deleteToken(req.token, (err, user)=>{
		if(err) return res.status(400).send(err)
		res.sendStatus(200)
	})
})

module.exports = router