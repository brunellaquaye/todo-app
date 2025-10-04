const express = require('express')

const app = express()
app.use(express.json())


app.use('/tasks', require('./routes/taskRoutes'))


app.listen(3000, ()=> console.log('Server issss running on port 3000'))