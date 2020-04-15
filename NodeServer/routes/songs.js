var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var wget = require('node-wget');
const fs = require("fs");
var path = require('path');

const cors = require('../cors');

var Song = require('../models/song');

var Downloader = require('../downloader-scripts/download');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

router.post('/', cors.corsWithOptions, function(req, res, next){
    var name = req.body.name.toLowerCase();
    var album = req.body.album.toLowerCase();
    var format = req.body.format.toLowerCase();
    var dirname = name.replace(/\s/g, '')+'_'+album.replace(/\s/g, '')+'_'+format.replace(/\s/g, '');
    var fullpathname = '/home/lavishgulati/Github/Music-Downloader/NodeServer/public/songs/';

    var song = {
        'name': '',
        'album': '',
        'format': '',
        'url': ''
    };
    song.name = name;
    song.album = album;
    song.format = format;

    if (fs.existsSync(fullpathname+dirname)) {

        fs.readdir(fullpathname+dirname, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, present: true, status: dirname+'/'+files[0]});

        });

    }
    else{
        downloader = new Downloader(dirname);

        downloader.downloadSong(name, album, format).then((downloadres) => {
            console.log(downloadres);

            if(downloadres.success){

                downloader.destroy();

                wget({
                    url:  downloadres.link,
                    dest: fullpathname+dirname+'/'+name.replace(/\s/g, '')+'_'+album.replace(/\s/g, '')+'.'+format,
                    timeout: 1000*120 // 2 minutes
                }, function (error, response, body) {
                    if (error) {

                    } else {
                        console.log('Downloaded');

                        if (fs.existsSync(fullpathname+dirname)) {

                            fs.readdir(fullpathname+dirname, function (err, files) {
                                if (err) {
                                    return console.log('Unable to scan directory: ' + err);
                                }

                                song.url = dirname+'/'+files[0];

                                Song.create(song)
                                .then((song) => {
                                    // console.log('Dish Created ', dish);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success: true, present: false, status: dirname+'/'+files[0]});

                                }, (err) => {
                                    next(err);
                                })
                                .catch((err) => {
                                    next(err);
                                });
                            });

                        }

                    }
                });

            }
            else{

            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
});


module.exports = router;
