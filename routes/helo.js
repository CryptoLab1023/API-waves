var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('helo', {
        title: 'Helo',
        data: {
            '太郎': 'taro@yamada',
            '花子': 'hanako@flower',
            'つやの': 'syoda@tuyano.com'
        }
    })
})

module.exports = router;
