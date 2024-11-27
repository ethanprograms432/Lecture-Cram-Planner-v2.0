
const activityCoords = {

    activities: []
}

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function handleFormData(formData) {

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

        let endTime = addMinutesToTime(formData["dinner-time"],20)
        handleEveryDayData('Dinner',formData["dinner-time"],endTime,true)
        
    }

}

function handleLectureData(lectureData) {

    for (let i = 0; i < lectureData["lecture-name"].length; i++) {

        let endTime = addMinutesToTime(lectureData["lecture-start-time"][i],50)

        if(lectureData["lecture-day"][i] === "Everyday") {
    
            handleEveryDayData(lectureData["lecture-name"][i],lectureData["lecture-start-time"][i],endTime,false)

        } else {

            let xPos,yPos,height = getActivityCoordinates(lectureData["lecture-start-time"][i],endTime,lectureData["lecture-day"][i])
            postActivityToAPI(lectureData["lecture-name"][i],xPos,yPos,height)

        }

    }

}

function handleMissedLectureData(missedLectureData) {

    for (let i = 0; i < missedLectureData["missed-lecture-name"].length; i++) {

        let endTime = addMinutesToTime(missedLectureData["missed-lecture-start-time"][i],50)

        if(missedLectureData["missed-lecture-day"][i] === "Everyday") {
    
            handleEveryDayData(missedLectureData["missed-lecture-name"][i],missedLectureData["missed-lecture-start-time"][i],endTime,false)

        } else {

            let xPos,yPos,height = getActivityCoordinates(missedLectureData["missed-lecture-start-time"][i],endTime,missedLectureData["missed-lecture-day"][i])
            postActivityToAPI(missedLectureData["missed-lecture-name"][i],xPos,yPos,height)

        }

    }

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

                let xPos,yPos,height = getActivityCoordinates(startTime,endTime,startDay)
                postActivityToAPI(activityName,xPos,yPos,height)

            }

        } else {

            let xPos,yPos,height = getActivityCoordinates(startTime,'24:00',startDay)
            postActivityToAPI(activityName,xPos,yPos,height)

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
                    xPos,yPos,height = getActivityCoordinates('00:00','24:00',startDay)
                    postActivityToAPI(activityName,xPos,yPos,height)
                } else {

                    startDay = days[0]
                    xPos,yPos,height = getActivityCoordinates('00:00','24:00',startDay)
                    postActivityToAPI(activityName,xPos,yPos,height)
                    currIndex = 0

                }
                currIndex++;

            }

            xPos,yPos,height = getActivityCoordinates('00:00',endTime,endDay)
            postActivityToAPI(activityName,xPos,yPos,height)

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

    let xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Monday')
    postActivityToAPI(activityName,xPos,yPos,height)
    xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Tuesday')
    postActivityToAPI(activityName,xPos,yPos,height)
    xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Wednesday')
    postActivityToAPI(activityName,xPos,yPos,height)
    xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Thursday')
    postActivityToAPI(activityName,xPos,yPos,height)
    xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Friday')
    postActivityToAPI(activityName,xPos,yPos,height)

    if(weekend === true) {

        xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Saturday')
        postActivityToAPI(activityName,xPos,yPos,height)
        xPos,yPos,height = getActivityCoordinates(startTime,endTime,'Sunday')
        postActivityToAPI(activityName,xPos,yPos,height)

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

    return { xPos, yPos, height }
}

async function postActivityToAPI(activityName,xPos,yPos,elementHeight) {

    let newActivityInfo = {

        name: activityName,
        xPosition: xPos,
        yPosition: yPos,
        properties: elementHeight

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
