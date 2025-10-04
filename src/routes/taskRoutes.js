const express = require("express")
const router = require('express').Router()
const taskControllers = require('../controllers/taskControllers')


router.post('/', taskControllers.createTask)
router.get('/',taskControllers.getTask)
// router.get('/:completeStatus', taskControllers.getTaskcompleteStatus)
// router.delete('/:title',taskControllers.deleteTaskbyTitle)
router.put('/:id', taskControllers.updateTasks)
router.delete('/:id', taskControllers.deleteTasks)


// router.put('/:id', taskControllers.updateDescription)


module.exports = router