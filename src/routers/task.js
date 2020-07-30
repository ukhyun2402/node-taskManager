const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');
const { findOne } = require('../models/task');

router.post('/tasks', auth,  async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    })
    console.log(task);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(404).send(error);
    }
});

// GET /tasks?completed=true,
// GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async (req, res) => {
    const criteria = {};
    if (req.query.completed) {
        criteria.completed = req.query.completed;
    }
    try {
        await req.user.populate({
            path: "tasks",
            match: criteria,
            options: {
                perDocumentLimit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            }
        }).execPopulate();
        res.send((req.user.tasks));
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
        const task = await Task.findOne({ _id, owner: req.user.id });

        if(!task) res.status(404).send();
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['completed', 'description'];
    const params = Object.keys(req.body);
    const isValid = params.every((param) => allowedUpdates.includes(param));

    if(!isValid) return res.status(400).send({'Error':'Invalid Params'});

    try {
        const task = await findOne({_id: req.params.id, owner: req.user._id});
        if(!task) return res.status(204).send(task);
        params.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        // if(!task) return res.status(404).send();
        res.status(200).send(task);
    } catch (error) {
        res.send(500).send(error);
    }

});

module.exports = router;