import express from "express"
import "dotenv/config"
import chalk from "chalk"
import connectDB from "./config/config.js"
import cookieParser from "cookie-parser"
import  userRoutes from "./routes/userRoute.js"
import companyRoutes from "./routes/companyRoute.js"
import jobRoutes from "./routes/jobRoute.js"
import applicationRoutes from "./routes/applicationRoute.js"
import cors from "cors"
// INSTANCE OF EXPRESS
const app = express()
//PORT
const port = process.env.PORT
//DB SERVER
connectDB()
// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(cookieParser())
// ROUTES MIDDLEWARE
// http://localhost:5000/api/v1/users
app.use("/api/v1/users",userRoutes)
// http://localhost:5000/api/v1/company
app.use("/api/v1/company",companyRoutes)
// http://localhost:5000/api/v1/job
app.use("/api/v1/job",jobRoutes)
// http://localhost:5000/api/v1/application
app.use("/api/v1/application",applicationRoutes)


app.listen(port,
    ()=>console.log(chalk.yellow(`Server running at http://localhost:${port}`)))