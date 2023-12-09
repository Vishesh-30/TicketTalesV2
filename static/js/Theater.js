export const Theater = Vue.component('theater', {
    template:
        `
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
    <h1>Theater {{ theater.theater_id }}</h1>
    <div class="theater-details">
      <h2>{{ theater.name }}</h2>
      <p>Adress: {{ theater.address }}</p>
      <p>City: {{ theater.city }}</p>
      <p>State: {{ theater.state }}</p>
      <p>Capacity: {{ theater.capacity }}</p>
    </div>

    <div class="container-2">
      <div class="shows">
        <h2>Available Shows</h2>
        <div class="show">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Show ID</th>
                <th>Show Name</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Tags</th>
                <th>Rating</th>
                <th>Price</th>
                <th>Theater</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="show in shows" :key="show.show_id">
                <td>{{ show.show_id }}</td>
                <td>{{ show.name }}</td>
                <td>{{ show.date }}</td>
                <td>{{ show.start_time }}</td>
                <td>{{ show.end_time }}</td>
                <td>{{ show.tags }}</td>
                <td>{{ show.rating }}</td>
                <td>{{ show.price }}</td>
                <td>{{ show.theater_id }}</td>
                <td><a :href="'/#/book/show/' + show.show_id"><button class="book-show">Book</button></a></td>
              </tr>
            </tbody>
          </table>
          <div class="error" v-if="shows.length === 0">
            <p>There are no shows available for this theater</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
    data: function () {
        return {
            theater: {},
            shows: [],
            searchQuery: "",
        }
    },
    mounted: function () {
        document.title = "Theater";
        const user = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (user == null || token == null) {
            window.location.href = "/#/login";
        }
        const theater_id = this.$route.params.id;
        fetch("/api/theater/" + theater_id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.theater = data;
                console.log(this.theater);
            }
            );
        fetch("/api/shows/" + theater_id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.shows = data;
                console.log(this.shows);
                localStorage.setItem("active_theater_id", this.theater.theater_id);
                localStorage.setItem("active_theater_name", this.theater.name);
                localStorage.setItem("active_theater_capacity", this.theater.capacity);
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