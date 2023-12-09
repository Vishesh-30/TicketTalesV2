export const Register = Vue.component('register', {
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
            <form method="post" @submit.prevent="register">
                <h1>Create Account</h1>
                <input type="username" placeholder="username" name="username" v-model="username" required/>
                <input type="email" placeholder="Email" name="email" id="email" v-model="email" required/>
                <input type="password" placeholder="Password" name="password" id="password" v-model="password" required/>
                <button type="submit">Register</button>
            </form>
        </div>
        <!-- Display error message if there is one -->
        <div v-if="error" class= "error" id="error">
            <p id="error-message">{{error}}</p>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-right">
                    <h1>Login</h1>
                    <p>Already an existing user?</p>
                    <a href="/#/login"><button class="btn">Login</button></a>
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
        document.title = "Register";
    },
    methods: {
        register: function () {
            const data = {
                username: this.username,
                email: this.email,
                password: this.password,
            };

            fetch("/api/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if(response.status === 201) {
                        return response.json();
                    }
                    else {
                        return response.json().then((data) => {
                            this.error = "Error registering User"+data["message"];
                        });
                    }
                }
                )
                .then((data) => {
                    localStorage.setItem("username", this.username);
                    localStorage.setItem("access_token", data.access_token);
                    this.error = "";
                    window.location.href = "/#/home";
                })
        }
    },
});
