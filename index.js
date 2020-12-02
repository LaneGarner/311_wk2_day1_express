const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 4000

const { users } = require('./state')
const { raw } = require('body-parser')
const counter = users.length;

app.use(bodyParser.json())

// * GET /users
app.get('/users', (req, res) => res.json(users))

// * GET /users/1
app.get('/users/1', (req, res) => res.json(users[0]))

// * POST /users
app.post('/users', (req, res) => {
  users.push({
    _id: (counter + 1),
    ...req.body
  })
  
  // const newUser = {
  //   "_id": 6,
  //   "name": "Bob",
  //   "occupation": "Builder",
  //   "avatar": "https://i.ytimg.com/vi/8kFfHnre85o/maxresdefault.jpg"
  // }
  // users.push(newUser)
  res.json(users)
})

// * PUT /users/1

app.put('/users/1', (req, res) => {
  users.forEach(user => {
    if (user._id === 1) {
      user.name = "Lane";
    }
    res.json(users)
  })
})

// * DELETE /users/1
app.delete('/users/1', (req, res) => {
  const newUsersList = users.slice(1)
  res.json(newUsersList)
  res.send({ msg: 'Deleted'})
})


// GET /users/1 => GET /users/:userId
app.get('/users/:id', (req, res) => res.json(users.filter(user => user._id === parseInt(req.params.id))))

// * PUT /users/1 => PUT /users/:userId

app.put('/users/:id', (req, res) => {
  const found = users.some(user => user._id === parseInt(req.params.id));

  if (found) {
    const updateUser = req.body
    users.forEach(user => {
      if(user._id === parseInt(req.params.id)) {
        user.name = updateUser.name ? updateUser.name : user.name;
        user.occupation = updateUser.occupation ? updateUser.occupation : user.occupation;
        user.avatar = updateUser.avatar ? updateUser.avatar : user.avatar;

        res.json({ msg: 'User updated', user })
      }
    });
  } else {
    res.status(400).json({ msg: `No user with the id of ${req.params.id}` });
  }
  res.json(users)
});


// * DELETE /users/1 => DELETE /users/:userId
app.delete('/users/:id', (req, res) => {
  const found = users.some(user => user._id === parseInt(req.params.id));

  if (found) {
    res.json({ msg: 'User deleted', users: users.filter(user => user._id !== parseInt(req.params.id))});
  } else {
    res.status(400).json({ msg: `No user with the id of ${req.params.id}` })
  }
})



app.listen(port, () => 
  console.log(`Example app listening on port ${port}!`))