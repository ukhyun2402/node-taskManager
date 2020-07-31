const { response } = require('express');
const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const {sendWelcomeEmail, sendByeEmail} = require('../emails/account');


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
        try {
            sendWelcomeEmail(user.email, user.name);    
        } catch (error) {
            return res.status(500).send({error:'Fail to Send Welcome Email'});
        }
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token});
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    console.log(updates);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({'error':'Invalid operation!'});
    }

    try {
        const user = req.user;
        user.set(req.body);
        // updates.forEach((update) => req.user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a JPG,JPEG,PNG'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
}, (err, req, res, next) => {
    res.status(400).send({error : err.message})
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user.avatar || !user) {
            throw new Error('')
        }

        res.set('Content-Type','image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        try {
            sendByeEmail(req.user.email, req.user.name);
        } catch (error) {
            return res.status(500).send({error:'Fail to send Email.'});
        }
        await req.user.remove(); 
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;