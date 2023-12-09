export const UserHome = Vue.component('user_home', {
    template: `
<div>
    <head>
        <link rel="stylesheet" href="static/css/home.css">
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
    <div class="box">
        <div v-if="Theaters.length > 0" v-for="theater in Theaters" :key="theater.theater_id">
            <a :href="'/#/theater/' + theater.theater_id">
                <h1>Theater {{ theater.theater_id }}</h1>
                <div class="container">
                    <div class="theater">
                        <div class="theater-details">
                            <h2>{{ theater.name }}</h2>
                            <p>Place: {{ theater.address }}</p>
                            <p>Location: {{ theater.city }}</p>
                            <p>Capacity: {{ theater.capacity }}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div v-else>
            <p>No theaters available.</p>
        </div>
    </div>
</div>
    `,

    data: function() {
        return {
            searchQuery: "",
            Theaters: [],
        }
    },
    mounted: function() {
        document.title = "Home";
        const user = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (user == null || token == null) {
            window.location.href = "/#/login";
        }
        fetch("/api/theater", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.Theaters = data;
            }
        );
        
    },
    methods: {
        logout: function () {
            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            window.location.href = "/#/login";
        },
        search() {
            // Redirect to the search results page with the search query as a parameter
            this.$router.push({ path: "/search", query: { q: this.searchQuery } });
          },
    },

});
