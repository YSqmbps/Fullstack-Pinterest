import express from 'express';
import { getUser } from '../controllers/user.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();    

router.post("/create", async (req,res) => {
    const userInformation = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password,10);

    await User.create({
        username: req.body.username,
        email: req.body.email,
        hashedPassword: hashedPassword,
    })

    res.json({
        message: "User created successfully",
    })
    
})




router.get("/:username",getUser)

export default router;
