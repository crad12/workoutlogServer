const router = require('express').Router();      
// var sequelize = require('../db');
const User = require('../db').import('../models/user'); 
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const validateSession = require('../middleware/validate-session');

router.post('/createuser', (req, res) => {              

    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 10)

  }).then(
      createSuccess = (user) => {
          let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
          res.json({
              user: user,
              message: 'created',
              sessionToken: token
          });
      },
      createError = err => res.send(500, err)
  );
})

router.post('/signin', (req, res) => {
    
    User.findOne({ where: { email: req.body.email } })
    .then(
        user => {
            if (user) {
                bcryptjs.compare(req.body.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        res.json({
                            user: user,
                            message: "successfully authenticated",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "you failed, yo" }); 
                    }
                });
            } else {
                res.status(500).send({error: "failed to authenticate"});
            }
        },
        err => res.status(501).send({error: "you failed, yo"})
        
    );
});
  
module.exports = router;
    