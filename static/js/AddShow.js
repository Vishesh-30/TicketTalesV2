export const AddShow = Vue.component('add_show', {
    template:
        `
<div>
    <head>
        <link rel="stylesheet" href="static/css/style.css">
    </head>
    <header>
        <nav>
            <div class="navbar-logo">
                <a href="/#/admin/home">
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
    <div class="container">
    <h1>Add Show</h1>
    <p style = "margin-left : 50px;"><b>Theater: {{ theaterName }}</b></p>
    <div class="form-container">
      <form @submit.prevent="addShow">
        <input type="text" v-model="showName" placeholder="Show Name" required />
        <input type="date" v-model="showDate" placeholder="Date" required />
        <input type="time" v-model="startTime" placeholder="Start Time" required />
        <input type="time" v-model="endTime" placeholder="End Time" required />
        <input type="text" v-model="showTag" placeholder="Tags" required />
        <input type="number" v-model="showRating" step="any" min="0" max="5" placeholder="Rating" required />
        <input type="number" v-model="showPrice" placeholder="Price" required />
        <button type="submit">Add Show</button>
      </form>
    </div>
    <div v-if="alert" :class="[alertType]">
        <p style = "margin-left: 135px;">{{ alert }}</p>
    </div>
  </div>
</div>
    `,
    data: function () {
        return {
            showName: "",
            showDate: "",
            startTime: "",
            endTime: "",
            showTag: "",
            showRating: "",
            showPrice: "",
            showTheater: localStorage.getItem("active_theater_id"),
            theaterName: localStorage.getItem("active_theater_name"),
            alert: "", // Initialize alert message
            alertType: "", // Initialize alert type
            searchQuery: "",
        };
    },
    mounted: function () {
        document.title = "Add Show";
        const admin = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (admin == null || token == null) {
            window.location.href = "/#/admin/login";
        }
    },
    methods: {
        addShow: function () {
            const token = localStorage.getItem("access_token");
            const admin = localStorage.getItem("username");
        
            // Create the request payload object
            const requestBody = {
                name: this.showName,
                date: this.showDate,
                start_time: this.startTime,
                end_time: this.endTime,
                tags: this.showTag,
                rating: parseFloat(this.showRating),
                price: parseFloat(this.showPrice),
                theater_id: parseInt(this.showTheater),
            };
        
            // Send a POST request to /api/shows/
            fetch("/api/shows", {
                method: "POST",
                body: JSON.stringify(requestBody), // Send the request payload as JSON
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.status === 201) {
                    this.alert = "Show added successfully.";
                    this.alertType = "success"; // Set alert type to success
                    // Optionally, you can redirect to another page or perform some action here
                } else if (response.status === 400 || response.status === 409 || response.status === 401 || response.status === 404) {
                    // Handle different error scenarios
                    return response.json().then((data) => {
                        console.error("Error:", data);
                        console.log(data);
                        this.alert = data.message;
                        this.alertType = "error"; // Set alert type to error
                    });
                } else {
                    console.error("Unexpected Error:", response);
                    this.alert = "An unexpected error occurred.";
                    this.alertType = "error"; // Set alert type to error
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                this.alert = "An error occurred while processing your request.";
                this.alertType = "error"; // Set alert type to error
            });
        },
        logout: function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("username");
            window.location.href = "/#/admin/login";
        },
        search() {
            // Redirect to the search results page with the search query as a parameter
            this.$router.push({ path: "/admin/search", query: { q: this.searchQuery } });
          },
    },
});



