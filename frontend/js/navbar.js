// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  // console.log("Navbar script loaded");

  const navItems = document.querySelector(".navItems");
  const menuToggle = document.querySelector(".menu-toggle");
  const welcomeEl = document.querySelector("#welcome");

  if (!navItems) {
    console.error("❌ .navItems element not found in DOM");
    return;
  }

  // Clear nav first
  navItems.innerHTML = "";

  // Base links
  const baseLinks = [
    { name: "Home", path: "./home.html" },
    // { name: "About", path: "./about.html" },
    // { name: "Contact", path: "./contact.html" },
    { name: "Product", path: "./products.html" },
  ];

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  // console.log("Stored user from localStorage:", storedUser);

  let links = [...baseLinks];

  if (storedUser) {
    links.push({ name: `Hello, ${storedUser.name}`, path: "./profile.html" });
    links.push({ name: "Create", path: "./create.html" });
    links.push({ name: "Logout", path: "#logout" });
  } else {
    // links.push({ name: "Register", path: "./register.html" });
    links.push({ name: "Login", path: "./login.html" });
  }

  // Render links
  links.forEach(link => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.path;
    a.textContent = link.name;

    if (link.name === "Logout") {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Logging out...");
        localStorage.removeItem("user");
        fetch("http://localhost:5555/user/logout", {
          method: "POST",
          credentials: "include"
        }).finally(() => location.reload());
      });
    }

    li.appendChild(a);
    navItems.appendChild(li);
  });

  // Show welcome text if element exists
  if (welcomeEl && storedUser) {
    welcomeEl.textContent = `Welcome, ${storedUser.name}`;
  } else if (welcomeEl) {
    welcomeEl.textContent = "";
  }

  // Toggle menu for mobile
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      console.log("Toggling mobile menu");
      navItems.classList.toggle("active");
    });
  } else {
    console.warn("⚠️ .menu-toggle not found in DOM");
  }
});
