const express = require('express'); 
const router = express.Router();  
const sequelize = require('../db');
// const Log = require('../db').import('../models/log');
const validateSession = require('../middleware/validate-session');
var Log = sequelize.import('../models/log');
// var TestModel = sequelize.import('../models/log');
// const sequelize = require('../db');

router.post('/create', (req, res) => {
  if (!req.errors) {
      const logRequest = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner: req.user.id
      }
      Log.create(logRequest)
      .then(log => res.status(200).json(log))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

router.get('/:name', (req, res) => {
  Log.findOne({ where: { nameOfLog: req.params.name }})
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({ error: err}))
})

router.get('/', (req, res) => {
    Log.findAll()
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({error: err}))
})

router.put('/:id', (req, res) => {
  if (!req.errors) {
    Log.update(req.body, { where: { id: req.params.id }})
      .then(log => res.status(200).json(log))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

// router.post('/create', (req, res) => { //Add validateSession as middleman between function and return info//

//     if (!req.errors) {
//       const logFromRequest = {
//         description: req.body.description,
//         definition: req.body.definition,
//         result: req.body.result,
//         owner: req.body.owner
//       }
  
//       Log.create(logFromRequest)
//         .then(log => res.status(200).json(log))
//         .catch(err => res.json(req.errors))
//     } else {
//       res.status(500).json(req.errors)
//     }
//   })

router.delete('/:id', (req, res) => {
    if (!req.errors) {
      Log.destroy({ where: { id: req.params.id }})
      .then(log => res.status(200).json(log))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})
  
module.exports = router;

