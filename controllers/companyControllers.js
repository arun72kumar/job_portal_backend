import companyModel from "../models/companyModel.js"
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"

// CREATE COMPANY
export const registerCompany = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                message: "Company name is required!",
                success: false
            })
        }
        // already registered company
        const existingCompany = await companyModel.findOne({ name: name })
        if (existingCompany) {
            return res.status(400).json({
                message: "Company cannot be registered with same name!",
                success: false
            })
        }
        // adding company 
        const company = new companyModel({
            name: name,
            userId: req.user
        })
        await company.save()
        res.status(201).json({
            success: true,
            message: "Company resgistered successfully!",
            company
        })


    } catch (error) {
        res.status(500).json({
            message: "Error while creating company...",
            success: false,
            error
        })
    }
}

// getCompanies
export const getCompanies = async (req, res) => {
    try {
        const companies = await companyModel.find({ userId: req.user })
        if (!companies) {
            return res.status(400).json({
                success: false,
                message: "No company found!"
            })
        }
        res.status(200).json({
            success: true,
            companies
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting companies...",
            error
        })
    }
}

// get company
export const getCompanyById = async (req, res) => {
    try {
        const company = await companyModel.findById({ _id: req.params.id })
        return res.status(200).json({
            success: true,
            company
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting a company...",
            error
        })
    }
}

// update company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body
        // cloudinary (file handling)
        const file = req.file
        let cloudResponse, logo;
        if (file) {
            const fileUri = getDataUri(file)
            cloudResponse = await cloudinary.uploader.upload(fileUri.content)
            logo = cloudResponse.secure_url;
        }
        const updateData = { name, description, website, location, logo };
        const company = await companyModel.findByIdAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true }
        )
        res.status(201).json({
            success: true,
            message: "Company updated successfully!",
            company
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while updating company..",
            error
        })
    }
}