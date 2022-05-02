<template>
  <div class="container mt-5">
    <div class="row" v-if="showAdminBoard">
      <button type="button" class="btn btn-outline-success">
        <router-link to="/create-book" class="nav-link"
          >Create book</router-link
        >
      </button>
    </div>
    <div class="row mt-5">
      <form class="form-inline" role="form">
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0"
            >Rows per page:</label
          >
          <select id="pref-perpage" v-model="limit" class="form-control">
            <option selected="selected" value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0">Search:</label>
          <input
            type="text"
            v-model="search"
            @keyup="searchListener()"
            class="form-control input-sm"
            id="pref-search"
          />
        </div>
        <div class="form-group">
          <label class="filter-col" style="margin-right: 0" for="pref-orderby"
            >Order by:</label
          >
          <select id="pref-orderby" v-model="sort" class="form-control">
            <option selected="selected" value="title">title</option>
            <option value="-title">desc title</option>
            <option value="category">category</option>
            <option value="-category">desc category</option>
            <option value="author">author</option>
            <option value="-author">desc author</option>
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
            <span class="text-info font-weight-light" v-if="showAdminBoard"> {{ book.isLent ? book.lent.name : '' }}</span>
            <span class="text-info font-weight-light" v-if="!showAdminBoard && showIfIamTheBorrower(book) "> to me </span
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
  name: "UserBookView",
  data() {
    return {
      books: [],
      limit: 10,
      sort: null,
      page: 0,
      search: null,
    };
  },
  methods: {
    showIfIamTheBorrower(book){
      return book.lent && book.lent._id === this.currentUser._id       
    },
    async getInitialBooks() {
      const initialBooks = await BookService.getBooks(
        this.sort,
        this.limit,
        this.page,
        this.search
      );
      this.books = initialBooks.data;
      this.enrichBooks();
    },
    onLoadBook(id) {
      this.$router.push("/books/" + id);
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
    async applyFilters() {
      //restart pages
      this.page = 0;
      const filteredBooks = await BookService.getBooks(
        this.sort,
        this.limit,
        this.page,
        this.search
      );
      this.books = filteredBooks.data;
      this.enrichBooks();
    },
    async searchListener() {
      //restart pages
      this.page = 0;
      const filteredBooks = await BookService.getBooks(
        this.sort,
        this.limit,
        this.page,
        this.search
      );
      this.books = filteredBooks.data;
      this.enrichBooks();
    },
    getNextBook() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          this.isLoading = true;
          this.page = ++this.page;

          BookService.getBooks(this.sort, this.limit, this.page, this.search)
            .then((moreBooks) => {
              this.books.push(...moreBooks.data);
              this.enrichBooks();
              this.isLoading = false;
            })
            .catch((error) => {
              console.error(error);
              this.isLoading = false;
            });
        }
      };
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.role) {
        return this.currentUser.role.name == "admin";
      }
      return false;
    },
  },
  beforeMount() {
    this.getInitialBooks();
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }

    this.getNextBook();
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