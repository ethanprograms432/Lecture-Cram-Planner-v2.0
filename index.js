const titleElements = document.getElementsByClassName('main');
const formElementsOne = document.getElementsByClassName('questions1');
const formElementsTwo = document.getElementsByClassName('questions2')

const lectures = document.getElementById('added-lecture-form')
const activities = document.getElementById('activity-form')
const missedLectures = document.getElementById('missed-lecture-form')

const startButton = document.getElementById('startbutton');
const backButton = document.getElementById('previous-page-button');
const confirmButton = document.getElementById('next-page-button');
const addLectureButton = document.getElementById('add-lecture-button')
const addActivityButton = document.getElementById('add-activity-button')
const addMissedLectureButton = document.getElementById('add-missed-lecture-button')

const questionsTitle = document.getElementById('form-title')

let pageNumber = 0; // Track the current page
let addedLectureNum = 0; // Tracks how many lectures have been added
let addedActivityNum = 0; // Tracks how many activities have been added
let addedMissedLectureNum = 0; // Tracks how many missed lectures have been added
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

            Array.from(formElementsTwo).forEach(element => {

                element.style.display = 'none';

            })
            pageNumber = 3;
            break;
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
    newLectureInput.appendChild(nameInput)

    const startTimeInput = document.createElement('input')
    startTimeInput.type = 'time'
    startTimeInput.placeholder = 'Start Time'
    startTimeInput.setAttribute('name','lecture-start-time')
    startTimeInput.id = 'lecture-start-time'
    newLectureInput.appendChild(startTimeInput)

    /* LECTURE DAY */

    const lectureDay = document.createElement('label')

    // Create the select element
    const select2 = document.createElement('select');
    select2.setAttribute('name', 'lecture-day');
    select2.setAttribute('id', 'lecture-day');

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


    newLectureInput.appendChild(lectureDay)
    newLectureInput.appendChild(select2)

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
    nameInput.id = 'activity-name'
    newActivityInput.appendChild(nameInput)

    /* START DAY */

    const newActivityStartDay = document.createElement('label')
    newActivityStartDay.setAttribute('for','activity-start-day')

    const selectStartDay = document.createElement('select')
    selectStartDay.setAttribute('name','activity-start-day')
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
    startTimeInput.setAttribute('name','activity-start-time')
    startTimeInput.id = 'activity-start-time'
    newActivityInput.appendChild(startTimeInput)

    /* END DAY */

    const newActivityEndDay = document.createElement('label')
    newActivityEndDay.setAttribute('for','activity-end-day')

    const selectEndDay = document.createElement('select')
    selectEndDay.setAttribute('name','activity-end-day')
    selectEndDay.setAttribute('id','activity-end-day')

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

    const everyday2 = document.createElement('option');
    everyday2.setAttribute('value', 'Everyday');
    everyday2.textContent = 'Everyday';

    selectEndDay.appendChild(monday2);
    selectEndDay.appendChild(tuesday2);
    selectEndDay.appendChild(wednesday2);
    selectEndDay.appendChild(thursday2);
    selectEndDay.appendChild(friday2);
    selectEndDay.appendChild(everyday2);

    newActivityInput.appendChild(newActivityEndDay)
    newActivityInput.appendChild(selectEndDay)

    /* END TIME */

    const newActivityEndTime = document.createElement('label')
    newActivityEndTime.setAttribute('for','activity-end-time')
    newActivityInput.appendChild(newActivityStartTime)

    const endTimeInput = document.createElement('input')
    endTimeInput.type = 'time'
    endTimeInput.placeholder = 'End Time'
    endTimeInput.setAttribute('name','activity-end-time')
    endTimeInput.id = 'activity-end-time'
    newActivityInput.appendChild(endTimeInput)


})

addMissedLectureButton.addEventListener('click', () => {

    addedMissedLectureNum++;

    // Creates a new row for a lectures information to be entered
    const newLectureInput = document.createElement('div')
    missedLectures.prepend(newLectureInput)
    newLectureInput.className = "added-missed-lecture"
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
    nameInput.setAttribute('name','missed-lecture-name')
    nameInput.id = 'missed-lecture-name'
    newLectureInput.appendChild(nameInput)

    const startTimeInput = document.createElement('input')
    startTimeInput.type = 'time'
    startTimeInput.placeholder = 'Start Time'
    startTimeInput.setAttribute('name','missed-lecture-start-time')
    startTimeInput.id = 'missed-lecture-start-time'
    newLectureInput.appendChild(startTimeInput)

    /* LECTURE DAY */

    const lectureDay = document.createElement('label')

    // Create the select element
    const select2 = document.createElement('select');
    select2.setAttribute('name', 'missed-lecture-day');
    select2.setAttribute('id', 'missed-lecture-day');

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


    newLectureInput.appendChild(lectureDay)
    newLectureInput.appendChild(select2)


});