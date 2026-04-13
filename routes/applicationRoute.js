import express from "express"
import { isAuthenticated } from "../middlewares/middleware.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from 
"../controllers/applicationController.js"
const router = express.Router()
// API | http://localhost:5000/api/v1/application/create
router.route("/create/:id").get(isAuthenticated,applyJob)
// http://localhost:5000/api/v1/application/all
router.route("/all").get(isAuthenticated,getAppliedJobs)
// http://localhost:5000/api/v1/application/id/applicants
router.route("/:id/applicants").get(isAuthenticated,getApplicants)
// http://localhost:5000/api/v1/application/status/id/update
router.route("/status/:id/update").put(isAuthenticated,updateStatus)


export default router