var express = require('express');
var multer = require('multer');



module.exports = function () {

    var router = express.Router();
    var upload = multer({
        dest: 'uploads/'
    });


    router.get('/router', function (req, res) {
        console.log('/test/router');
        res.send('<h1>/test/router</h1>');
    });

    router.get('/setCookie', (req, res) => {
        console.log('/test/setCooke');

        res.cookie('user', {
            'name': '홍길동',
            'id': 'user01'
        }, {
                maxAge: 1000,
                httpOnly: true
            });

        res.redirect('/test/getCookie');
    });

    router.get('/getCookie', (req, res) => {
        console.log(req.cookies);
        res.render('test/getcookie.html', {
            cookie: req.cookies
        });
    });

    router.get('/setsession', (req, res) => {
        console.log('/test/setsession');

        req.session.myname = '홍길동';
        req.session.myid = 'hong';

        req.session.save(function () {
            res.redirect('/test/getsession');
        })
    })

    router.get('/getsession', (req, res) => {
        console.log('/test/getsession');
        console.log('session.myname = ', req.session.myname);

        res.render('test/getsession.html', {
            myname: req.session.myname,
            myid: req.session.myid
        });
    })

    router.get('/setlocals', (req, res) => {
        res.locals.test2 = 'test2';
        res.render('test/locals.html', {
            test1: 'test1'
        });
    });


    router.get('/fileupload_form', (req, res) => {
        res.render('./test/fileupload.html');
    });


    router.post('/fileupload', upload.single('avatar'), (req, res, next) => {
        console.log(req.file);

        res.send('uploaded...' + req.file.filename);


    });


    // router.post('/fileupload', (req, res) => {
    //     res.send('test/fileupload.html');
    // });


    return router;
}
