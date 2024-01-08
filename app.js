// Start coding here

import express from "express";

import { assignments } from "./data/assignments.js";

let assignmentsDatabase = assignments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/assignments", function (req, res) {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsDatabase[assignmentsDatabase.length - 1],
  });
});

// app.get('/assignments', function (req, res) {
//   return res.json({
//     data: assignmentsDatabase
//   })
// });
// แสดงข้อมูลทั้งหมด

app.get("/assignments", function (req, res) {
  // console.log(req.query.limit);
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentsWithLimit = assignmentsDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  let assignmentData = assignmentsDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.delete("/assignments/:assignmentId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentId);

  const haveParam = assignmentsDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!haveParam) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignments = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentId);

  const haveParam = assignmentsDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!haveParam) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  const assignmentIndex = assignmentsDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    data: assignmentsDatabase[assignmentIndex],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
