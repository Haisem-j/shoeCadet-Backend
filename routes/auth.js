const router = require('express').Router()
const User = require('../models/User');
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
        // Check if username exists in database
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
            return res.status(400).send('User exists')
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            username: req.body.username,
            password: hashPassword
        })

        // Save user to database
        try {
            const savedUser = await user.save()
            res.send(savedUser)
        } catch (error) {
            res.status(400).send(error)
        }
})


router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    //Check if username exists in database
    if (!user || user === null) {
        res.json({ 'Message': "UDNE" })
    }else{
        // Check password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            res.json({ 'Message': "UDNE" });
        } else {
            res.status(200).json({ 'Message': "GOOD" });
        }

    }
})



module.exports = router;