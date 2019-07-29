const express = require('express');
const path = require('path');
const app = express();
const port = 5050;
const cookieparser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const fs = require('fs');

var mysqlrouter = require('./router/mysqlpool')();


global.Userlist = [{
    FirstName: 'John',
    DoB: '25-05-93',
    Nationality: 'UK',
    Email: 'john324@gmail.com',
    numOfVisits: 25,
},

{
    FirstName: 'Mary',
    DoB: '09-07-99',
    Nationality: 'South Korea',
    Email: 'mary907@gmail.com',
    numOfVisits: 47,
},

{
    FirstName: 'Katie',
    DoB: '02-11-85',
    Nationality: 'Japan',
    Email: 'katoe72@gmail.com',
    numOfVisits: 96,
},

{
    FirstName: 'Sam',
    DoB: '02-04-88',
    Nationality: 'France',
    Email: 'asdfw3@gmail.com',
    numOfVisits: 12,
},

{
    FirstName: 'Emily',
    DoB: '08-03-01',
    Nationality: 'Hong Kong',
    Email: 'emmm2311@gmail.com',
    numOfVisits: 70,
},

{
    FirstName: 'Bob',
    DoB: '19-05-79',
    Nationality: 'Spain',
    Email: 'bob000@gmail.com',
    numOfVisits: 29,
},

{
    FirstName: 'Jack',
    DoB: '26-01-98',
    Nationality: 'UK',
    Email: 'jjack126@gmail.com',
    numOfVisits: 7,
},

{
    FirstName: 'Annie',
    DoB: '22-08-76',
    Nationality: 'Singapore',
    Email: 'annie2224@gmail.com',
    numOfVisits: 785,
},

{
    FirstName: 'Jill',
    DoB: '27-06-88',
    Nationality: 'UK',
    Email: 'jilsl889@gmail.com',
    numOfVisits: 66,
},

{
    FirstName: 'Zoey',
    DoB: '12-05-90',
    Nationality: 'USA',
    Email: 'zoey6@gmail.com',
    numOfVisits: 34,
}

];

//  list 만들어주는 방법
global.sampleUserList = {};


if (fs.existsSync('data/userlist.json')) {
    let rawdata = fs.readFileSync('data/userlist.json');
    sampleUserList = JSON.parse(rawdata);
    console.log(sampleUserList);
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));


app.use(express.urlencoded({
    extended: false
}));


// 현재 디렉토리 사진의 디폴트 경로
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: '1A@W#E$E',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));


app.use(cookieparser());


app.use(flash());


app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use('/mysql', mysqlrouter);


var testrouter = require('./router/testrouter')();

app.use('/test', testrouter);


var api_router = require('./router/api_router')();
app.use('/api', api_router);


var index_router = require('./router/index_router')();
app.use('/', index_router);






app.listen(port, () => {
    console.log('Server listening...' + port);
});