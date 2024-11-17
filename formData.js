
document.getElementById('first-form').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
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
          alert('Form submitted successfully: ' + JSON.stringify(result));
        } else {
          const result = await response.text();
          alert('Form submitted successfully: ' + result);
        }
      } else {
        const errorText = await response.text();
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });

  document.getElementById('added-lecture-form').addEventListener('submit', async function (event) {
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
          alert('Form submitted successfully: ' + JSON.stringify(result));
        } else {
          const result = await response.text();
          alert('Form submitted successfully: ' + result);
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
          alert('Form submitted successfully: ' + JSON.stringify(result));
        } else {
          const result = await response.text();
          alert('Form submitted successfully: ' + result);
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
          alert('Form submitted successfully: ' + JSON.stringify(result));
        } else {
          const result = await response.text();
          alert('Form submitted successfully: ' + result);
        }
      } else {
        const errorText = await response.text();
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });
