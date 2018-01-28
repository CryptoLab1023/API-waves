var express = require("express");
var router = express.Router();

/* GET helo page. */
router.get("/", function(req, res, next) {
  var str;
  try {
    str = req.cookies.lastdata;
  } catch (e) {}
    res.render("helo", {
        title: 'HELO',
        msg: 'please type...',
        cookie: "last:" + str,
        input: ""
  });
});

/* POST helo page. */
router.post('/', function (req, res, next) {
    var str = req.body.input1;
    res.cookie("lastdata", str,
        {
            expires: new Date(Date.now() + 600000)
        }
    );
    res.render('helo',
        {
            title: 'HELO Page',
            msg: "you typed:" + str,
            cookie: str,
            input: str
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
