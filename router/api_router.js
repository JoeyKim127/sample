var express = require('express');
var router = express.Router();


var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});



module.exports = function () {
   var router = express.Router();
   
   

router.post('/regcar', (req, res) => {
    console.log(req.body);
    Userlist.push(req.body);
    res.json(Userlist);
});




router.post('/search', (req, res) => {
    console.log(req.body);
    console.log(req.body.searchText);

    // let FirstName = 'John';
    let FirstName = req.body.searchText;
    let found = Userlist.find(function (element) {
        console.log('element = ', element);
        if (element.FirstName == FirstName) {
            console.log('found');
            return element;
        }
    });

    console.log('found = ', found);
    res.json(found);

});




router.post('/filter', (req, res) => {
    console.log(req.body);
    console.log('현재 위치는 여기입니다 #1');
    console.log(req.body.searchType);
    console.log('현재 위치는 여기입니다 #2');
    console.log(req.body.searchText);


    // let ComboVal = req.body.searchType;
    // req.body.searchType = req.body.searchText;
    console.log(req.body.searchType);
    let test = req.body.searchType;

    let found = Userlist.filter(function (element) {
        console.log('현재 위치는 여기입니다 #3');
        console.log('element = ', element);
        if (element[test] == req.body.searchText) {
            console.log('found');
            return element;
        }
    });


    // 여기서 검색
    console.log('현재 위치는 여기입니다 #4');
    console.log('found = ', found);
    res.json(found);


});
 
   return router;
}

