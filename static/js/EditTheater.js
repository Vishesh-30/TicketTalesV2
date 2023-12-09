export const EditTheater = Vue.component('edit_theater', {
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
    <h1>Edit Theater</h1>
    <div class="form-container">
      <form @submit.prevent="editTheater">
        <input type="text" v-model="TheaterName" placeholder="Theater Name" required />
        <input type="number" v-model="Capacity" placeholder="Capacity" required />
        <input type="text" v-model="Address" placeholder="Address" required />
        <input type="text" v-model="City" placeholder="City" required />
        <input type="text" v-model="State" placeholder="State" required />
        <button type="submit">Save Theater</button>
      </form>
    </div>
    <div v-if="alert" :class="[alertType]">
        <p style = "margin-left: 135px;">{{ alert }}</p>
    </div>
  </div>
</div>
`,

    data: function() {
        return {
            TheaterName: "",
            Capacity: "",
            Address: "",
            City: "",
            State: "",
            theater_id: this.$route.params.theater_id,
            alert: "", // Initialize alert message
            alertType: "", // Initialize alert type
            searchQuery: "",
        }
    },
    mounted: function() {
        document.title = "Edit Theater";
        const admin = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (admin == null || token == null) {
            window.Adress.href = "/#/admin/login";
        }
        this.getTheater();
    },

    methods: {
        editTheater: function() {
            const token = localStorage.getItem("access_token");
            const theater = {
                name: this.TheaterName,
                capacity: this.Capacity,
                address: this.Address,
                city: this.City,
                state: this.State,
            };
            fetch("/api/theater/" + this.theater_id, {
                    method: "PUT",
                    body: JSON.stringify(theater),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.status === 201) {
                      this.alert = "Theater updated successfully.";
                      this.alertType = "success"; // Set alert type to success
                    } else if (response.status === 404) {
                      this.alert = "Theater not found.";
                      this.alertType = "error"; // Set alert type to error
                    } else {
                      this.alert = "Error updating theater.";
                      this.alertType = "error"; // Set alert type to error
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              },
        getTheater: function() {
            const token = localStorage.getItem("access_token");
            fetch(`/api/theater/${this.theater_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    this.TheaterName = data.name;
                    this.Capacity = data.capacity;
                    this.Address = data.address;
                    this.City = data.city;
                    this.State = data.state;
                }).catch((error) => {
                    console.error("Error:", error);
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
