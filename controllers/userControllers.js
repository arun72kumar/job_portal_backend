import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"
// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body
        // cloudinary file
        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        console.log(cloudResponse)


        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ message: "Something is missing!", success: false })
        }
        const existingUser = await userModel.findOne({ email })

        // EXISTING USER
        if (existingUser) {
            return res.status(400).json({
                message: "Already registered!", success: false
            })
        }
        // HASH PASSWORD
        const saltRound = 11
        const hashedPassword = await bcrypt.hash(password, saltRound)

        const user = new userModel({
            name, email, password: hashedPassword, phone,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url
            }
        })
        await user.save()
        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while registeration...",
            error
        })
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Something is missing!", success: false })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User not found!", success: false })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ message: "email or password is incorrect!", success: false })
        }
        else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "3h" })

            res.status(201).cookie("token", token,
                { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" })
                .json({
                    success: true,
                    message: `Welcome back ${user.name}`,
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        profile: user.profile
                    }
                })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while login...",
            error
        })
    }
}

// LOGOUT
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully!",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logout....",
            error
        })
    }
}

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, bio, skills } = req.body
        // console.log(req.body)


        // cloudinary 
        const file = req.file
        let cloudResponse
        if (file) {
            const fileUri = getDataUri(file)
            cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        }

        let skillArray;
        if (skills) {
            skillArray = skills.split(",")
        }

        const user = await userModel.findById(req.user)
        if (!user) {
            return res.status(400).json({
                message: 'User not found!',
                success: false
            })
        }

        // updating user detials
        if (name) { user.name = name }
        if (email) { user.email = email }
        if (phone) { user.phone = phone }
        if (bio) { user.bio = bio }
        
        if (skills) { user.profile.skills = skillArray }

        if (cloudResponse) {
            user.profile.resume = cloudResponse?.secure_url
            user.profile.resumeOriginalName = file.originalname
        }

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile: user.profile
            }
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while updating profile...",
            error
        })
    }
}

