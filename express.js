const express = require('express')
//const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = 3000

let formBody = {}
let lectures = {}
let activities = {}
let missedLectures = {}

//app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.post('/formquestions/',(req,res) => {

    formBody = {

        'Lectures Behind': req.body["num-lectures-behind"],
        'Stress Rating': req.body["num-stress-rating"],
        'Sleep Time': req.body["sleep-time"],
        'Sleep Time Format': req.body["time-format-sleep-time"],
        'Wake Time': req.body["wake-time"],
        'Wake Time Format': req.body["time-format-wake-time"],
        'Breakfast Preference': req.body["breakfast-preference"],
        'Breakfast Time': req.body["breakfast-time"],
        'Breakfast Time Format': req.body["time-format-breakfast-time"],
        'Lunch Preference': req.body["lunch-preference"],
        'Lunch Time': req.body["lunch-time"],
        'Lunch Time Format': req.body["time-format-lunch-time"],
        'Dinner Time': req.body["dinner-time"],
        'Dinner Time Format': req.body["time-format-dinner-time"]

    }
    res.status(201).send('Submission successful')

})

/* POST REQUESTS */

app.post('/lectures/',(req,res) => {

    lectures = req.body
    res.status(201).send('Submission successful')

})

app.post('/activities/',(req,res) => {

    activities = req.body
    res.status(201).send('Submission successful')

})

app.post('/missed-lectures/',(req,res) => {

    missedLectures = req.body
    res.status(201).send('Submission successful')

})

/* GET REQUESTS */

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