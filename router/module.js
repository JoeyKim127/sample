

// exports를 통해 모튤화
exports.a = 10;
exports.b = 20;
exports.funca = function(val) {
    console.log(val);
}


// // 확장
// module.exports = {
//     a :10,
//     b: 20,
//     funca : function (val) {
//         console.log(val);
//     }
// }


// // 하나의 객체 리턴하는 방법
// let mymodule = {
//     a :10,
//     b: 20,
//     funca : function (val) {
//         console.log(val);
//     }
// }

// // 초기 값이 있는 모듈(생성자 패턴)
// module.exports = function (param1, param2) {
//     let mymodule = {
//         a :param1,
//         b: param2,
//         funca : function (val) {
//             console.log(val);
//         }
//     }
//     return module;
//     }


