export const AdminReg = Vue.component('adminreg', {
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
            <form method="post" @submit.prevent="adminregister">
                <h1>Create Admin Account</h1>
                <input type="username" placeholder="Username" name="username" v-model="username" required/>
                <input type="email" placeholder="Email" name="email" id="email" v-model="email" required/>
                <input type="password" placeholder="Password" name="password" id="password" v-model="password" required/>
                <button type="submit">Register</button>
            </form>
        </div>
        <!-- Display error message if there is one -->
        <div v-if="error" class="error" id="error">
            <p id="error-message">{{ error }}</p>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-right">
                    <h1>Admin Login</h1>
                    <p>Already have an admin account?</p>
                    <a href="/#/admin/login"><button class="btn">Login</button></a>
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
            email: "",
            password: "",
            error: "", // Initialize error message
        };
    },
    mounted: function () {
        document.title = "Admin Register";
    },
    methods: {
        adminregister: function () {
            const data = {
                username: this.username,
                email: this.email,
                password: this.password,
            };

            fetch("/api/admin/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status == 201) {
                        return response.json();
                    }
                    else {
                        return response.json().then((data) => {
                            this.error = "Error registering admin ";
                        });
                    }
                }
                )
                .then((data) => {
                    console.log(data);
                    localStorage.setItem("username", this.username);
                    localStorage.setItem("access_token", data.access_token);
                    this.error = "";
                    window.location.href = "/#/admin/home";
                })
                .catch((error) => {
                    console.error("Error: ", error);
                });
        }
    },

});
