var express = require('express');
var router = express.Router();

/* GET helo page. */
router.get('/', function (req, res, next) {
    var p1 = req.query.p1;
    var p2 = req.query.p2;
    var msg = pl == undefined ? "" : p1 + "," + p2;
    res.render('helo',
        {
            title: 'HELO',
            msg: msg
        }
    );
})

// router.get('/', function (req, res, next) {
//     res.render('helo', {
//         title: 'Helo',
//         data: {
//             '太郎': 'taro@yamada',
//             '花子': 'hanako@flower',
//             'つやの': 'syoda@tuyano.com'
//         }
//     })
// })

module.exports = router;
