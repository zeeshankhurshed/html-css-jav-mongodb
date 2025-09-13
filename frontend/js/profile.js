
        // profile.js
        document.addEventListener("DOMContentLoaded", () => {
            const profileContainer = document.getElementById('profile-container');
            const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
            
            if (!storedUser) {
                profileContainer.innerHTML = `
                    <div class="profile-card">
                        <div class="profile-details" style="text-align: center; padding: 3rem;">
                            <h2>No User Information Found</h2>
                            <p>Please log in to view your profile.</p>
                            <div style="margin-top: 2rem;">
                                <a href="./login.html" class="btn btn-primary">Login</a>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Generate avatar initial
            const avatarInitial = storedUser.name ? storedUser.name.charAt(0).toUpperCase() : 'U';
            
            profileContainer.innerHTML = `
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="avatar">${avatarInitial}</div>
                        <h1>${storedUser.name || 'User'}</h1>
                        <p>${storedUser.role || 'Member'}</p>
                    </div>
                    
                    <div class="profile-details">
                        <div class="two-columns">
                            <div class="detail-group">
                                <h3>Email Address</h3>
                                <p>${storedUser.email || 'Not provided'}</p>
                            </div>
                            
                            <div class="detail-group">
                                <h3>Phone Number</h3>
                                <p>${storedUser.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        
                        <div class="detail-group">
                            <h3>Bio</h3>
                            <p>${storedUser.bio || 'No bio provided yet.'}</p>
                        </div>
                        
                        <div class="two-columns">
                            <div class="detail-group">
                                <h3>Join Date</h3>
                                <p>${storedUser.joinDate || 'Not available'}</p>
                            </div>
                            
                            <div class="detail-group">
                                <h3>Status</h3>
                                <p>${storedUser.status || 'Active'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="actions">
                        <button class="btn btn-primary">Edit Profile</button>
                        <button class="btn btn-outline">Change Password</button>
                    </div>
                </div>
            `;
        });

        // navbar.js
        document.addEventListener("DOMContentLoaded", () => {
            const navItems = document.querySelector(".navItems");
            const menuToggle = document.querySelector(".menu-toggle");
            const logoutBtn = document.getElementById("logout-btn");

            if (!navItems) {
                console.error("❌ .navItems element not found in DOM");
                return;
            }

            // Base links
            const baseLinks = [
                { name: "Home", path: "./home.html" },
                { name: "Product", path: "./products.html" },
            ];

            // Get user from localStorage
            const storedUser = JSON.parse(localStorage.getItem("user") || "null");

            let links = [...baseLinks];

            if (storedUser) {
                links.push({ name: `Hello, ${storedUser.name}`, path: "./profile.html" });
                links.push({ name: "Create", path: "./create.html" });
                links.push({ name: "Logout", path: "#logout" });
            } else {
                links.push({ name: "Login", path: "./login.html" });
            }

            // Clear nav first
            navItems.innerHTML = "";

            // Render links
            links.forEach(link => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link.path;
                a.textContent = link.name;

                if (link.name === "Logout") {
                    a.id = "logout-btn";
                    a.addEventListener("click", (e) => {
                        e.preventDefault();
                        localStorage.removeItem("user");
                        fetch("http://localhost:5555/user/logout", {
                            method: "POST",
                            credentials: "include"
                        }).finally(() => window.location.href = "./login.html");
                    });
                }

                li.appendChild(a);
                navItems.appendChild(li);
            });

            // Toggle menu for mobile
            if (menuToggle) {
                menuToggle.addEventListener("click", () => {
                    navItems.classList.toggle("active");
                });
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navItems') && !e.target.closest('.menu-toggle')) {
                    navItems.classList.remove('active');
                }
            });
        });
