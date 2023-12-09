export const About = Vue.component('about', {
    template: `
<div>
    <head>
        <link rel="stylesheet" href="static/css/style.css">
    </head>
    <header>
        <nav>
            <div class="navbar-logo">
                <a href="/#/home">
                    <img src="static/img/solid white.png" alt="Your Logo">
                </a>
            </div>
            <ul class="navbar-links">
                <li><a href="/#/my_shows">My Shows</a></li>
                <li><a href="/#/about">About</a></li>
                <li>
                <form @submit.prevent="search">
                    <input type="text" v-model="searchQuery" placeholder="Search..." @keyup.enter="search">
                </form>
                </li>
                <a @click="logout"><button class="btn"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</button></a>
            </ul>
        </nav>
    </header>
    <div>
    <h1>About This Project</h1>
    <p style="color: white;">TicketTales: A ticketing app that offers an easy and convenient way to book seats for various shows. With a user-friendly interface, the app allows users to browse upcoming events, select their preferred seats, and make secure payments all in one place. Whether you're looking to catch a play, a concert, or a comedy show, TicketTales has you covered.</p>
    <p style="color: white;">This project is a simple web application that allows users to create, read, update and delete data from a database. The application is built using Vue.js, Python, Flask, HTML, CSS, SQLite, Celery and Redis.</p>
    <h1>How to Run</h1>
    <p style="color: white;">To run this project, you need to have Python installed on your computer. You can download Python from <a href="https://www.python.org/downloads/">here</a>. After installing Python, you need to install Flask. You can install Flask by running the following command in your terminal:</p>
    <p style="color: white;">pip install -r Requirements.txt</p>
    <p style="color: white;">After installing all the packages, you can run the application by running the following command in your terminal:</p>
    <p style="color: white;">python run.py</p>
    <p style="color: white;">The application will be running on http://127.0.0.1:5000/ localhost</p>
    <h1>How to Use</h1>
    <p style="color: white;">To use this application, you need to create an account. You can create an account by clicking on the "Sign Up" button on the navbar. After creating an account, you can login to the application by clicking on the "Login" button on the navbar. After logging in, you can create, read, update and delete data from the database.</p>
    <h1>Source Code</h1>
    <p style="color: white;">You can find the source code of this project on <a href="#">GitHub</a> (Code is not uploaded yet!)</p>
    <h1>Author</h1>
    <p style="color: white;">This project is created by Vishesh Phutela (21f3001040)</p>
    <h1>Contact</h1>
    <p style="color: white;">You can contact me on <a href="https://visheshphutela.web.app/">Portfolio</p></a>
    <div class="copyright">
      <p>© 2023 Vishesh Phutela (21f3001040). All Rights Reserved.</p>
      <p>Made with 🤍</p>
    </div>
    </div>
</div>
`,

    data: function() {
        return {
            searchQuery: "",
        }
    },
    mounted: function() {
        document.title = "About";
    },
    methods: {
        logout: function() {
            localStorage.clear();
            window.location.href = "/#/login";
        },
        search: function() {
            window.location.href = "/#/search?q=" + this.searchQuery;
        },
    }
});