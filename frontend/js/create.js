const inputs = [
  { label: "Name", type: "text", placeholder: "Enter product name", name: "name" },
  { label: "Description", type: "text", placeholder: "Enter product description", name: "description" },
  { label: "Price", type: "number", placeholder: "Enter product price", name: "price" },
  { label: "Quantity", type: "number", placeholder: "Enter product quantity", name: "quantity" },
  { label: "Category", type: "text", placeholder: "Enter product category", name: "category" }, // ✅ changed
  { label: "Image", type: "file", name: "image" },
];


const form = document.getElementById("createForm");

// Render inputs dynamically
inputs.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("form-item");

  div.innerHTML = `
    <input type="${item.type}" 
           name="${item.name}" 
           class="frminput"
           placeholder="${item.placeholder || ''}" 
           ${item.type !== "file" ? "required" : ""}/>
  `;
  form.appendChild(div);
});

// Add submit button
const button = document.createElement("button");
button.type = "submit";
button.textContent = "Submit";
form.appendChild(button);

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;
  const formData = new FormData();

  inputs.forEach(item => {
    const input = form.elements[item.name];

    if (item.type === "file") {
      if (input.files.length > 0) {
        formData.append(item.name, input.files[0]);
      }
    } else {
      if (!input.value.trim()) {
        isValid = false;
        showMessage(`Please fill in the ${item.label} field`, "error");
        input.style.borderColor = "red";
      } else {
        input.style.borderColor = "";
        formData.append(item.name, input.value.trim());
      }
    }
  });

  if (!isValid) return;

  console.log("FormData values:");
  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }

  // Button loading state
  const originalText = button.textContent;
  button.textContent = "Creating...";
  button.disabled = true;

  try {
    const response = await fetch("http://localhost:5555/product", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    if (data.success) {
      showMessage("Product created successfully! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "./products.html";
      }, 1500);
    } else {
      throw new Error(data.message || "Creation failed");
    }

  } catch (err) {
    console.error("Error:", err);
    showMessage(err.message || "Something went wrong during creation", "error");
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
});

// Function to show messages
function showMessage(text, type) {
  let messageEl = document.getElementById("form-message");
  if (!messageEl) {
    messageEl = document.createElement("div");
    messageEl.id = "form-message";
    messageEl.style.padding = "10px";
    messageEl.style.marginTop = "15px";
    messageEl.style.borderRadius = "5px";
    messageEl.style.textAlign = "center";
    form.appendChild(messageEl);
  }

  messageEl.textContent = text;
  messageEl.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  messageEl.style.color = type === "success" ? "#155724" : "#721c24";
  messageEl.style.border = type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb";
  messageEl.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      messageEl.style.display = "none";
    }, 5000);
  }
}
