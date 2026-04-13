import jobModel from "../models/jobModel.js"
import mongoose from "mongoose"
// job posted by an admin
export const postJob = async (req, res) => {
    try {
        //    console.log(req.body)

        const { title, description, requirements, salary, experienceLevel, location, jobType, position,companyId } = req.body
    

        if (!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType
             || !position || !companyId) {
            return res.status(400).json({ message: "Something is missing!", success: false })
        }

        console.log(req.body)
  
        //  const cid =  new mongoose.Types.ObjectId(companyId)
        //  console.log(cid)
        // // posting new job
        const job = new jobModel({
            title, description,
            requirements: requirements.split(","),
            salary, experienceLevel, location, jobType,
            position, 
            companyId,
            created_by: req.user
        })
        await job.save()
        return res.status(201).json({
            success: true,
            message: "New job created successfully!",
            job
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while posting new job...",
            error
        })
    }
}

// for student all jobs
export const getAllJobs = async (req, res) => {
    try {
        let keyword = req.query.keyword || ""

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }
        const jobs = await jobModel
            .find(query)
            .populate("companyId")
            .populate("created_by")
            .sort({ createdAt: -1 })

        if (!jobs) {
            return res.status(404).json({
                success: false,
                message: "No job found!"
            })
        }
        return res.status(200).json({
            success: true,
            jobs
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting all jobs...",
            error
        })
    }
}

// get all Admin jobs by id
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.user
        const jobs = await jobModel
        .find({ created_by: adminId })
        .populate('companyId')
        .sort({ createdAt: -1 })
      
        if (!jobs) {
            return res.status(404).json({
                success: false,
                message: "No job found!"
            })
        }
        return res.status(200).json({
            success: true,
            jobs
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting job by id...",
            error
        })
    }
}

// get jobById (student)
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id
        const job = await jobModel.findById({ _id: jobId }).populate("applications")
        console.log(job)
        
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json(
            { 
                 job,
                 success: true
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting job by id...",
            error
        })
    }
}