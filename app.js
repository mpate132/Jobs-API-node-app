require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authMiddleWare = require("./middleware/authentication");
const connectDB = require("./db/connect");
const express = require("express");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(
  expressRateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 60,
  })
);

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleWare, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("CONNECTION TO DB SUCCESSFUL....");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
