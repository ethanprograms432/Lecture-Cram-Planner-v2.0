const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { recieveUserID, handleFormData, handleLectureData, handleActivityData, handleMissedLectureData } = require('./activities.js')
const cors = require('cors')
const app = express()
const PORT = 3000

let formBody = {}
let lectures = {}
let activities = {}
let missedLectures = {}
let activityCoords = {}
let catchUpDays = {}
let users = {

    users: []
}

let userID = ""

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.use(express.static(path.join(__dirname,'public')))

app.post('/users/',(req,res) => {

    recieveUserID(req.body.userID)
    userID = req.body.userID
    users.users.push(req.body)

})

app.post('/formquestions/:id',(req,res) => {

    formBody[userID] = req.body
    handleFormData(formBody[userID])
    res.status(201).send('Submission successful')
    
})

app.post('/lectures/:id',(req,res) => {

    lectures[userID] = req.body
    handleLectureData(lectures[userID])
    res.status(201).send('Submission successful')

})

app.post('/activities/:id',(req,res) => {

    activities[userID] = req.body
    handleActivityData(activities[userID])
    res.status(201).send('Submission successful')

})

app.post('/missed-lectures/:id',(req,res) => {

    missedLectures[userID] = req.body
    handleMissedLectureData(missedLectures[userID])
    res.status(201).send('Submission successful')

})

app.post('/catch-up-days/:id',(req,res) => {

    catchUpDays[userID] = req.body

})

app.post('/activitycoords/:id',(req,res) => {

    activityCoords[userID] = req.body

})

/* GET REQUESTS */


app.get('/activitycoords/:id',(req,res) => {

    res.send(activityCoords[req.params.id])

})

app.get('/catch-up-days/:id',(req,res) => {

    res.send(catchUpDays[req.params.id])

})

app.get('/formquestions/:id', (req,res) => {

    res.send(formBody[req.params.id])

})

app.get('/activities/:id',(req,res) => {

    res.send(activities[req.params.id])
})

app.get('/lectures/:id', (req,res) => {

    res.send(lectures[req.params.id])

})

app.get('/missed-lectures/:id', (req,res) => {

    res.send(missedLectures[req.params.id])

})

app.get('/users/',(req,res) => {

    res.send(users)
})


app.listen(PORT, () => {

    console.log('Listening on port ' + PORT)

})

