// Start coding here
import express from 'express';
import { assignments } from './data/assignments.js';
import { comments } from './data/comments.js';

// Set up express for api
const app = express();
const PORT = process.env.port || 3000;

// Set up express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// fetch all assignments
app.get('/assignments', (req, res) => {
  const limit = req.query.limit || 10;
  // res error if limit is greater than 10
  if (limit > 10) {
    res.status(400).json({ error: 'Limit should be less than 10' });
  }
  const assignmentData = { message: "Complete fetcing assignments", data: assignments.slice(0, limit) };
  res.json(assignmentData);
});

// fetch assignment by id
app.get('/assignments/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const assignment = assignments.find((assignment) => assignment.id === id);
  if (!assignment) {
    res.status(404).json({ error: 'Assignment not found' });
  }
  const assignmentData = { message: "Complete fetcing assignments", data: assignment };
  res.json(assignmentData);
});

// create assignment
app.post('/assignments', (req, res) => {
  const { title, description, categories } = req.body;

  if (!Array.isArray(categories)) {
    res.status(400).json({ error: 'Categories must be an array of categories' })
  }

  // create new id by adding 1 to the last id. use 1 if assignemnt array is empty.
  const newId = (assignments[assignments.length - 1].id + 1) || 1;
  const newAssginment = { id: newId, title, categories, description };
  assignments.push(newAssginment);

  res.json({ message: "New assignment has been created successfully", data: newAssginment });
})


// delete assignment bv id 
app.delete('/assignments/:id', (req, res) => {
  // search for the index to delete
  const indextoDelete = assignments.findIndex(assignment => assignment.id === Number(req.params.id))

  if (indextoDelete != -1) {
    assignments.splice(indextoDelete, 1);
    res.json({ message: `Assignment Id : ${req.params.id} has been deleted successfully` })
  }
  else {
    res.status(404).json({
      message: "Cannot delete, No data available!"
    })
  }

})

// edit existing assignment
app.put('/assignments/:id', (req, res) => {
  const indextoModify = assignments.findIndex(assignment => assignment.id === Number(req.params.id));
  const { title, description, categories } = req.body;

  if (indextoModify != -1) {
    assignments[indextoModify] = { id: assignments[indextoModify].id, title, categories, description }
    res.json({
      message: `Assignment Id : ${req.params.id}  has been updated successfully`,
      data: assignments[indextoModify],
    })

  }
  else {
    res.status(404).json({
      message: "Cannot update, No data available!"
    })

  }
})

// Get all comments associated with an assignment.
app.get('/assignments/:id/comments', (req, res) => {
  const allComments = comments.filter(comment => comment.assignmentId === Number(req.params.id))
  res.json({
    message: "Complete fetching comments",
    data: allComments
  })
})


// Post a new comment to an assignment
app.post('/assignments/:id/comments', (req, res) => {
  const { assignmentId, content } = req.body;
  const newId = (comments[comments.length - 1].id + 1) || 1;

  const newComment = {
    id: newId,
    assignmentId: Number(assignmentId),
    content
  }
  comments.push(newComment);

  res.json({
    message: "New comment has been created successfully",
    data: newComment,
  })


})