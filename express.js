const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { handleFormData, handleLectureData, handleActivityData, handleMissedLectureData } = require('./activities.js')
const cors = require('cors')
const app = express()
const PORT = 3000

let formBody = {}
let lectures = {}
let activities = {}
let missedLectures = {}
let activityCoords = {}
let catchUpDays = {}

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.post('/formquestions/',(req,res) => {

    formBody = req.body
    handleFormData(formBody)
    res.status(201).send('Submission successful')
    
})

app.post('/lectures/',(req,res) => {

    lectures = req.body
    handleLectureData(lectures)
    res.status(201).send('Submission successful')

})

app.post('/activities/',(req,res) => {

    activities = req.body
    handleActivityData(activities)
    res.status(201).send('Submission successful')

})

app.post('/missed-lectures/',(req,res) => {

    missedLectures = req.body
    handleMissedLectureData(missedLectures)
    res.status(201).send('Submission successful')

})

app.post('/catch-up-days/',(req,res) => {

    catchUpDays = req.body

})

app.post('/activitycoords/',(req,res) => {

    activityCoords = req.body

})

/* GET REQUESTS */


app.get('/activitycoords/',(req,res) => {

    res.send(activityCoords)

})

app.get('/catch-up-days/',(req,res) => {

    res.send(catchUpDays)

})

app.get('/formquestions/', (req,res) => {

    res.send(formBody)

})

app.get('/activities/',(req,res) => {

    res.send(activities)
})

app.get('/lectures/', (req,res) => {

    res.send(lectures)

})

app.get('/missed-lectures', (req,res) => {

    res.send(missedLectures)

})


app.listen(PORT, () => {

    console.log('Listening on port ' + PORT)

})

