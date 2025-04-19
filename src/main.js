// src/main.js

document.addEventListener('DOMContentLoaded', () => {
  const checkinForm = document.getElementById('checkin-form');
  const registerForm = document.getElementById('register-form');

  if (checkinForm) {
    checkinForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message');

      if (!phone) {
        message.textContent = 'Please enter your phone number.';
        return;
      }

      try {
        const response = await fakeCheckIn(phone);

        if (response.success) {
          // Store user's name in localStorage (just for demonstration)
          localStorage.setItem('userName', response.name);
          window.location.href = 'thankyou.html';
        } else {
          message.textContent = response.message;
        }
      } catch (error) {
        message.textContent = 'An error occurred. Please try again.';
        console.error(error);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message');

      if (!name || !phone) {
        message.textContent = 'Please fill out all fields.';
        return;
      }

      try {
        const response = await fakeRegister(name, phone);

        if (response.success) {
          window.location.href = 'index.html';
        } else {
          message.textContent = response.message;
        }
      } catch (error) {
        message.textContent = 'An error occurred. Please try again.';
        console.error(error);
      }
    });
  }
});

// Simulated check-in logic — to be replaced with real backend calls
async function fakeCheckIn(phone) {
  const users = {
    '3035551234': 'Test One',
    '7205554567': 'Test Two',
    '3035557890': 'Test Three'
  };

  if (!users[phone]) {
    return { success: false, message: 'Phone number not found. Please register first.' };
  }

  const name = users[phone];
  const today = new Date();
  const lastVisit = new Date();
  lastVisit.setDate(today.getDate() - 10); // simulate last visit 10 days ago

  const daysSinceLastVisit = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
  if (daysSinceLastVisit >= 7) {
    return { success: true, name: name };
  } else {
    return {
      success: false,
      message: `You may return in ${7 - daysSinceLastVisit} day(s).`
    };
  }
}

// Simulated registration logic — to be replaced with real backend calls
async function fakeRegister(name, phone) {
  const testPhones = ['3035551234', '7205554567', '3035557890'];
  if (testPhones.includes(phone)) {
    return { success: false, message: 'Phone number already exists.' };
  }
  return { success: true };
}
