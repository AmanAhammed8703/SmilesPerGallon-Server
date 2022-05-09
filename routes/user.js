var express = require('express');
var userHelper = require('../helpers/userHelper')
var router = express.Router();
var jwt = require('jsonwebtoken')

const serviceSID = process.env.serviceSID
const accountSID = process.env.accountSID
const authToken = process.env.authToken
const client = require('twilio')(accountSID, authToken)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/signup', (req, res) => {
  console.log(req.body)
  const No = req.body.mobileNumber
  const Mobile = `+91${No}`
  const email = req.body.email
  userHelper.isUserExists(Mobile, email).then((user) => {
    if (user) {
      res.status(400).json({ message: "user exists" })
    } else {
      client.verify
        .services(serviceSID)
        .verifications.create({
          to: Mobile,
          channel: "sms"
        }).then((resp) => {
          res.status(200).json({ mobileNumber: Mobile })
        }).catch((err) => {
          console.log(err);
        })
    }
  })


})
router.post('/otpLogin', (req, res) => {
  console.log(req.body)
  const No = req.body.mobileNumber
  const Mobile = `+91${No}`
  userHelper.isUserExists(Mobile).then((user) => {
    if (user) {
      client.verify
        .services(serviceSID)
        .verifications.create({
          to: Mobile,
          channel: "sms"
        }).then((resp) => {
          res.status(200).json({ mobileNumber: Mobile })
        }).catch((err) => {
          console.log(err);
        })
    } else {
      res.status(400).json({ message: "User not found" })
    }
  })
})
router.post('/verifyOTP', (req, res) => {
  let userData = req.body
  let otp = userData.otp
  let No = userData.mobileNumber
  let Mobile = `+91${No}`
  userData.mobileNumber = Mobile
  console.log(otp);
  console.log(userData);
  client.verify
    .services(serviceSID)
    .verificationChecks.create({
      to: Mobile,
      code: otp
    }).then(async (resp) => {
      if (resp.valid) {
        console.log("valid");
        if (userData.action === "signup") {
          userHelper.doSignUp(userData).then((response) => {
            const userToken = jwt.sign({ email: userData.mobileNumber }, process.env.JWT_SECRET)
            res.status(200).json({ message: "sign in success", userToken })
            console.log("signedin");
          })
        } else if (userData.action === "login") {
          console.log("loggedin")
          const userToken = jwt.sign({ email: userData.mobileNumber }, process.env.JWT_SECRET)
          res.status(200).json({ message: "logged in", userToken })
        } else {
          console.log("nooo");
        }
      } else {
        res.status(400).json({ message: "Invalid otp" })
      }
    })
})

router.post('/login', (req, res) => {
  console.log(req.body);
  userHelper.doLogIn(req.body).then((response) => {
    if (response.user) {
      res.status(200).json({ message: "user logged in" })
    } else {
      res.status(400).json({ message: "user not logged in" })
    }
  })

})
module.exports = router;  
