import express from "express"
import { getCompanies, getCompanyById, registerCompany,
    updateCompany
 } from 
"../controllers/companyControllers.js"
import { isAuthenticated } from "../middlewares/middleware.js"
import singleUpload from "../middlewares/multer.js"

const router = express.Router()
// API
// POST | http://localhost:5000/api/v1/company/create
router.route("/create").post(isAuthenticated,registerCompany)
//  http://localhost:5000/api/v1/company/all
router.route("/all").get(isAuthenticated,getCompanies)
//  http://localhost:5000/api/v1/company/
router.route("/:id").get(isAuthenticated,getCompanyById)
//  http://localhost:5000/api/v1/company/update/
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany)

export default router