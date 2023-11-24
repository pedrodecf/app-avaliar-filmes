require("express-async-errors")
require("dotenv/config")
const AppError = require("./utils/AppError")
const express = require("express")
const routes = require("./routes")
const uploadConfig = require("./configs/upload")

const cors = require("cors")

const api = express()
api.use(cors())
api.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

api.use(express.json())
api.use(routes)
api.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
})

const PORT = process.env.SERVER_PORT || 3000
api.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
