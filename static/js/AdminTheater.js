export const AdminTheater = Vue.component('admin_theater', {
    template: `
<div>
    <head>
        <link rel="stylesheet" href="static/css/home.css">
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
    <h1>Theater {{ theater.theater_id }}</h1>
    <div class="theater-details">
      <h2>{{ theater.name }}</h2>
      <p>Adress: {{ theater.address }}</p>
      <p>City: {{ theater.city }}</p>
      <p>State: {{ theater.state }}</p>
      <p>Capacity: {{ theater.capacity }}</p>
    </div>
    <div class="add-edit-btn">
    <router-link :to="'/add/show'"><button class="Btn-2">Add Show</button></router-link>
    <router-link :to="'/edit/theater/' + theater_id"><button class="Btn-2">Edit Theater</button></router-link>
    <button @click="theaterpdf" class="Btn-2">Download PDF</button>
    <button @click="teatercsv" class="Btn-2">Download CSV</button>
    <button @click="confirmDeleteTheater" class="Btn-2">Delete Theater</button>
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
                <th>Show Date</th>
                <th>Show Time</th>
                <th>Show Tag</th>
                <th>Show Rating</th>
                <th>Show Price</th>
                <th>Show theater</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="show in shows" :key="show.show_id">
                <td>{{ show.show_id }}</td>
                <td>{{ show.name }}</td>
                <td>{{ show.date }}</td>
                <td>{{ show.start_time }}</td>
                <td>{{ show.tags }}</td>
                <td>{{ show.rating }}</td>
                <td>{{ show.price }}</td>
                <td>{{ show.theater_id }}</td>
                <td class="icons"><router-link :to="'/edit/show/' + show.show_id"><i class="fa-regular fa-pen-to-square icons"></i></router-link> <a @click="confirmDeleteShow(show.show_id)"><i class="fa-regular fa-trash-can icons"></i></a></td>
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
            theater_id: this.$route.params.theater_id,
            alert: "", // Initialize alert message
            searchQuery: "",
        };
    },
    mounted: function () {
        document.title = "Theater";
        const admin = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        if (admin == null || token == null) {
            window.location.href = "/#/admin/login";
        }
        fetch(`/api/theater/${this.theater_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.theater = data;
            });
        fetch(`/api/shows/${this.theater_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.shows = data;
                localStorage.setItem("active_theater_id", this.theater_id);
                localStorage.setItem("active_theater_name", this.theater.name);
            });
    },
    methods: {
        logout: function () {
            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            window.location.href = "/#/admin/login";
        },
        deleteTheater: function () {
          const token = localStorage.getItem("access_token");
    
          // Call the delete API with the theater_id
          fetch(`/api/theater/${this.theater_id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.status === 200) {
                // Theater deleted successfully, redirect to another page or handle as needed
                // For example, redirect to the admin home page
                window.location.href = "/#/admin/home";
              } else if (response.status === 404) {
                // Theater not found
                this.alert = "Theater not found.";
                console.error("Error:", alert);
              } else {
                // Error deleting theater
                this.alert = "Error deleting theater.";
                console.error("Error:", alert);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        },
        confirmDeleteTheater: function () {
          if (window.confirm("Are you sure you want to delete this theater?")) {
              this.deleteTheater(); // Call the deleteTheater method if the user confirms
          }
        },
        confirmDeleteShow(showId) {
          const confirmation = window.confirm('Are you sure you want to delete this show?');
          if (confirmation) {
            const token = localStorage.getItem('access_token');
            fetch(`/api/shows/delete/${showId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => {
                if (response.status === 200) {
                  // Show deleted successfully, redirect to another page or handle as needed
                  window.location.href = '/#/admin/home';
                } else if (response.status === 404) {
                  return response.json().then((data) => {
                    console.error('Error:', data);
                    // Handle error: Show not found
                  });
                } else {
                  console.error('Error:', response.statusText);
                  // Handle other errors
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
        },
        theaterpdf: function () {
          const token = localStorage.getItem("access_token");
          fetch(`/api/theater/pdf/${this.theater_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.blob())
            .then((data) => {
              const blob = new Blob([data], { type: "application/pdf" });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = `${this.theater.name}.pdf`;
              link.click();
            });
        },
        teatercsv: function () {
          const token = localStorage.getItem("access_token");
          console.log("function called");
          fetch(`/api/theater/csv/${this.theater_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.blob())
            .then((data) => {
              const blob = new Blob([data], { type: "text/csv" });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = `${this.theater.name}.csv`;
              link.click();
            });
        },
        search() {
          // Redirect to the search results page with the search query as a parameter
          this.$router.push({ path: "/admin/search", query: { q: this.searchQuery } });
        },
    },
});