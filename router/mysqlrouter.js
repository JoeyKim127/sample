var express = require('express');
var mysql = require('mysql');
const dbconfig = require('./dbconfig');
const hasher = require('pbkdf2-password')();



var connection = mysql.createConnection(dbconfig);


module.exports = function () {

    var router = express.Router();
    router.get('/test', function (req, res) {
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;

            console.log('The solution is: ', results[0].solution);
            res.json(results);

            connection.end();
        });
    });



    router.get('/getuser', function (req, res) {
        connection.connect();

        connection.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;

            console.log('results : ', results);
            res.json(results);

            connection.end();
        });
    });


    router.post('/adduser2', function (req, res) {

        console.log(req.body);

        let userid = req.body.userid;
        let password = req.body.password;
        let salt = 'salt';
        let email = req.body.email;
        let name = req.body.name;

        // res.send(userid);


        hasher({
            password: password
        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.redirect('/signup_form');
            }


            //connection.connect();

            const stmt = 'INSERT INTO user (userid, password, salt, name, email) VALUES (?, ?, ?, ?, ?)';
            console.log(hash, salt);
            connection.query(stmt, [userid, hash, salt, name, email], function (error, results, fields) {
                if (error) throw error;

                console.log('results : ', results);
                res.redirect('/mysql/login_form');

                //connection.end();
            });
        })
    });



    router.post('/login', function (req, res) {

        console.log(req.body);

        let userid = req.body.userid;
        let password = req.body.password;

        // res.send(userid);


        hasher({
            password: password
        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.redirect('/signup_form');
            }


            connection.connect();

            const stmt = 'SELECT * FROM user where userid = ?';

            connection.query(stmt, [userid, hash, salt, name, email], function (error, results, fields) {
                if (error) throw error;

                console.log('results : ', results);

                if (results) {
                    const user = results[0];
                    console.log(userid, "정보가 존재합니다");
                    console.log(user);

                    hasher({
                        password: password,
                        salt: salt
                    }, (err, pass, salt, hash) => {
                        console.log('hash : ', hash);
                        console.log('pass : ', user.password);

                        if (hash === user.password) {
                            console.log('login success');
                            req.session.user = user;
                            res.redirect('/mysql/main');
                        } else {
                            console.log('wrong password');
                            res.redirect('/login_form');
                        }
                    });

                } else {
                    res.send("No user information found");
                }

                // res.json(results)
                res.redirect('/');

                connection.end();
            });
        })
    });










    router.get('/adduser_form', (req, res) => {
        res.render('a_signup.html')
    });

    router.get('/login_form', (req, res) => {
        res.render('a_login.html')
    });



    return router;
}
