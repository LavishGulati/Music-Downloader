var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

const cors = require('../cors');

var Song = require('../models/song');

var Downloader = require('../downloader-scripts/download');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

router
.post('/', cors.corsWithOptions, function(req, res, next){
    // console.log(req.body);
    downloader = new Downloader();
    downloader.downloadSong(req.body.name, req.body.album, req.body.format);
});

module.exports = router;
