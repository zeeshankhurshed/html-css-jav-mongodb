// Input fields data
const inputs = [
  { label: "Name", type: "text", placeholder: "Enter your name", value: "name" },
  { label: "Email", type: "email", placeholder: "Enter your email", value: "email" },
  { label: "Password", type: "password", placeholder: "Enter your password", value: "password" }
];

const form = document.getElementById("registerForm");

// Render inputs dynamically
inputs.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("form-item");

  div.innerHTML = `
    <label>${item.label}</label>
    <input type="${item.type}" name="${item.value}" placeholder="${item.placeholder}" required />
  `;

  form.appendChild(div);
});

// Add submit button at end
const button = document.createElement("button");
button.type = "submit";
button.textContent = "Submit";
form.appendChild(button);

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload

  // Get input values
  const formData = {};
  let isValid = true;
  
  inputs.forEach(item => {
    const input = form.elements[item.value];
    formData[item.value] = input.value;
    
    // Basic validation
    if (!input.value.trim()) {
      isValid = false;
      showMessage(`Please fill in the ${item.label} field`, 'error');
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  });

  if (!isValid) return;

  console.log("Form Values:", formData);

  // Show loading state
  const originalText = button.textContent;
  button.textContent = "Registering...";
  button.disabled = true;

  try {
    // Send data to backend
    const response = await fetch("http://localhost:5555/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    // Check for various possible success indicators
    if (data.success || data.message?.toLowerCase().includes('success') || data.id) {
      showMessage("Registration successful! Redirecting to login...", 'success');
      
      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
    } else {
      throw new Error(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Error:", err);
    showMessage(err.message || "Something went wrong during registration", 'error');
  } finally {
    // Reset button state
    button.textContent = originalText;
    button.disabled = false;
  }
});

// Function to show message to user
function showMessage(text, type) {
  // Create message element if it doesn't exist
  let messageEl = document.getElementById('form-message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'form-message';
    messageEl.style.padding = '10px';
    messageEl.style.marginTop = '15px';
    messageEl.style.borderRadius = '5px';
    messageEl.style.textAlign = 'center';
    form.appendChild(messageEl);
  }
  
  // Set message content and style
  messageEl.textContent = text;
  messageEl.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
  messageEl.style.color = type === 'success' ? '#155724' : '#721c24';
  messageEl.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  messageEl.style.display = 'block';
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}