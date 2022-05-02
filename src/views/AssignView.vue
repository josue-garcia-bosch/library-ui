<template>
  <div class="container">
    <div class="row">
      <h2 class="h2 text-center text-info">
        Type and Search for the book to assign to {{ currentUser.name }}
      </h2>
      <hr />
    </div>
    <div class="row mt-5">
      <form class="form-inline" role="form">
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0">Search:</label>
          <input
            type="text"
             placeholder="title book, authors, etc.."
            v-model="search"
            @keyup="searchListener()"
            class="form-control input-sm"
            id="pref-search"
          />
        </div>
      </form>
    </div>
    <div class="row mt-5">
      <div class="col-md-4" v-for="book in books" :key="book._id">
        <div class="card p-3 mb-2" @click="onLoadBook(book._id)">
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-row align-items-center">
              <img
                :src="book.imageURL"
                width="100"
                class="icon bx bxl-mailchimp"
              />
            </div>
            <span
              :class="{
                'text-danger': book.isLent,
                'text-success': !book.isLent,
              }"
              >{{ book.lentDetail }}</span
            >
            <span class="text-info font-weight-light">
              {{ book.isLent ? book.lent.name : "" }}</span
            >
          </div>
          <div class="mt-5">
            <h3 class="heading">
              {{ book.title }}
              <hr />
              {{ book.category }}
            </h3>
            <div class="mt-5">
              <div class="mt-3">
                <span class="text1">{{ book.author }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "../services/book.service";
import image from "../assets/main.jpg";

export default {
  name: "AssignView",
  data() {
    return {
      books: [],
      limit: 25,
      search: null,
    };
  },
  methods: {
    async onLoadBook(id) {
      let userId = this.$route.params.userId;
      const borrowResult = await BookService.assignBook(id, userId);
      if (borrowResult.status == 204) this.$router.push('/books');
      else alert(borrowResult.statusText);
    },
    enrichBooks() {
      this.books.forEach((x) => {
        if (x.lent) {
          x.isLent = true;
          x.lentDetail = "lent";
        } else {
          x.isLent = false;
          x.lentDetail = "available";
        }

        if (!x.imageURL) x.imageURL = image;
      });
    },
    async searchListener() {
      const filteredBooks = await BookService.getBooks(
        null,
        this.limit,
        0,
        this.search
      );
      this.books = filteredBooks.data;
      this.enrichBooks();
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }
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
  border-bottom-width: thin;
  border-bottom-style: solid;
  border-bottom-color: #e7dbbe;
}

.card:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #e7dbbe;
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
  background-color: #c47b2ee4;
  transform: scaleY(0);
  transition: all 0.5s;
  transform-origin: bottom;
}

.card:hover::after {
  transform: scaleY(1);
}

.c-details {
  font-weight: 300;
  font-size: 13px;
}

.icon {
  width: 150px;
  height: 150px;
  background-color: #eee;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 39px;
}
</style>