const express = require('express');
const fs = require('fs');
const router = express.Router();

router.post('/', function(req, res, next) {
  var data = JSON.stringify(req.body) + '\n'; // newline to create NDJSON
  // console.log(data);
  fs.promises.appendFile('var/subscriptions.json', data, {encoding:'utf8'})
  .then(function(result) {
    res.json({status: 'subscribed'});
  })
  .catch(function(error) {
    res.status(500).json({'error': error});
  });
});

router.get('/public-key/', function(req, res, next) {
  if (process.env.VAPID_PUBLIC_KEY) {
    res.json({vapid_public_key: process.env.VAPID_PUBLIC_KEY});
  } else {
    console.log("You're probably missing your VAPID key.");
  }
});

module.exports = router