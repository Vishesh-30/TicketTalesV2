export const Search = Vue.component('search', {
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
        <a @click="logout"><button class="btn"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</button></a>
    </ul>
</nav>
</header>
<h1>Showing results for '{{ searched }}'</h1>
    <div class="container-2">
      <div class="search-results">
        <h2>Search Results</h2>
        <div v-for="data in search_data">
          <div class="search-result">
            <div v-if = "data.theater_id > 0">
                <a :href="'/#/theater/' + data.theater_id">
                    <p>{{ data.name }}</p>
                </a>
            </div>
          </div>
      </div>
    </div>
</div>
`,

    data: function() {
        return {
            searched: this.$route.query.q || "",
            show: {},
            theater: {},
            search_data: [],
            searchQuery: "",
        }
    },
    mounted: function() {
        document.title = "Search";
        const user = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (user == null || token == null) {
            window.location.href = "/#/login";
        }
        this.search();
    },
    methods: {
        search: function() {
            const token = localStorage.getItem("access_token");
            const search = this.searched;
            fetch("/api/search/" + search, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.search_data = data;
                    console.log(this.search_data);
                }
            );
        },
        logout: function () {
            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            window.location.href = "/#/login";
        },
    },
});
