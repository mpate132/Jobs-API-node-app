const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createBy: req.user.id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createBy: req.user.id });
  if (!job) throw new NotFoundError(`Job not found with ${req.params.id}`);
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createBy = req.user.id;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  if (req.body.company === "" || req.body.position === "")
    throw new BadRequestError("Invalid company name and position name.");

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, createBy: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) throw new NotFoundError(`Job not found with ${req.params.id}`);
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    createBy: req.user.id,
  });
  if (!job) throw new NotFoundError(`Job not found with ${req.params.id}`);
  res.status(StatusCodes.OK).send("Job Deleted Successfully.");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
