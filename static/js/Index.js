export const Index = Vue.component('index', {
    template: `
<div>
    <head>
        <link rel="stylesheet" href="static/css/style.css">
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
    <div class="container-index">
        <div>
            <h1 style = "color:#000; text-align:center;">Welcome to TicketTales!</h1>
            <h3 style="text-align:center; margin:0px">Get your tickets done in no time!</h3>
        </div>
        <div class = "info">
            <h4>If you are a user, click on the button below to login or register.</h4>
            <a href="/#/login"><button>Login/Register</button></a>
            <h4>If you are an admin, click on the button below to login or register.</h4>
            <a href="/#/admin/login"><button>Admin Login/Register</button></a>
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
        document.title = "Index";
    },
});
