export const addTheater = Vue.component('add_theater', {
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
        <h1>Add Theater</h1>
        <div class="form-container">
            <form @submit.prevent="addTheater">
                <input type="text" placeholder="Theater Name" v-model="TheaterName" required/>
                <input type="number" placeholder="Capacity" v-model="Capacity" required/>
                <input type="text" placeholder="Address" v-model="Address" required/>
                <input type="text" placeholder="City" v-model="City" required/>
                <input type="text" placeholder="State" v-model="State" required/>
                <button type="submit">Add Theater</button>
            </form>
            <p>{{ alert }}</p>
        </div>
    </div>
</div>`,

    data: function () {
        return {
            TheaterName: "",
            Capacity: "",
            Address: "",
            City: "",
            State: "",
            alert: "", // Initialize alert message
            searchQuery: "",

        };
    },
    mounted: function () {
        document.title = "Add Theater";
        const admin = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (admin == null || token == null) {
            window.location.href = "/#/admin/login";
        }
    },
    methods: {
        addTheater: function () {
            const token = localStorage.getItem("access_token");
            const admin = localStorage.getItem("username");
            
            // Create the request payload object
            const requestBody = {
                name: this.TheaterName,
                capacity: parseInt(this.Capacity),
                address: this.Address,
                city: this.City,
                state: this.State,
            };
            
            fetch("/api/theater", {
                method: "POST",
                body: JSON.stringify(requestBody), // Send the request payload as JSON
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Specify content type
                },
            })
            .then((response) => {
                if (response.status === 201) {
                    console.log("Theater added successfully!");
                    this.alert = "Theater added successfully!";
                    window.location.href = "/#/admin/home";

                } else if (response.status === 400) {
                    return response.json().then((data) => {
                        console.error("Error:", data);
                        this.alert = data.message;
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        },
        logout: function () {
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
