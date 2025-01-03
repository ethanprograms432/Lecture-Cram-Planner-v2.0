const titleElements = document.getElementsByClassName('main');
const formElementsOne = document.getElementsByClassName('questions1');
const formElementsTwo = document.getElementsByClassName('questions2')
const diagramElements = document.getElementsByClassName('diagram')

const lectures = document.getElementById('added-lecture-form')
const activities = document.getElementById('activity-form')
const missedLectures = document.getElementById('missed-lecture-form')

const startButton = document.getElementById('startbutton');
const backButton = document.getElementById('previous-page-button');
const confirmButton = document.getElementById('next-page-button');
const addLectureButton = document.getElementById('add-lecture-button')
const addActivityButton = document.getElementById('add-activity-button')
const addMissedLectureButton = document.getElementById('add-missed-lecture-button')

let activityCoordInfo = {}

const questionsTitle = document.getElementById('form-title')

let pageNumber = 0; // Track the current page
let addedLectureNum = 0; // Tracks how many lectures have been added
let addedActivityNum = 0; // Tracks how many activities have been added
let addedMissedLectureNum = 0; // Tracks how many missed lectures have been added
let formsSubmitted = 0
// Start button logic
startButton.addEventListener('click', () => {
    Array.from(titleElements).forEach(element => {
        element.style.display = "none";  // Hide title elements
    });

    Array.from(formElementsOne).forEach(element => {
        element.style.display = "block";  // Show form elements
    });

    questionsTitle.style.display = 'block'
    backButton.style.display = 'block'
    confirmButton.style.display = 'block'

    pageNumber = 1;  // Set page number to 1 when moving to form
    // DIMENSIONS 1680x709 of activities
    // START TOP: 202px
    // START LEFT: 240px
});

// Confirm button logic
confirmButton.addEventListener('click', () => {
    switch (pageNumber) {
        case 1:
            Array.from(formElementsOne).forEach(element => {
                element.style.display = "none";  // Hide form elements
            });

            Array.from(formElementsTwo).forEach(element => {

                element.style.display = 'block'

            })
            
            // You can add additional logic here to show the next step or finalize
            pageNumber = 2;  // Move to the next page
            break;
        
        case 2:

            if(formsSubmitted < 4) {

                alert("Please fill out all forms before proceeding!")
            } else {

                Array.from(formElementsTwo).forEach(element => {

                    element.style.display = 'none';
    
                })
                questionsTitle.style.display = 'none';
    
                Array.from(diagramElements).forEach(element => {
    
                    element.style.display = 'block';
    
                })
                setUpTimeTableSlots();
                generateActivityInfoFromAPI();
                pageNumber = 3;
                break;
            }
            
        // You can add more cases if you have other pages to handle
    }
});

// Back button logic
backButton.addEventListener('click', () => {
    switch (pageNumber) {
        case 1:
            Array.from(titleElements).forEach(element => {
                element.style.display = "block";  // Show title elements
            });

            Array.from(formElementsOne).forEach(element => {
                element.style.display = "none";  // Hide form elements
            });

            backButton.style.display = 'none';
            confirmButton.style.display = 'none';
            questionsTitle.style.display = 'none'
            pageNumber = 0;  // Return to the title page
            break;

        case 2:

            Array.from(formElementsOne).forEach(element => {

                element.style.display = 'block';

            });

            Array.from(formElementsTwo).forEach(element => {


                element.style.display = 'none'
            })
            pageNumber = 1;
            break;

        case 3:

            Array.from(formElementsTwo).forEach(element => {


                element.style.display = 'block'
            })
            pageNumber = 2;
            questionsTitle.style.display = 'block';

            Array.from(diagramElements).forEach(element => {


                element.style.display = 'none';
            })
            break;
        // Handle other cases if necessary
    }
});

addLectureButton.addEventListener('click', () => {

    addedLectureNum++;

    // Creates a new row for a lectures information to be entered
    const newLectureInput = document.createElement('div')
    lectures.prepend(newLectureInput)
    newLectureInput.className = "added-lecture"
    newLectureInput.style.marginLeft = "80px";
    newLectureInput.id = "lecture" + addedLectureNum

    // DOM elements representing lecture content information
    const newLectureName = document.createElement('label')
    newLectureName.setAttribute('for','lecture-name')
    newLectureInput.appendChild(newLectureName)

    const newLectureStartTime = document.createElement('label')
    newLectureStartTime.setAttribute('for','lecture-start-time')
    newLectureInput.appendChild(newLectureStartTime)

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Lecture Name'
    nameInput.setAttribute('name','lecture-name')
    nameInput.id = 'lecture-name'
    nameInput.required = true;
    nameInput.style.width = "100px";
    newLectureInput.appendChild(nameInput)

    const startTimeInput = document.createElement('input')
    startTimeInput.type = 'time'
    startTimeInput.placeholder = 'Start Time'
    startTimeInput.setAttribute('name','lecture-start-time')
    startTimeInput.id = 'lecture-start-time'
    startTimeInput.required = true;
    startTimeInput.style.width = "100px";
    newLectureInput.appendChild(startTimeInput)

    /* LECTURE DAY */

    const lectureDay = document.createElement('label')

    // Create the select element
    const select2 = document.createElement('select');
    select2.setAttribute('name', 'lecture-day');
    select2.setAttribute('id', 'lecture-day');
    select2.style.width = "100px";
    select2.required = true;

    // Create the option elements
    const monday = document.createElement('option');
    monday.setAttribute('value', 'Monday');
    monday.textContent = 'Monday';

    const tuesday = document.createElement('option');
    tuesday .setAttribute('value', 'Tuesday');
    tuesday .textContent = 'Tuesday ';

    const wednesday = document.createElement('option');
    wednesday.setAttribute('value', 'Wednesday');
    wednesday.textContent = 'Wednesday';

    const thursday = document.createElement('option');
    thursday.setAttribute('value', 'Thursday');
    thursday.textContent = 'Thursday';

    const friday = document.createElement('option');
    friday.setAttribute('value', 'Friday');
    friday.textContent = 'Friday';

    const everyday = document.createElement('option');
    everyday.setAttribute('value', 'Everyday');
    everyday.textContent = 'Everyday';


    // Append the options to the select element
    select2.appendChild(monday);
    select2.appendChild(tuesday);
    select2.appendChild(wednesday);
    select2.appendChild(thursday);
    select2.appendChild(friday);
    select2.appendChild(everyday);

    document.getElementById('lectures-submit-button').style.marginTop = "3px";

    const removeLecture = document.createElement('button')
    removeLecture.style.backgroundColor = 'red';
    removeLecture.style.color = 'white';
    removeLecture.innerText = 'Delete';
    removeLecture.onclick = function() {

      newLectureInput.remove()
    }

    newLectureInput.appendChild(lectureDay)
    newLectureInput.appendChild(select2)
    newLectureInput.appendChild(removeLecture)

})

addActivityButton.addEventListener('click', () => {

    addedActivityNum++;

    const newActivityInput = document.createElement('div')

    activities.prepend(newActivityInput)
    newActivityInput.className = "added-activity"
    newActivityInput.id = "activity" + addedActivityNum

    /* NAME */

    const newActivityName = document.createElement('label')
    newActivityName.setAttribute('for','lecture-name')
    newActivityInput.appendChild(newActivityName)

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Activity Name'
    nameInput.setAttribute('name','activity-name')
    nameInput.required = true;
    nameInput.id = 'activity-name'
    newActivityInput.appendChild(nameInput)

    /* START DAY */

    const newActivityStartDay = document.createElement('label')
    newActivityStartDay.setAttribute('for','activity-start-day')

    const selectStartDay = document.createElement('select')
    selectStartDay.setAttribute('name','activity-start-day')
    selectStartDay.required = true;
    selectStartDay.setAttribute('id','activity-start-day')

    const monday = document.createElement('option');
    monday.setAttribute('value', 'Monday');
    monday.textContent = 'Monday';

    const tuesday = document.createElement('option');
    tuesday .setAttribute('value', 'Tuesday');
    tuesday .textContent = 'Tuesday ';

    const wednesday = document.createElement('option');
    wednesday.setAttribute('value', 'Wednesday');
    wednesday.textContent = 'Wednesday';

    const thursday = document.createElement('option');
    thursday.setAttribute('value', 'Thursday');
    thursday.textContent = 'Thursday';

    const friday = document.createElement('option');
    friday.setAttribute('value', 'Friday');
    friday.textContent = 'Friday';

    const saturday = document.createElement('option');
    saturday.setAttribute('value', 'Saturday');
    saturday.textContent = 'Saturday';

    const sunday = document.createElement('option');
    sunday.setAttribute('value', 'Sunday');
    sunday.textContent = 'Sunday';

    const everyday = document.createElement('option');
    everyday.setAttribute('value', 'Everyday');
    everyday.textContent = 'Everyday';

    selectStartDay.appendChild(monday);
    selectStartDay.appendChild(tuesday);
    selectStartDay.appendChild(wednesday);
    selectStartDay.appendChild(thursday);
    selectStartDay.appendChild(friday);
    selectStartDay.appendChild(saturday);
    selectStartDay.appendChild(sunday);
    selectStartDay.appendChild(everyday);

    newActivityInput.appendChild(selectStartDay)
    newActivityInput.appendChild(newActivityStartDay)

    /* START TIME */

    const newActivityStartTime = document.createElement('label')
    newActivityStartTime.setAttribute('for','activity-start-time')
    newActivityInput.appendChild(newActivityStartTime)

    const startTimeInput = document.createElement('input')
    startTimeInput.type = 'time'
    startTimeInput.placeholder = 'Start Time'
    startTimeInput.required = true;
    startTimeInput.setAttribute('name','activity-start-time')
    startTimeInput.id = 'activity-start-time'
    newActivityInput.appendChild(startTimeInput)

    /* END DAY */

    const newActivityEndDay = document.createElement('label')
    newActivityEndDay.setAttribute('for','activity-end-day')

    const selectEndDay = document.createElement('select')
    selectEndDay.setAttribute('name','activity-end-day')
    selectEndDay.setAttribute('id','activity-end-day')
    selectEndDay.required = true;

    const monday2 = document.createElement('option');
    monday2.setAttribute('value', 'Monday');
    monday2.textContent = 'Monday';

    const tuesday2 = document.createElement('option');
    tuesday2 .setAttribute('value', 'Tuesday');
    tuesday2 .textContent = 'Tuesday ';

    const wednesday2 = document.createElement('option');
    wednesday2.setAttribute('value', 'Wednesday');
    wednesday2.textContent = 'Wednesday';

    const thursday2 = document.createElement('option');
    thursday2.setAttribute('value', 'Thursday');
    thursday2.textContent = 'Thursday';

    const friday2 = document.createElement('option');
    friday2.setAttribute('value', 'Friday');
    friday2.textContent = 'Friday';

    const saturday2 = document.createElement('option');
    saturday2.setAttribute('value', 'Saturday');
    saturday2.textContent = 'Saturday';

    const sunday2 = document.createElement('option');
    sunday2.setAttribute('value', 'Sunday');
    sunday2.textContent = 'Sunday';

    const everyday2 = document.createElement('option');
    everyday2.setAttribute('value', 'Everyday');
    everyday2.textContent = 'Everyday';

    selectEndDay.appendChild(monday2);
    selectEndDay.appendChild(tuesday2);
    selectEndDay.appendChild(wednesday2);
    selectEndDay.appendChild(thursday2);
    selectEndDay.appendChild(friday2);
    selectEndDay.appendChild(saturday2);
    selectEndDay.appendChild(sunday2)
    selectEndDay.appendChild(everyday2);

    newActivityInput.appendChild(newActivityEndDay)
    newActivityInput.appendChild(selectEndDay)

    /* END TIME */

    const newActivityEndTime = document.createElement('label')
    newActivityEndTime.setAttribute('for','activity-end-time')
    newActivityInput.appendChild(newActivityStartTime)

    const endTimeInput = document.createElement('input')
    endTimeInput.required = true;
    endTimeInput.type = 'time'
    endTimeInput.placeholder = 'End Time'
    endTimeInput.setAttribute('name','activity-end-time')
    endTimeInput.id = 'activity-end-time'
    newActivityInput.appendChild(endTimeInput)

    const removeActivity = document.createElement('button')
    removeActivity.style.backgroundColor = 'red';
    removeActivity.style.color = 'white';
    removeActivity.innerText = 'Delete';
    removeActivity.onclick = function() {

      newActivityInput.remove()

    }

    newActivityInput.appendChild(removeActivity);


})

addMissedLectureButton.addEventListener('click', () => {

    addedMissedLectureNum++;

    // Creates a new row for a lectures information to be entered
    const newLectureInput = document.createElement('div')
    missedLectures.prepend(newLectureInput)
    newLectureInput.className = "added-missed-lecture"
    newLectureInput.style.marginLeft = "-80px";
    newLectureInput.id = "missed-lecture" + addedMissedLectureNum

    // DOM elements representing lecture content information
    const newLectureName = document.createElement('label')
    newLectureName.setAttribute('for','missed-lecture-name')
    newLectureInput.appendChild(newLectureName)

    const newLectureStartTime = document.createElement('label')
    newLectureName.setAttribute('for','missed-lecture-start-time')
    newLectureInput.appendChild(newLectureStartTime)

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Lecture Name'
    nameInput.required = true;
    nameInput.setAttribute('name','missed-lecture-name')
    nameInput.id = 'missed-lecture-name'
    newLectureInput.appendChild(nameInput)

    const startTimeInput = document.createElement('input')
    startTimeInput.type = 'time'
    startTimeInput.placeholder = 'Start Time'
    startTimeInput.required = true;
    startTimeInput.setAttribute('name','missed-lecture-start-time')
    startTimeInput.id = 'missed-lecture-start-time'
    newLectureInput.appendChild(startTimeInput)

    /* LECTURE DAY */

    const lectureDay = document.createElement('label')

    // Create the select element
    const select2 = document.createElement('select');
    select2.setAttribute('name', 'missed-lecture-day');
    select2.setAttribute('id', 'missed-lecture-day');
    select2.required = true;

    // Create the option elements
    const monday = document.createElement('option');
    monday.setAttribute('value', 'Monday');
    monday.textContent = 'Monday';

    const tuesday = document.createElement('option');
    tuesday .setAttribute('value', 'Tuesday');
    tuesday .textContent = 'Tuesday ';

    const wednesday = document.createElement('option');
    wednesday.setAttribute('value', 'Wednesday');
    wednesday.textContent = 'Wednesday';

    const thursday = document.createElement('option');
    thursday.setAttribute('value', 'Thursday');
    thursday.textContent = 'Thursday';

    const friday = document.createElement('option');
    friday.setAttribute('value', 'Friday');
    friday.textContent = 'Friday';

    const everyday = document.createElement('option');
    everyday.setAttribute('value', 'Everyday');
    everyday.textContent = 'Everyday';


    // Append the options to the select element
    select2.appendChild(monday);
    select2.appendChild(tuesday);
    select2.appendChild(wednesday);
    select2.appendChild(thursday);
    select2.appendChild(friday);
    select2.appendChild(everyday);

    const removeMissedLecture = document.createElement('button')
    removeMissedLecture.style.backgroundColor = 'red';
    removeMissedLecture.style.color = 'white';
    removeMissedLecture.innerText = 'Delete';

    removeMissedLecture.onclick = function() {

      newLectureInput.remove()
    }
    newLectureInput.appendChild(lectureDay)
    newLectureInput.appendChild(select2)
    newLectureInput.appendChild(removeMissedLecture)


});

function setUpTimeTableSlots()
{

    const mondaySlots = document.getElementById("monday-section")
    const tuesdaySlots = document.getElementById("tuesday-section")
    const wednesdaySlots = document.getElementById("wednesday-section")
    const thursdaySlots = document.getElementById("thursday-section")
    const fridaySlots = document.getElementById("friday-section")
    const saturdaySlots = document.getElementById("saturday-section")
    const sundaySlots = document.getElementById("sunday-section")

    let currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "240px"
        newSlot.style.top = `${currY}px`
        mondaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "480px";
        newSlot.style.top = `${currY}px`
        tuesdaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "720px";
        newSlot.style.top = `${currY}px`
        wednesdaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "960px";
        newSlot.style.top = `${currY}px`
        thursdaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "1200px";
        newSlot.style.top = `${currY}px`
        fridaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "1440px";
        newSlot.style.top = `${currY}px`
        saturdaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

    currY = 100.25
    for (let i = 0; i < 24; i++) {

        const newSlot = document.createElement("div")
        newSlot.style.left = "1680px";
        newSlot.style.top = `${currY}px`
        sundaySlots.appendChild(newSlot)
        currY = currY + 30.25

    }

}

document.getElementById('first-form').addEventListener('submit', async function (event) {

    formsSubmitted += 1
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    if(data["breakfast-preference"] === "Yes" && data["breakfast-time"] === "") {

      alert("A time must be entered if you have breakfast!")
    } else if(data["lunch-preference"] === "Yes" && data["lunch-time"] === "") {

      alert("A time must be entered if you have lunch!")
    } else if(data["dinner-preference"] === "Yes" && data["dinner-time"] === "") {

      alert("A time must be entered if you have dinner!")
    } else {

      try {
        const response = await fetch('http://localhost:3000/formquestions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
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
          alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }

    }
  
    
  });

  document.getElementById('added-lecture-form').addEventListener('submit', async function (event) {
    formsSubmitted += 1
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = {}

    formData.forEach((value,key) => {

        if (!data[key]) {
        data[key] = [];
        }
        data[key].push(value);

    })
  
    try {
      const response = await fetch('http://localhost:3000/lectures/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });

  document.getElementById('activity-form').addEventListener('submit', async function (event) {
    formsSubmitted += 1
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = {}

    formData.forEach((value,key) => {

        if (!data[key]) {
        data[key] = [];
        }
        data[key].push(value);

    })
  
    try {
      const response = await fetch('http://localhost:3000/activities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });

  document.getElementById('missed-lecture-form').addEventListener('submit', async function (event) {
    formsSubmitted += 1
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = {}

    formData.forEach((value,key) => {

        if (!data[key]) {
        data[key] = [];
        }
        data[key].push(value);

    })
  
    try {
      const response = await fetch('http://localhost:3000/missed-lectures/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });

async function generateActivityInfoFromAPI() {

  try {

    const response = await fetch('http://localhost:3000/activitycoords/')

    const contentType = response.headers.get('Content-Type') || '';
  
      if (response.ok) {
        if (contentType.includes('application/json')) {
          activityCoordInfo = await response.json();
          //alert('Data retrieved successfully: ' + JSON.stringify(activityCoordInfo));
        } else {
          activityCoordInfo = await response.text();
          //alert('Data retrieved successfully: ' + activityCoordInfo);
        }
        putActivitiesOntoDiagram()
      } else {
        const errorText = await response.text();
        //alert(`Error retrieving from form: ${response.status} ${response.statusText}\n${errorText}`);
      }
  } catch(error) {

    alert('An error occurred ' + error.message)

  }

}

function stringToRgb(str) {

  // Hash the string to a number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Map the hash to RGB values (ensure they're within 0-255)
  const r = Math.abs(hash) % 256;
  const g = Math.abs((hash >> 8) % 256);
  const b = Math.abs((hash >> 16) % 256);

  return `rgb(${r}, ${g}, ${b})`;

}

function putActivitiesOntoDiagram() {

  activityCoordInfo["activities"].forEach(activity => {

    const name = activity["name"]
    const xPos = activity["xPosition"]
    const yPos = activity["yPosition"]
    const height = activity["height"]


    const newActivity = document.createElement('div')
    newActivity.style.position = 'absolute'
    newActivity.style.left = `${xPos}px`
    newActivity.style.top = `${yPos}px`
    newActivity.style.width = '240px'
    newActivity.style.height = `${height}px`
    newActivity.innerText = `${name}`
    newActivity.style.display = 'block'

    newActivity.addEventListener('click',() => {

      const activityInfo = document.createElement('div')
      document.getElementById('added-activity-section').appendChild(activityInfo)
      activityInfo.setAttribute('class','activity-info')

      activityInfo.innerText = name

      const day = document.createElement("p")
      day.innerText = "Day: " + dayFromXPos(xPos)
      const startTime = document.createElement("p")
      startTime.innerText = "Start Time: " + timeFromYPos(yPos)
      const endTime = document.createElement("p")
      endTime.innerText = "End Time: " + timeFromYPos(yPos + height)
      const closeButton = document.createElement("button")
      closeButton.innerText = 'Close'
      closeButton.style.backgroundColor = 'red'
      closeButton.style.color = 'white'

      closeButton.addEventListener('click',() => {

        activityInfo.style.display = 'none'

      })

      activityInfo.appendChild(day)
      activityInfo.appendChild(startTime)
      activityInfo.appendChild(endTime)
      activityInfo.appendChild(closeButton)

      
      


    })

    if(height < 15) {

      newActivity.style.fontSize = "11px";
    } else if(height < 10) {

      newActivity.style.fontSize = "0px";
    }

    newActivity.style.backgroundColor = stringToRgb(name)

    document.getElementById('added-activity-section').appendChild(newActivity)

  })
  putCatchUpDaysOntoDiagram()

}

function dayFromXPos(xPos) {

  switch(xPos) {

    case 240:

      return "Monday"
      break;

    case 480:

      return "Tuesday"
      break;

    case 720:

      return "Wednesday"
      break;

    case 960:

      return "Thursday"
      break;

    case 1200:

      return "Friday"
      break;

    case 1440:

      return "Saturday"
      break;

    case 1680:

      return "Sunday"
      break;
  }

}

function timeFromYPos(yPos) {

  let minutes = Math.floor(1440*((yPos - 98.25)/726))

  return minutesToTime(minutes)

  //const yPos = 98.25 + (((60*hours1)+minutes1)/1440)*726
}

function minutesToTime(minutes) {
  // Ensure minutes is within a valid range (e.g., handling overflow)
  const totalMinutes = minutes % (24 * 60);
  
  // Calculate hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // Format hours and minutes as two-digit strings
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(mins).padStart(2, '0');

  // Combine hours and minutes
  return `${formattedHours}:${formattedMinutes}`;
}

async function putCatchUpDaysOntoDiagram() {

  let result = {}
  try {

    const response = await fetch('http://localhost:3000/catch-up-days/')

    const contentType = response.headers.get('Content-Type') || '';
  
    if (response.ok) {
        if (contentType.includes('application/json')) {
            result = await response.json();

        } else {
            result = await response.text();

        }
   } else {
      
        const errorText = await response.text();

   }

  } catch(error) {

    console.log(error.message)
  }

  if(result["catchUpDays"] > 7) {
    
    document.getElementById('time-to-catch-up').innerText = 'Time to Catch Up: ' + result["catchUpDays"] + ' days.'

  } else {

    document.getElementById('time-to-catch-up').innerText = "You'll be caught up in under a week!"
  }

}