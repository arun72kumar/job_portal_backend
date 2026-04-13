import applicationModel from "../models/applicationModel.js"
import jobModel from "../models/jobModel.js"

// apply job
export const applyJob = async (req, res) => {
    try {
        const userId = req.user
        const jobId = req.params.id
        // job id is mandatory
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        }
        // already applied for this job
        const existingApplication = await applicationModel.findOne({
            job: jobId, applicant: userId
        })
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }
        // check if the jobs exists
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // applying new job
        const application = new applicationModel({
            job: jobId,
            applicant: userId
        })

        job.applications.push(application._id)
        await job.save()
        await application.save()
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
            application
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while applying a job..."
        })
    }
}

// get applied jobs students
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user;

        const applications = await applicationModel
            .find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { createdAt: -1 },
                populate: {
                    path: "companyId",
                    options: { createdAt: -1 }
                }
            })

        if (!applications) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        res.status(200).json({
            success: true,
            applications
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error whle getting applied jobs...",
            error
        })
    }
}

// get all applicants detials
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id
        const job = await jobModel.findById(jobId)
            .populate({
                path: "applications",
                sort: { createdAt: -1 },
                populate: {
                    path: "applicant"
                }
            })
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };

        res.status(200).json({
            success: true,
            job
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting applicant...",
            error
        })
    }
}

// updateStatus
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const {id} = req.params
        console.log(status,id)
        const application = await applicationModel.findOne({ _id: id })
        if(!status)
        {
            return res.status(400).json({ message: "Status not found!" }) 
        }
        if (!application) {
            return res.status(404).json({ message: "Application not found!" })
        }
        application.status = status
        await application.save()
        res.status(201).json({
            success: true,
            message: "Status updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating status...",
            error
        })
    }
}
