export const MyShows = Vue.component('my_shows', {
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
                <li>
                    <a @click="logout"><button class="btn"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</button></a>
                </li>
            </ul>
        </nav>
    </header>
    <h1>My Shows</h1>
    <div class="container-2">
        <div class="shows">
            <h2>My Shows</h2>
            <div class="show">
                <table cellpadding="0" cellspacing="0" border="0">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Booking User</th>
                            <th>Booking Theater</th>
                            <th>Booking Show</th>
                            <th>Number of Tickets</th>
                            <th>Total Price</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.booking_id">
                            <td>{{ booking.booking_id }}</td>
                            <td>{{ booking.user_username }}</td>
                            <td>{{ booking.theater_name }}</td>
                            <td>{{ booking.show_name }}</td>
                            <td>{{ booking.seats }}</td>
                            <td>{{ booking.total_price }}</td>
                            <td>
                            <router-link :to="'/invoice/' + booking.booking_id">
                                <button class="book-show">Invoice</button>
                            </router-link>
                        </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="alert == 'No bookings found.'" class="error">
                    <p>You have no bookings</p>
                </div>
            </div>
        </div>
    </div>
</div>
`,

    data: function() {
        return {
            bookings: [],
            alert: "",
            username: localStorage.getItem("username"),
            searchQuery: "",
        }
    },

    mounted: function() {
        document.title = "My Shows";

        fetch("/api/booking/" + this.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                if (response.status === 201) {
                    return response.json(); // Parse the JSON response
                } else {
                    throw new Error('Failed to fetch data'); // Handle non-200 status
                }
            })
            .then((jsonResponse) => {
                console.log(jsonResponse);
                this.bookings = jsonResponse;
                this.alert = jsonResponse.message;
                console.log(this.bookings);

                if (this.bookings.length == 0) {
                    this.alert = "No bookings found.";
                }
            })
            .catch((err) => {
                console.log(err);
            }
            );
    },

    methods: {
        logout: function() {
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



