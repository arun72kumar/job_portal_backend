import express from "express"
import { postJob,getAllJobs,getAdminJobs,getJobById } 
from "../controllers/jobControllers.js"
import { isAuthenticated } from "../middlewares/middleware.js"
const router =  express.Router()
// API
// POST | http://localhost:5000/api/v1/job/add
router.route("/add").post(isAuthenticated,postJob)
router.route("/all").get(getAllJobs)
// http://localhost:5000/api/v1/job/getAdminJobs
router.route("/getAdminJobs").get(isAuthenticated,getAdminJobs)

//  http://localhost:5000/api/v1/job/:
router.route("/:id").get(isAuthenticated,getJobById)
export default router

