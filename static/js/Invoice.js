export const Invoice = Vue.component('invoice', {
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
    <div class="invoice">
        <h1>Invoice</h1>
        <img :src="qrCodeUrl" alt="invoice">
        <div class="invoice-details">
            <table>
                <tr>
                    <td><b>Booking ID:</b></td>
                    <td>{{ booking.booking_id }}</td>
                </tr>
                <tr>
                    <td><b>Username:</b></td>
                    <td>{{ booking.user_username }}</td>
                </tr>
                <tr>
                    <td><b>Show Date:</b></td>
                    <td>{{ booking.show_date }}</td>
                </tr>
                <tr>
                    <td><b>Show Time:</b></td>
                    <td>{{ booking.show_time }}</td>
                </tr>
                <tr>
                    <td><b>Booking Theater:</b></td>
                    <td>{{ booking.theater_name }}</td>
                </tr>
                <tr>
                    <td><b>Booking Show:</b></td>
                    <td>{{ booking.show_name }}</td>
                </tr>
                <tr>
                    <td><b>Number of Tickets:</b></td>
                    <td>{{ booking.seats }}</td>
                </tr>
                <tr>
                    <td><b>Total Price:</b></td>
                    <td>{{ booking.total_price }}</td>
                </tr>
            </table>
            <button style="margin-top: 20px;" @click = "confirmDeleteBooking">Cancel Booking</button>
        </div>
    </div>
</div>
`,

    data: function () {
        return {
            booking: {},
            show_name: "",
            searchQuery: "",
        };
    },

    mounted: function () {
        document.title = "Invoice";
        this.getBooking();
    },

    methods: {
        getBooking: function () {
            const booking_id = this.$route.params.booking_id;
            console.log(booking_id);
            const token = localStorage.getItem("access_token");
            fetch("/api/booking/" + booking_id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    this.booking = data;
                    this.show_name = data.show_name;
                    console.log(this.booking);
                    console.log(this.show_name);
                })
                .catch((error) => {
                    console.log(error);
                });

        },
        confirmDeleteBooking: function () {
            if (confirm("Are you sure you want to cancel this booking?")) {
                this.deleteBooking();
            }
        },
        deleteBooking: function () {
            const booking_id = this.$route.params.booking_id;
            const token = localStorage.getItem("access_token");
            fetch("/api/booking/" + booking_id, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        this.alert = "Booking cancelled successfully.";
                        this.alertType = "success";
                        window.location.href = "/#/my_shows";

                    } else {
                        throw new Error("Booking cancellation failed.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.alert = "Booking cancellation failed.";
                    this.alertType = "danger";
                });
        },

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

    computed: {
        qrCodeUrl: function () {
            return (
                "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                this.booking.booking_id
            );
        },
    },
});

