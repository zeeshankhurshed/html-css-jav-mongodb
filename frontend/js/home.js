
   
        // navbar.js
        document.addEventListener("DOMContentLoaded", () => {
            const navItems = document.querySelector(".navItems");
            const menuToggle = document.querySelector(".menu-toggle");

            if (!navItems) {
                console.error("❌ .navItems element not found in DOM");
                return;
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

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navItems') && !e.target.closest('.menu-toggle')) {
                    navItems.classList.remove('active');
                }
            });
        });
