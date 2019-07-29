var express = require('express');
var mysql = require('mysql');
const dbconfig = require('./dbconfig');
const hasher = require('pbkdf2-password')();

var dbpool = mysql.createPool(dbconfig);

module.exports = function () {

    var router = express.Router();
    router.get('/test', function (req, res) {


        dbpool.getConnection((err, conn) => {
            conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
                conn.release();
                if (error) throw error;

                console.log('The solution is: ', results[0].solution);
                res.json(results);

            });
        });
    });



    router.get('/getuser', function (req, res) {
        dbpool.getConnection((err, conn) => {
            conn.query('SELECT * FROM user', function (error, results, fields) {
                conn.release();
                if (error) throw error;

                console.log('results : ', results);
                res.json(results);

            });
        });
    });


    router.post('/adduser2', function (req, res) {

        console.log(req.body);

        let userid = req.body.userid;
        let password = req.body.password;
        let salt = 'salt';
        let email = req.body.email;
        let name = req.body.name;


        hasher({
            password: password
        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.redirect('/signup_form');
            }



            dbpool.getConnection((err, conn) => {

                const stmt = 'INSERT INTO user (userid, password, salt, name, email) VALUES (?, ?, ?, ?, ?)';
                console.log(hash, salt);
                conn.query(stmt, [userid, hash, salt, name, email], function (error, results, fields) {
                    conn.release();

                    if (error) throw error;

                    console.log('results : ', results);
                    res.redirect('/mysql/login_form');

                });
            });
        })
    });



    router.post('/login', function (req, res) {

        console.log(req.body);

        let userid = req.body.userid;
        let password = req.body.password;

        dbpool.getConnection((err, conn) => {

            const stmt = 'SELECT * FROM user WHERE userid = ?';
            
            conn.query(stmt, [userid], function (error, results, fields) {

                    conn.release();

                    if (error) throw error;

                    console.log('results : ', results);

                    if (results[0]) {
                        const user = results[0];
                        console.log(userid, "정보가 존재합니다");
                        console.log(user);

                        hasher({
                            password: password,
                            salt: user.salt
                        }, (err, pass, salt, hash) => {
                            console.log('hash : ', hash);
                            console.log('pass : ', user.password);

                            if (hash === user.password) {
                                console.log('login success');
                                req.session.user = user;
                                res.redirect('/');
                            } else {
                                console.log('wrong password');
                                res.redirect('/mysql/login_form');
                            }
                        });

                    } else {
                        res.send("No user information found")
                    }

                    // res.json(results)
                    // res.redirect('/');

                });
            });
        });

        router.get('/adduser_form', (req,res) => {
            res.render('a_signup.html');
        });
     
        router.get('/login_form', (req, res) => {
            res.render('a_login.html');
        });
     
        return router;
     }
     