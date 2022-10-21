const router = require('express').Router();

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});


const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);





module.exports = router;
