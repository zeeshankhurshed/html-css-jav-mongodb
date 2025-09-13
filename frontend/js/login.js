const inputs = [
  { label: "Email", type: "text", placeholder: "Enter your email", value: "email" },
  { label: "Password", type: "password", placeholder: "Enter your password", value: "password" }
];

const form = document.getElementById("loginForm");

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

// Add submit button
const button = document.createElement("button");
button.type = "submit";
button.textContent = "Login";
form.appendChild(button);

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get input values
  const formData = {};
  let isValid = true;

  inputs.forEach(item => {
    const input = form.elements[item.value];
    formData[item.value] = input.value;

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

  const originalText = button.textContent;
  button.textContent = "Logging in...";
  button.disabled = true;

  try {
    const response = await fetch("http://localhost:5555/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      // credentials: "include"  // 👈 send cookie
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    if (data.userInfo) {
      // Save user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.userInfo));
      
      showMessage("Login successful! Redirecting...", 'success');
      setTimeout(() => {
        window.location.href = "./home.html";
      }, 1500);
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Error:", err);
    showMessage(err.message || "Login failed. Please try again.", 'error');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
});

function showMessage(text, type) {
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

  messageEl.textContent = text;
  messageEl.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
  messageEl.style.color = type === 'success' ? '#155724' : '#721c24';
  messageEl.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  messageEl.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => { messageEl.style.display = 'none'; }, 5000);
  }
}

// Auto redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = "./home.html";
  }
});
