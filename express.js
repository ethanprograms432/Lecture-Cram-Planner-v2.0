const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = 3000

let formBody = {}
let lectures = {}
let activities = {}
let missedLectures = {}

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.post('/formquestions/',(req,res) => {

    formBody = req.body
    res.status(201).send('Submission successful')
    
})

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

