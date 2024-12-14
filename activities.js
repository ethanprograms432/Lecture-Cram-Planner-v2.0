
const activityCoords = {

    activities: []
}

let lecturesBehind = 0
let timeToCatchUp = ''

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function handleFormData(formData) {

    lecturesBehind = formData["num-lectures-behind"]
    const sleepTime = formData["sleep-time"]
    const wakeTime = formData["wake-time"]

    handleEveryDayData('Sleep',sleepTime,'24:00',true)
    handleEveryDayData('Sleep','00:00',wakeTime,true)
    

    if(formData["breakfast-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["breakfast-time"],20)
        handleEveryDayData('Breakfast',formData["breakfast-time"],endTime,true)
    }

    if(formData["lunch-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["lunch-time"],20)
        handleEveryDayData('Lunch',formData["lunch-time"],endTime,true)
        
    }

    if(formData["dinner-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["dinner-time"],30)
        handleEveryDayData('Dinner',formData["dinner-time"],endTime,true)
        
    }

}

function handleLectureData(lectureData) {

    for (let i = 0; i < lectureData["lecture-name"].length; i++) {

        let endTime = addMinutesToTime(lectureData["lecture-start-time"][i],50)

        if(lectureData["lecture-day"][i] === "Everyday") {
    
            handleEveryDayData(lectureData["lecture-name"][i],lectureData["lecture-start-time"][i],endTime,false)

        } else {

            let info = getActivityCoordinates(lectureData["lecture-start-time"][i],endTime,lectureData["lecture-day"][i])
            postActivityToAPI(lectureData["lecture-name"][i],info[0],info[1],info[2])

        }

    }

}

function handleMissedLectureData(missedLectureData) {

    for (let i = 0; i < missedLectureData["missed-lecture-name"].length; i++) {

        let endTime = addMinutesToTime(missedLectureData["missed-lecture-start-time"][i],50)
        let missedLectureName = missedLectureData["missed-lecture-name"][i]
        let info = getActivityCoordinates(missedLectureData["missed-lecture-start-time"][i],endTime,missedLectureData["missed-lecture-day"][i])

        let initHeight = info[2]

        if(missedLectureData["missed-lecture-day"][i] !== 'Everyday') {

            let coords = findATimeSlot(info[0],info[1],info[2])
            let x = coords[0]
            let y = coords[1]


            if(x === -1 && y === -1) {

                console.log('One lecture could not be filled')
            } else {

                postActivityToAPI(missedLectureName,x,y,initHeight)
            }
        } else {

            for (let j = 0; j < days.length - 2; j++) {

                info = getActivityCoordinates(missedLectureData["missed-lecture-start-time"][i],endTime,days[j])
                let coords = findATimeSlot(info[0],info[1],info[2])
                let x = coords[0]
                let y = coords[1]


                if(x === -1 && y === -1) {

                    console.log('One lecture could not be filled')
                } else {

                    postActivityToAPI(missedLectureName,x,y,initHeight)
                }

            }

        }
        
    }
    fillInLecturesToCatchUp()

}

async function fillInLecturesToCatchUp() {

    let ableToBeFilled = true
    let lecturesFilled = 0

    while(lecturesBehind > 0 && ableToBeFilled === true) {

        let info = getActivityCoordinates('00:00','00:50','Monday')
        let height = info[2]
        let coords = findATimeSlot(info[0],info[1],info[2])

        if(coords[0] !== -1 && coords[1] !== -1) {

            postActivityToAPI('Lecture Catch Up',coords[0],coords[1],height)
            lecturesBehind -= 1;
            lecturesFilled++;

        } else {

            ableToBeFilled = false;

        }

    }

    const daysItWillTake = Math.ceil(7*((lecturesFilled+lecturesBehind)/lecturesFilled));

    //console.log("It will take " + daysItWillTake + " days to catch up if you start today.")

    try {

        const response = await fetch('http://localhost:3000/catch-up-days',{

            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
            },
            body: JSON.stringify({catchUpDays: daysItWillTake})
        })

        const contentType = response.headers.get('Content-Type') || '';
  
        if (response.ok) {
            if (contentType.includes('application/json')) {
            const result = await response.json();

            } else {
            const result = await response.text();

            }
        } else {
            const errorText = await response.text();

        }

    } catch(error) {

        console.log(error.message)
    }

}


function findATimeSlot(startX,startY,height) {

    for (let j = startY; j < 825; j += 1) {

        let valid = isValidSlot(startX,j,height)
        if(valid === true) { return [startX,j]}

    }

    for (let i = startX + 240; i < 1681; i += 240) {

        for (let j = 98.25; j < 825; j += 1) {

            let valid = isValidSlot(i,j,height)
            if(valid === true) { return [i,j]}
        }
 
    }

    return [-1,-1]

}

function isValidSlot(x,y,height) {

    let extendsDays = false

    let x3,x4,y3,y4 = 0

    let x2 = x + 240

    let y2 = y + height

    if(y2 > 825) {

        y2 = 824.25
        extendsDays = true

        x3 = x2
        x4 = x3 + 240

        y3 = 98.25
        y4 = (y + height) - 726
    }

    for (let i = 0; i < activityCoords["activities"].length; i++) {

        const startX = activityCoords["activities"][i]["xPosition"]
        const startY = activityCoords["activities"][i]["yPosition"]
        const height = activityCoords["activities"][i]["height"]

        const endX = startX + 240
        const endY = startY + height

        if(!(startX === x && endX === x2 && ((y <= endY && y >= startY) || (y2 <= endY && y2 >= startY)))) {

            if(extendsDays === true) {

                if(startX === x3 && endX === x4 && ((y3 <= endY && y3 >= startY) || (y4 <= endY && y4 >= startY))) {
                    
                    return false;
                }

            }

        } else {

            return false;
        }


    }

    return true;

}

function handleActivityData(activityData) {

    for (let i = 0; i < activityData["activity-name"].length; i++) {

        const activityName = activityData["activity-name"][i]
        let startDay = activityData["activity-start-day"][i]
        const startTime = activityData["activity-start-time"][i]
        const endDay = activityData["activity-end-day"][i]
        const endTime = activityData["activity-end-time"][i]

        if(startDay === endDay) {

            // FOR LATER, INCLUDE THE CASE WHERE START TIME IS AFTER END TIME

            if(startDay === 'Everyday') {

                handleEveryDayData(activityName,startTime,endTime,true)

            } else {

                let info = getActivityCoordinates(startTime,endTime,startDay)
                postActivityToAPI(activityName,info[0],info[1],info[2])

            }

        } else {

            let info = getActivityCoordinates(startTime,'24:00',startDay)
            postActivityToAPI(activityName,info[0],info[1],info[2])

            let currIndex = days.indexOf(startDay)
            currIndex++;
            if(currIndex < 7) {

                startDay = days[currIndex]

            } else {

                startDay = days[0]
                currIndex = 0

            }
            
            while(currIndex !== days.indexOf(endDay)) {

                if(currIndex < 7) {

                    startDay = days[currIndex]
                    info = getActivityCoordinates('00:00','24:00',startDay)
                    postActivityToAPI(activityName,info[0],info[1],info[2])
                } else {

                    startDay = days[0]
                    info = getActivityCoordinates('00:00','24:00',startDay)
                    postActivityToAPI(activityName,info[0],info[1],info[2])
                    currIndex = 0

                }
                currIndex++;

            }

            info = getActivityCoordinates('00:00',endTime,endDay)
            postActivityToAPI(activityName,info[0],info[1],info[2])

        }

    }

}

function addMinutesToTime(timeString,minutesToAdd) {

    // Extract hours and minutes from the input string
  const [hours, minutes] = timeString.split(":").map(Number);

  // Convert the time to total minutes
  let totalMinutes = hours * 60 + minutes + minutesToAdd;

  // Handle wrapping around 24 hours
  totalMinutes = totalMinutes % (24 * 60);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle negative wrap-around

  // Calculate new hours and minutes
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  // Format the time back to HH:mm
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;

}

function handleEveryDayData(activityName,startTime,endTime,weekend) {

    let info = getActivityCoordinates(startTime,endTime,'Monday')
    postActivityToAPI(activityName,info[0],info[1],info[2])
    info = getActivityCoordinates(startTime,endTime,'Tuesday')
    postActivityToAPI(activityName,info[0],info[1],info[2])
    info = getActivityCoordinates(startTime,endTime,'Wednesday')
    postActivityToAPI(activityName,info[0],info[1],info[2])
    info = getActivityCoordinates(startTime,endTime,'Thursday')
    postActivityToAPI(activityName,info[0],info[1],info[2])
    info = getActivityCoordinates(startTime,endTime,'Friday')
    postActivityToAPI(activityName,info[0],info[1],info[2])

    if(weekend === true) {

        info = getActivityCoordinates(startTime,endTime,'Saturday')
        postActivityToAPI(activityName,info[0],info[1],info[2])
        info = getActivityCoordinates(startTime,endTime,'Sunday')
        postActivityToAPI(activityName,info[0],info[1],info[2])

    }

}

function getActivityCoordinates(startTime,endTime,day) {

    let xPos = 0

    switch(day) {

        case('Monday'):

            xPos = 240
            break;

        case('Tuesday'):

            xPos = 480
            break;

        case('Wednesday'):

            xPos = 720
            break;

        case('Thursday'):

            xPos = 960
            break;

        case('Friday'):

            xPos = 1200
            break;

        case('Saturday'):

            xPos = 1440
            break;

        case('Sunday'):

            xPos = 1680
            break;

        
    }

    const hours1 = parseInt(startTime.substring(0, startTime.indexOf(":")), 10)
    const minutes1 = parseInt(startTime.substring(startTime.indexOf(":") + 1),10)
    const hours2 = parseInt(endTime.substring(0, endTime.indexOf(":")), 10)
    const minutes2 = parseInt(endTime.substring(endTime.indexOf(":") + 1),10)

    const yPos = 98.25 + (((60*hours1)+minutes1)/1440)*726
    const yPos2 = 98.25 + (((60*hours2)+minutes2)/1440)*726

    const height = yPos2 - yPos

    return [xPos, yPos, height]
}

async function postActivityToAPI(activityName,xPos,yPos,elementHeight) {

    let newActivityInfo = {

        name: activityName,
        xPosition: xPos,
        yPosition: yPos,
        height: elementHeight

    }

    await activityCoords.activities.push(newActivityInfo)

    try {
        const response = await fetch('http://localhost:3000/activitycoords/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(activityCoords),
        });
    
        const contentType = response.headers.get('Content-Type') || '';
    
        if (response.ok) {
          if (contentType.includes('application/json')) {
            const result = await response.json();
            //alert('Form submitted successfully: ' + JSON.stringify(result));
          } else {
            const result = await response.text();
            //alert('Form submitted successfully: ' + result);
          }
        } else {
          const errorText = await response.text();
          //alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
        }
      } catch (error) {
        //alert('An error occurred: ' + error.message);
      }

}

module.exports = { handleFormData, handleLectureData, handleActivityData, handleMissedLectureData }