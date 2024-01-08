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
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentsWithLimit = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentsFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  if (!req.body.description) {
    return res.json({
      message:
        "Description not found, please give description to create assignment",
    });
  }

  if (!req.body.title) {
    return res.json({
      message: "Title not found, please give title to create assignment",
    });
  }
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockDatabase[assignmentsMockDatabase.length - 1],
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);
  const assignmentToUpdate = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentsFromClient;
  });
  if (!assignmentToUpdate) {
    return res.status(404).json({
      message: `Cannot update with id: ${assignmentsFromClient} , No data available!`,
    });
  }
  if (!req.body.description) {
    return res.json({
      message:
        "Description not found, please give description to create assignment",
    });
  }

  if (!req.body.title) {
    return res.json({
      message: "Title not found, please give title to create assignment",
    });
  }
  const assignmentsIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentsFromClient;
  });

  assignmentsMockDatabase[assignmentsIndex] = {
    id: assignmentsFromClient,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id : ${assignmentsFromClient}  has been updated successfully`,
    data: assignmentsMockDatabase[assignmentsIndex],
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsFromClient = Number(req.params.assignmentsId);

  const assignmentToDelete = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentsFromClient;
  });

  if (!assignmentToDelete) {
    return res.status(404).json({
      message: `Cannot delete assignment with id: ${assignmentsFromClient}, No data available!`,
    });
  }

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentsFromClient;
  });
  assignmentsMockDatabase = newAssignments;
  return res.json({
    message: `Assignment Id : ${assignmentsFromClient}  has been deleted successfully`,
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
