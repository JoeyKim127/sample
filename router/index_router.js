var express = require('express');
var router = express.Router();
var hasher = require('pbkdf2-password')();
var fs = require('fs');
var path = require('path');

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

var router = express.Router();
router.use(express.static(path.join(__dirname, 'public')));


module.exports = function () {
    

    var imgFileFilter = function (req, file, callback) {
        var ext = path.extname(file.originalname);
        console.log('확장자 : ', ext);

        if (ext !== '.txt' && ext)

            callback(null, true);
    };


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },

        filename: function (req, file, cb) {
            file.uploadfilename = file.originalname.substring(0,
                file.originalname.lastIndexOf('.'));
            cb(null, new Date().valueOf() + '_' + file.originalname);
        }
    });


    var upload = multer({
        storage: storage,
        limits: {
            files: 10,
            fileSize: 3 * 1024 * 1024
        }
    });

    router.get('/router', function (req, res) {
        console.log('/test/router');
        res.send('<h1>/test/router</h1>');
    });


    router.post('/signup2', (req, res) => {
        console.log(req.body);
        // 회원가입
        let userid = req.body.userid;
        let password = req.body.password;
        let name = req.body.name;
        let email = req.body.email;
        console.log('userid = ', userid);
        console.log('password = ', password);
        console.log('name = ', name);
        console.log('email = ', email);

        hasher({
            password: req.body.password

        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.redirect('/signup_form');
            }

            // 비밀번호는 유출의 위험 때문에 해쉬로 보낸다
            let user = {
                userid: userid,
                password: hash,
                salt: salt,
                name: name,
                email: email
            }
            // 여기 user로 정보 push
            //sampleUserList.push(user);

            sampleUserList[userid] = user;
            fs.writeFileSync('data/userlist.json', JSON.stringify(sampleUserList, null, 2));

            console.log('user added : ', user);
            res.redirect('/login_form');
        });
    });




    router.post('/login', (req, res) => {

        console.log(req.body);
        let userid = req.body.userid;
        let password = req.body.password;
        console.log('userid = ', userid);
        console.log('password = ', password);
        console.log('userlist = ', sampleUserList);

        let user = sampleUserList[userid];

        if (user) {
            hasher({
                password: password,
                salt: user.salt
            }, function (err, pass, salt, hash) {
                if (err) {
                    console.log('ERR : ', err);
                    req.flash('fmsg', '오류가 발생했습니다.');
                    res.redirect('login_form');

                }
                if (hash === user.password) {
                    console.log('INFO : ', userid, ' 로그인 성공')

                    req.session.user = sampleUserList[userid];
                    req.session.save(function () {
                        res.redirect('/main')

                    })
                    return;

                } else {
                    req.flash('fmsg', '패스워드가 맞지 않습니다.');
                    console.log('패스워드 오류');
                    res.redirect('/login_form')

                }
            });


        } else {
            req.flash('fmsg', 'wrong.');
            res.redirect('/login_form')

        }
    });


    router.get('/router', function (req, res) {
        console.log('/test/router라우터 정상 작동!');
        res.send('<h1></h1>');
    });


    router.get('/userdata', (req, res) => {
        res.json(Userlist);
    })



    router.get('/list', (req, res) => {

    if  (req.session.user) {
        res.render('a_list.html', { Userlist: Userlist });
        }
    else { 
        res.render('a_index.html');
        }
    });



    router.get ('/', (req, res) => {

    if  (req.session.user) {
    res.render('a_main.html');
    }
    else { 
    res.render('a_index.html');
    }

    });



    router.get('/signup_form', (req, res) => {
        res.render('a_signup.html');
    });



    router.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });


    router.get('/login_form', (req, res) => {
        res.render('a_login.html');
    });


    // router.get('/login_form', (req, res) => {

    //     res.render('login_form.html', {
    //         fmsg: req.flash('fmsg')
    //     })
    // });


    router.get('/main', (req, res) => {
    
    if  (req.session.user) {
        res.render('a_main.html');
        }
    else { 
        res.render('a_index.html');
        }
    });


    router.get('/myaccount', (req, res) => {

        if  (req.session.user) {
            res.render('a_myaccount.html');
            }
        else { 
            res.render('a_index.html');
            }
        });
    

    router.get('/fileupload_form', (req, res) => {

        if  (req.session.user) {
            res.render('test/fileupload.html');
            }
        else { 
            res.render('a_index.html');
            }
        });
    

    // upload mulitple files
    router.post('/fileupload_multi', upload.array('photos', 5), (req, res, next) => {
        console.log(req.file);
        res.send('uploaded...');
    });


    router.get('/carlist2', (req, res) => {
        if (req.session.user) {
            console.log('logged in user');
            res.render('carlist2.html', {
            });
        } else {
            console.log('failed to login back to login page');
        }
    })


    return router;
}

