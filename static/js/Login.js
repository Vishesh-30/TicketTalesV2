export const Login = Vue.component('login', {
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
            <form method = "post" @submit.prevent ="login">
                <h1>Log In</h1>
                <input type="username" placeholder="username" name = "username" id="username" v-model = "username" required/>
                <input type="password" placeholder="Password" name = "Password" id="password" v-model = "password" required/>
                <button type = "submit">Log In</button>
            </form>
        </div>
        <!-- Display error message if there is one -->
        <div v-if="error" class= "error" id="error">
            <p id="error-message">{{error}}</p>
        </div>
	    <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-right">
                    <h1>Create Account</h1>
                    <p>Get your Tickets done in no time with Ticket Tales!</p>
                    <a href="/#/register"><button class="btn">Register</button></a>
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
    data: function() {
        return {
            username: "",
            password: "",
            error: "", // Initialize error message
        }
    },
    mounted: function() {
        document.title = "Login";
    },
    methods: {
        login: function () {
            const data = {
                username: this.username,
                password: this.password,
            };
    
            fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                // Assuming the API returns an access_token
                if (data.access_token) {
                    console.log("Login successful");
                    localStorage.setItem("username", this.username);
                    localStorage.setItem("access_token", data.access_token);
                    this.error = "";
                    this.$router.push("/home");
                } else {
                    // Set the error message
                    error = "Invalid username or password or user does not exist";
                }
            })
            .catch((error) => {
                console.error("Error:", error.message);
                this.error = error.message;
            });
        },
    },
});

