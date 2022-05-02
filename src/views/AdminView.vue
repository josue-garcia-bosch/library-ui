<template>
  <div class="container mt-5">
    <header class="bg-surface-primary border-bottom pt-6">
      <div class="container-fluid">
        <div class="mb-npx">
          <div class="row align-items-center">
            <div class="col-sm-6 col-12 mb-4 mb-sm-0">
              <h1 class="h2 mb-0 ls-tight">Admin dashboard</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="row mt-4">
      <form class="form-inline" role="form">
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0" for="pref-perpage"
            >Rows per page:</label
          >
          <select id="pref-perpage" v-model="limit" class="form-control">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option selected="selected" value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0" for="pref-orderby"
            >Order by:</label
          >
          <select id="pref-orderby" v-model="order" class="form-control">
            <option>asc</option>
            <option>desc</option>
          </select>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-danger" @click="applyFilters()">
            apply Filters
          </button>
        </div>
      </form>
    </div>
    <div class="row mt-5">
      <div class="col-md-12" v-for="user in users" :key="user._id">
        <div class="card mb-3">
          <img
            src="https://microbiology.ucr.edu/media/421/download?attachment"
            width="100"
            class="rounded-circle"
          />
          <div class="card-body">
            <h5 class="card-title">Name: {{ user.name }}</h5>
            <p class="card-text">Email: {{ user.email }}</p>
            <p class="card-text">
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="promoteUser(user)"
              >
                {{ user.role.name }}
              </button>
              <button
                type="button" 
                class="btn btn-outline-success"
                @click="assignBooksToUser(user)"
              >
                Assign books to user
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserService from "../services/user.service";
export default {
  name: "AdminView",
  data() {
    return {
      users: [],
      limit: 5,
      order: "asc",
      page: 0,
      search: null,
      //for now just harcode is fine
      roles: ["admin", "users"],
      isLoading: false,
    };
  },
  methods: {
    async getInitialUsers() {
      const initialUsers = await UserService.getUsers(
        this.order,
        this.limit,
        this.page
      );
      this.users = initialUsers.data;
    },
    async applyFilters() {
      //restart pages
      this.page = 0;
      const filteredUsers = await UserService.getUsers(
        this.order,
        this.limit,
        this.page
      );
      this.users = filteredUsers.data;
    },
    getNextUser() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          this.isLoading = true;
          this.page = ++this.page;
          UserService.getUsers(this.order, this.limit, this.page)
            .then((moreUsers) => {
              console.log(moreUsers);
              this.users.push(...moreUsers.data);
              this.isLoading = false;
            })
            .catch((error) => {
              console.error(error);
              this.isLoading = false;
            });
        }
      };
    },
    assignBooksToUser(user){
      const userId = user._id;
       this.$router.push("/assign-book-to-user/" + userId);
    },
    async promoteUser(user) {
      console.log(user);
      let roleToPromote;
      if (user.role.name == "admin") roleToPromote = "user";
      else roleToPromote = "admin";

      alert(`promoting user ${user.name} to ${roleToPromote}`);
      await UserService.promoteUser(user._id, roleToPromote);
      this.$router.go();
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  beforeMount() {
    this.getInitialUsers();
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    this.getNextUser();
  },
};
</script>

<style scoped>
.icons i {
  margin-left: 20px;
}

.card {
  border: navy;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
}

.card:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #bec7e7;
  transform: scaleY(1);
  transition: all 0.5s;
  transform-origin: bottom;
}

.card:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #2426aa;
  transform: scaleY(0);
  transition: all 0.5s;
  transform-origin: bottom;
}

.card:hover::after {
  transform: scaleY(1);
}

.myspinner {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>