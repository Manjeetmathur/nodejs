import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


app.use(cookieParser())


app.use(cors({
       origin : process.env.ORIGIN,
       credentials: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


import userRouter from './routes/userRoutes.js'

app.use("/api/v1/users",userRouter)


export { app }