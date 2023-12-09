export const AdminLog = Vue.component('adminlog', {
    template: `
    <div>
    <head>
        <link rel="stylesheet" href="static/css/login.css">
    </head>
        <header>
            <nav>
                <div class="navbar-logo">
                    <a href="#">
                    <img src="static/img/solid white.png" alt="Your Logo">
                    </a>
                </div>
                <ul class="navbar-links">
                    <li><a href="/#/about">About</a></li>
                </ul>
            </nav>
        </header>
        <div class="container" id="container">
            <div class="form-container sign-in-container">
                <form method="post" @submit.prevent="adminlogin">
                    <h1>Admin Log In</h1>
                    <input type="username" placeholder="Username" name="username" id="username" v-model="username" required/>
                    <input type="password" placeholder="Password" name="password" id="password" v-model="password" required/>
                    <button type="submit">Log In</button>
                </form>
            </div>
            <!-- Display error message if there is one -->
            <div v-if="error" class="error" id="error">
                <p id="error-message">{{ error }}</p>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-right">
                        <h1>Create Admin Account</h1>
                        <p>Get your Tickets done in no time with Ticket Tales!</p>
                        <a href="/#/admin/register"><button class="btn">Register</button></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>© 2023 Vishesh Phutela (21f3001040). All Rights Reserved.</p>
            <p>Made with 🤍</p>
        </div>
    </div>
    `,
    data: function () {
        return {
            username: "",
            password: "",
            error: "", // Initialize error message
        };
    },
    mounted: function () {
        document.title = "Admin Login";
    },
    methods: {
        adminlogin: function () {
            const data = {
                username: this.username,
                password: this.password,
            };

            fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return response.json().then((data) => {
                            throw new Error(data.message);
                        });
                    }
                })
                .then((data) => {
                    if (data.access_token) {
                        console.log("Login successful");
                        localStorage.setItem("username", this.username);
                        localStorage.setItem("access_token", data.access_token);
                        this.error = "";
                        this.$router.push("/admin/home");
                    } else {
                        this.error = data.message;
                    }
                })
                .catch((err) => {
                    console.error("Error:", err);
                    this.error = err.message;
                });
        },
    },
});