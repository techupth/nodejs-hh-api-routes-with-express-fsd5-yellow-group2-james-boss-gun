// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";
let assignmentsMockDatabase = assignments;
let commentsAssignmentsMockDatabase = comments;
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 5) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 5 assignments per request",
    });
  }
  const assignmentsWithLimit = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentsFromClient
  );

  return res.json({
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "Assignment has been created successfully",
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);
  const assignmentsIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentsFromClient;
  });

  assignmentsMockDatabase[assignmentsIndex] = {
    id: assignmentsFromClient,
    ...req.body,
  };

  return res.json({
    message: "Assignment has been updated successfully",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentsFromClient;
  });
  assignmentsMockDatabase = newAssignments;
  return res.json({
    message: "Assignment has been deleted successfully",
  });
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  commentsAssignmentsMockDatabase.push({
    id:
      commentsAssignmentsMockDatabase[
        commentsAssignmentsMockDatabase.length - 1
      ].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: commentsAssignmentsMockDatabase[
      commentsAssignmentsMockDatabase.length - 1
    ],
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let commentsAssignmentsFromClient = Number(req.params.assignmentsId);
  let assignmentsComments = commentsAssignmentsMockDatabase.filter(
    (item) => item.assignmentId === commentsAssignmentsFromClient
  );
  return res.json({
    message: "Complete fetching comments",
    data: assignmentsComments,
  });
});

app.listen(port, () => {
  console.log(`Sever is running at ${port}`);
});
