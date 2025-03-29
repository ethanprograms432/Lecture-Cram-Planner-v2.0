
const activityCoords = {

    activities: []
}

let lecturesBehind = 0
let initlecturesBehind = 0
let timeToCatchUp = ''
let hoursOfFreeTime = 0
let userID = ""
let lecturesToCatchUpPerDay = [0,0,0,0,0,0,0]

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function recieveUserID(id) {

    userID = id
}

function handleFormData(formData) {

    activityCoords.activities = []
    lecturesBehind = formData["num-lectures-behind"]
    initlecturesBehind = formData["num-lectures-behind"]
    const sleepTime = formData["sleep-time"]
    const wakeTime = formData["wake-time"]
    hoursOfFreeTime = formData["free-time-hours"]

    const breakfastDuration = formData["breakfast-duration"]
    const lunchDuration = formData["lunch-duration"]
    const dinnerDuration = formData["dinner-duration"]

    if(sleepTime.substring(0,sleepTime.indexOf(":")) < wakeTime.substring(0,wakeTime.indexOf(":"))) {

        handleEveryDayData('Sleep',sleepTime,wakeTime,true)
    } else {

        handleEveryDayData('Sleep',sleepTime,'24:00',true)
        handleEveryDayData('Sleep','00:00',wakeTime,true)
    }

    if(formData["breakfast-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["breakfast-time"],breakfastDuration)

        if(!isOverlapping(formData["breakfast-time"],endTime)) {

            handleEveryDayData('Breakfast',formData["breakfast-time"],endTime,true)
        } else {

            handleEveryDayData('Breakfast',formData["breakfast-time"],'24:00',true)
            handleEveryDayData('Breakfast','00:00',endTime,true)


        }
        

        
    }

    if(formData["lunch-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["lunch-time"],lunchDuration)

        if(!isOverlapping(formData["lunch-time"],endTime)) {

            handleEveryDayData('Lunch',formData["lunch-time"],endTime,true)
        } else {

            handleEveryDayData('Lunch',formData["lunch-time"],'24:00',true)
            handleEveryDayData('Lunch','00:00',endTime,true)


        }
        
    }

    if(formData["dinner-preference"] === "Yes") {

        let endTime = addMinutesToTime(formData["dinner-time"],dinnerDuration)

        if(!isOverlapping(formData["dinner-time"],endTime)) {

            handleEveryDayData('Dinner',formData["dinner-time"],endTime,true)
        } else {

            handleEveryDayData('Dinner',formData["dinner-time"],'24:00',true)
            handleEveryDayData('Dinner','00:00',endTime,true)


        }
        
        
    }

}

function handleLectureData(lectureData) {

    if(Object.keys(lectureData).length > 0) {

        for (let i = 0; i < lectureData["lecture-name"].length; i++) {

            let endTime = addMinutesToTime(lectureData["lecture-start-time"][i],50)
            let startTime = lectureData["lecture-start-time"][i]

            if(lectureData["lecture-day"][i] === "Everyday") {
        

                if(!isOverlapping(startTime,endTime)) {

                    handleEveryDayData(lectureData["lecture-name"][i],lectureData["lecture-start-time"][i],endTime,false)
                } else {

                    handleEveryDayData(lectureData["lecture-name"][i],startTime,'24:00',false)
                    handleEveryDayData(lectureData["lecture-name"][i],'00:00',endTime,false)
                }
                

            } else {

                if(!isOverlapping(startTime,endTime)) {

                    let info = getActivityCoordinates(lectureData["lecture-start-time"][i],endTime,lectureData["lecture-day"][i])
                    postActivityToAPI(lectureData["lecture-name"][i],info[0],info[1],info[2])
                } else {

                    let followingDay = getFollowingDay(lectureData["lecture-day"][i])
                    let infoOne = getActivityCoordinates(lectureData["lecture-start-time"][i],'24:00',lectureData["lecture-day"][i])
                    postActivityToAPI(lectureData["lecture-name"][i],infoOne[0],infoOne[1],infoOne[2])

                    let infoTwo = getActivityCoordinates('00:00',endTime,followingDay)
                    postActivityToAPI(lectureData["lecture-name"][i],infoTwo[0],infoTwo[1],infoTwo[2])
                }
                

            }

        }
    }
}

function getFollowingDay(day) {

    switch(day) {

        case 'Monday':

            return 'Tuesday'
            break;

        case 'Tuesday':

            return 'Wednesday'
            break;

        case 'Wednesday':

            return 'Thursday'
            break;

        case 'Thursday':

            return 'Friday'
            break;

        case 'Friday':

            return 'Saturday'
            break;

        case 'Saturday':

            return 'Sunday'
            break;

        case 'Sunday':

            return 'Monday'
            break;
    }

}

function getDayFromIndex(index) {

    switch(index) {

        case 1:

            return 'Monday'
            break;

        case 2:

            return 'Tuesday'
            break;

        case 3:

            return 'Wednesday'
            break;

        case 4:

            return 'Thursday'
            break;

        case 5:

            return 'Friday'
            break;

        case 6:

            return 'Saturday'
            break;

        case 0:

            return 'Sunday'
            break;
    }

}

function isOverlapping(startTime,endTime) {

    if((startTime.substring(0,startTime.indexOf(":"))) < endTime.substring(0,endTime.indexOf(":"))) {

        return false;
    } else {

        if(startTime.substring(startTime.indexOf(":") + 1) < endTime.substring(endTime.indexOf(":") + 1)) {

            return false;
        }
        return true;
    }

}

function handleMissedLectureData(missedLectureData) {

    if(Object.keys(missedLectureData).length > 0) {

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

                    if((coords[1] + info[2]) < 825) {

                        postActivityToAPI(missedLectureName,x,y,initHeight)

                    } else {

                        let secondElementHeight = info[2] - (825 - coords[1])
                        postActivityToAPI(missedLectureName,coords[0],coords[1],(825 - coords[1]))

                        if((coords[0] + 240) <= 1680) {

                            postActivityToAPI(missedLectureName,coords[0] + 240,98.25,secondElementHeight)
                        } else {

                            postActivityToAPI(missedLectureName,240,98.25,secondElementHeight)
                        }
                    }
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

                        if((coords[1] + info[2]) < 825) {

                            postActivityToAPI(missedLectureName,x,y,info[2])

                        } else {

                            let secondElementHeight = info[2] - (825 - coords[1])
                            postActivityToAPI(missedLectureName,coords[0],coords[1],(825 - coords[1]))

                            if((coords[0] + 240) <= 1680) {

                                postActivityToAPI(missedLectureName,coords[0] + 240,98.25,secondElementHeight)
                            } else {

                                postActivityToAPI(missedLectureName,240,98.25,secondElementHeight)
                            }
                        }
                    }

                }

            }
            
        }
    }
    fillInFreeTime()
    fillInLecturesToCatchUp()

}

function fillInFreeTime()
{

    for (let i = 0; i < 7; i++) {

        let ableToBeFilled = false
        let endTime = addMinutesToTime("00:00",(hoursOfFreeTime*60))
        
            switch(i) {

                case(0):
                    
                    allocateFreeTime("Monday",240)
                    break;

                case(1):

                    allocateFreeTime("Tuesday",480)
                    break;

                case(2):

                    allocateFreeTime("Wednesday",720)
                    break;

                case(3):

                    allocateFreeTime("Thursday",960)
                    break;

                case(4):

                    allocateFreeTime("Friday",1200)
                    break;

                case(5):

                    allocateFreeTime("Saturday",1440)
                    break;

                case(6):

                    allocateFreeTime("Sunday",1680)
                    break;
            }

    }

}

function allocateFreeTime(day,xPos) {

    let ableToBeFilled = false;
    let currHoursOfFreeTime = hoursOfFreeTime
    let freeTimeFilled = 0

    while(ableToBeFilled === false && (hoursOfFreeTime/currHoursOfFreeTime) < 64 && freeTimeFilled < (hoursOfFreeTime*60)) {

        let fillCounter = 0

        for (let i = 0; i < (hoursOfFreeTime/currHoursOfFreeTime); i++) {
                        
            let endTime = addMinutesToTime("00:00",(currHoursOfFreeTime*60))
            let info = getActivityCoordinates('00:00',endTime,day)
            let height = info[2]
            let coords = findATimeSlot(info[0],info[1],info[2])

            if(coords[0] !== -1 && coords[1] !== -1 && coords[0] === xPos && (coords[1] + height < 825))  {

                if((currHoursOfFreeTime + freeTimeFilled) < (hoursOfFreeTime*60)) {

                    postActivityToAPI('Free Time',coords[0],coords[1],height)
                    freeTimeFilled += currHoursOfFreeTime
                    fillCounter++

                } else {

                    freeTimeFilled = hoursOfFreeTime*60
                }

            }

        }

        if(fillCounter === (hoursOfFreeTime/currHoursOfFreeTime)) {

            ableToBeFilled = true
        }
        currHoursOfFreeTime = (currHoursOfFreeTime/2)

    }

}

function addDailyNumLectures(xPos) {

    switch(xPos) {

        case 240:

            lecturesToCatchUpPerDay[0]++
            break

        case 480:

            lecturesToCatchUpPerDay[1]++
            break

        case 720:

            lecturesToCatchUpPerDay[2]++
            break

        case 960:

            lecturesToCatchUpPerDay[3]++
            break

        case 1200:

            lecturesToCatchUpPerDay[4]++
            break

        case 1440:

            lecturesToCatchUpPerDay[5]++
            break

        case 1680:

            lecturesToCatchUpPerDay[6]++
            break
    }

}

async function fillInLecturesToCatchUp() {

    let ableToBeFilled = true
    let lecturesFilled = 0

    while(lecturesBehind > 0 && ableToBeFilled === true) {

        let info = getActivityCoordinates('00:00','00:50','Monday')
        let height = info[2]
        let coords = findATimeSlot(info[0],info[1],info[2])
        addDailyNumLectures(coords[0])

        if(coords[0] !== -1 && coords[1] !== -1) {

            if((coords[1] + height) < 825) {

                postActivityToAPI('Lecture Catch Up',coords[0],coords[1],height)
                lecturesBehind -= 1;
                lecturesFilled++;

            } else {

                let secondElementHeight = height - (825 - coords[1])
                postActivityToAPI('Lecture Catch Up',coords[0],coords[1],(825 - coords[1]))

                if((coords[0] + 240) <= 1680) {

                    postActivityToAPI('Lecture Catch Up',coords[0] + 240,98.25,secondElementHeight)
                    lecturesBehind -= 1;
                    lecturesFilled++;

                } else {

                    postActivityToAPI('Lecture Catch Up',240,98.25,secondElementHeight)
                    lecturesBehind -= 1;
                    lecturesFilled++;

                }

            }

        } else {

            ableToBeFilled = false;

        }

    }

    let daysItWillTake = null
    let day = null
    if(lecturesBehind < initlecturesBehind) {

        ({ daysItWillTake, day } = await getCatchUpDays())

    }
    

    try {

        const response = await fetch(`https:/lecture-cram-planner-v2-0.onrender.com/catch-up-days/${userID}`,{

            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
            },
            body: JSON.stringify({catchUpDays: daysItWillTake, day: day })
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

async function getCatchUpDays() {

    const today = new Date();
    let indexOfTommorow = today.getDay() + 1
    let day = getDayFromIndex(today.getDay())
    if(indexOfTommorow > 6) { 
        
        indexOfTommorow = 0 
    }
    let currLecturesBehind = Number(initlecturesBehind)
    let numCatchUpDays = 0

    while(currLecturesBehind > 0) {

        currLecturesBehind -= lecturesToCatchUpPerDay[indexOfTommorow]
        if(currLecturesBehind > 0) {

            numCatchUpDays++
        }

        indexOfTommorow++

        if(indexOfTommorow > 6) { indexOfTommorow = 0 }

    }
    console.log(numCatchUpDays)
    console.log(day)
    return { numCatchUpDays, day }
 
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
        if(x3 >= 1680) {

            x3 = 240
        }
       
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

        if(!(startX === x && endX === x2 && ((y <= endY && y >= startY) || (y2 <= endY && y2 >= startY) || (y2 > endY && y < startY)))) {

            if(extendsDays === true) {

                if(startX === x3 && endX === x4 && ((y3 <= endY && y3 >= startY) || (y4 <= endY && y4 >= startY) || (y4 > endY && y3 < startY))) {
                    
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

    if(Object.keys(activityData).length > 0) {

        for (let i = 0; i < activityData["activity-name"].length; i++) {

            const activityName = activityData["activity-name"][i]
            let startDay = activityData["activity-start-day"][i]
            const startTime = activityData["activity-start-time"][i]
            const endDay = activityData["activity-end-day"][i]
            const endTime = activityData["activity-end-time"][i]

            if(startDay === endDay || startDay === 'Everyday') {

                // FOR LATER, INCLUDE THE CASE WHERE START TIME IS AFTER END TIME

                if(startDay === 'Everyday') {

                    if(!isOverlapping(startTime,endTime)) {

                        handleEveryDayData(activityName,startTime,endTime,true)
                    } else {


                        handleEveryDayData(activityName,startTime,'24:00',true)
                        handleEveryDayData(activityName,'00:00',endTime,true)
                    }
                    

                } else {

                    if(!isOverlapping(startTime,endTime)) {

                        let info = getActivityCoordinates(startTime,endTime,startDay)
                        postActivityToAPI(activityName,info[0],info[1],info[2])

                    } else {

                        let followingDay = getFollowingDay(startDay)
                        let info = getActivityCoordinates(startTime,'24:00',startDay)
                        postActivityToAPI(activityName,info[0],info[1],info[2])

                        while(followingDay !== startDay) {

                            info = getActivityCoordinates('00:00','24:00',followingDay)
                            postActivityToAPI(activityName,info[0],info[1],info[2])
                            followingDay = getFollowingDay(followingDay)
                        }
                        
                        info = getActivityCoordinates('00:00',endTime,followingDay)
                        postActivityToAPI(activityName,info[0],info[1],info[2])


                    }
                    

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
}

function addMinutesToTime(timeString,minutesToAdd) {

  minutesToAdd = Number(minutesToAdd)
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
        const response = await fetch(`https://lecture-cram-planner-v2-0.onrender.com/activitycoords/${userID}`, {
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

module.exports = { recieveUserID, handleFormData, handleLectureData, handleActivityData, handleMissedLectureData }
