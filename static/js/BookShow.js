export const BookShow = Vue.component('book_show', {
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
                <li>
                <a @click="logout"><button class="btn"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</button></a>
                </li>
            </ul>
        </nav>
    </header>
    <div class="container">
    <h1>Book Show</h1><br>
    <p>Show Details: {{ show.name }}</p>
    <p>Rating: {{ show.rating }}</p>
    <p>Timing: {{ show.date }}, {{ show.start_time }}</p>
    <p>Available Seats: {{ Available_seats }} </p>
    <div v-if="Available_seats === 0" class="housefull">
      <h3>House Full</h3>
    </div>
    <div v-else>
      <div v-if="alert" class="error">
        <p>{{ alert }}</p>
      </div>
      <div class="book-show">
        <form @submit.prevent="bookShow">
          <input type="number" v-model="price" placeholder="Price" :disabled="true" />
          <input type="number" v-model="numTickets" placeholder="Number of Seats" @change="changePrice" required/>
          <input type="number" v-model="totalPrice" placeholder="Total Price" :disabled="true" />
          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  </div>
</div>
`,

    data: function () {
        return {
            show: {},
            capacity: parseInt(localStorage.getItem("active_theater_capacity")),
            bookingUser: localStorage.getItem("username"),
            price: "",
            numTickets: "",
            totalPrice: "",
            alert: "", // Initialize alert message
            alertType: "", // Initialize alert type
            theater_id: localStorage.getItem("active_theater_id"),
            theater_name: localStorage.getItem("active_theater_name"),
            bookedSeats: "",
            Available_seats: "",
            searchQuery: "",
        };
    },

    mounted: function () {
        document.title = "Book Show";
        const user = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (user == null || token == null) {
            window.location.href = "/#/login";
        }
        this.getShow();
    },

    methods: {
        getShow: function () {
            const token = localStorage.getItem("access_token");
            fetch("/api/shows/" +this.theater_id +"/"+this.$route.params.show_id, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.show = data;
                    console.log(this.show);
                    this.price = this.show.price;
                    this.bookedSeats = this.show.booked_seats;
                    this.Available_seats = this.capacity - this.bookedSeats;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        changePrice: function () {
            this.totalPrice = this.price * this.numTickets;
        },
        bookShow: function () {
            const token = localStorage.getItem("access_token");
            const booking = {
                user_username: this.bookingUser,
                show_id: parseInt(this.$route.params.show_id),
                show_date: this.show.date,
                show_time: this.show.start_time,
                seats: parseInt(this.numTickets),
                total_price: parseFloat(this.totalPrice),
                show_name: this.show.name,
                theater_name: this.theater_name,
                available_seats: this.Available_seats,

            };
            fetch("/api/booking", {
                method: "POST",
                body: JSON.stringify(booking),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.status === 201) {
                        setTimeout(() => {
                            this.alert = "Show booked successfully.";
                        }, 2000);
                        window.location.href = "/#/my_shows";
                    } else if (response.status === 400) {
                        return response.json().then((data) => {
                            console.error("Error:", data);
                            console.log(data);
                            this.alert = data.message;
                            this.alertType = "error";
                        });
                    } else {
                        console.error("Error:", response);
                        this.alert = "Something went wrong. Please try again later.";
                        this.alertType = "error";
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    this.alert = "Something went wrong. Please try again later.";
                    this.alertType = "error";
                });
        },
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