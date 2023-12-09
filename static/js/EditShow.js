export const EditShow = Vue.component('edit_show', {
    template: `
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
    <h1>Edit Show</h1>
    <div class="form-container">
      <form @submit.prevent="saveShow">
        <input type="text" v-model="ShowName" placeholder="Show Name" required />
        <input type="text" v-model="Date" placeholder="Date" required />
        <input type="text" v-model="StartTime" placeholder="Start Time" required />
        <input type="text" v-model="EndTime" placeholder="End Time" required />
        <input type="text" v-model="Tags" placeholder="Tags" required />
        <input type="text" v-model="Rating" placeholder="Rating" required />
        <input type="text" v-model="Price" placeholder="Price" required />
        <button>Save Show</button>
      </form>
    </div>
    <div v-if="alert" :class="alertType">
        <p>{{ alert }}</p>
    </div>
  </div>
</div>
`,

    data: function() {
        return {
            ShowName: "",
            Date: "",
            StartTime: "",
            EndTime: "",
            Tags: "",
            Rating: "",
            Price: "",
            show_id: this.$route.params.show_id,
            alert: "", // Initialize alert message
            alertType: "", // Initialize alert type
            theater_id: localStorage.getItem("active_theater_id"),
            searchQuery: "",
        }
    },

    mounted: function() {
        document.title = "Edit Show";
        const admin = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (admin == null || token == null) {
            window.location.href = "/#/login";
        }
        this.getShow();
    },

    methods: {
        saveShow: function() {
            const show = {
                name: this.ShowName,
                date: this.Date,
                start_time: this.StartTime,
                end_time: this.EndTime,
                tags: this.Tags,
                rating: this.Rating,
                price: this.Price,
            };
            const token = localStorage.getItem("access_token");
            fetch(`/api/shows/update/${this.show_id}`, {
                    method: "PUT",
                    body: JSON.stringify(show),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.status == 200) {
                        this.alert = "Show updated successfully";
                        this.alertType = "success";
                        window.location.href = "/#/admin/theater/"+this.theater_id;
                    } else {
                        this.alert = "Show update failed";
                        this.alertType = "error";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getShow: function() {
            const token = localStorage.getItem("access_token");
            console.log(this.$route.params.show_id);
            fetch("/api/shows/"+this.theater_id+"/" + this.$route.params.show_id, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    this.ShowName = data.name;
                    this.Date = data.date;
                    this.StartTime = data.start_time;
                    this.EndTime = data.end_time;
                    this.Tags = data.tags;
                    this.Rating = data.rating;
                    this.Price = data.price;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        logout: function() {
            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            window.location.href = "/#/admin/login";
        },
        search() {
            // Redirect to the search results page with the search query as a parameter
            this.$router.push({ path: "/admin/search", query: { q: this.searchQuery } });
          },

    },
});