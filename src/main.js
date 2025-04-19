// main.js

// Helper function to show messages
function showMessage(type, text) {
  const messageDiv = document.getElementById("message");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  messageDiv.style.display = "block";
}

// Event listener for registration
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();

  if (!name || !phone) {
    showMessage("error", "Please enter both name and phone number.");
    return;
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone })
    });

    const result = await response.json();

    if (response.ok) {
      showMessage("success", result.message || "Registration successful!");
      document.getElementById("registerForm").reset();
    } else {
      showMessage("error", result.error || "Registration failed.");
    }
  } catch (error) {
    showMessage("error", "An error occurred. Please try again later.");
  }
});

// Event listener for check-in
document.getElementById("checkinForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const phone = document.getElementById("checkinPhone").value.trim();

  if (!phone) {
    showMessage("error", "Please enter your phone number.");
    return;
  }

  try {
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone })
    });

    const result = await response.json();

    if (response.ok) {
      showMessage("success", result.message || "Check-in successful!");
      document.getElementById("checkinForm").reset();
    } else {
      showMessage("error", result.error || "Check-in denied.");
    }
  } catch (error) {
    showMessage("error", "An error occurred. Please try again later.");
  }
});
