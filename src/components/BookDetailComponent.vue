<template>
  <div class="container mt-5">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card p-3 mb-2">
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
          </div>
          <div class="mt-5">
            <h3 class="heading">
              {{ book.title }}
              <hr />
            </h3>
            <h4>{{ book.category }}</h4>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <footer class="blockquote-footer">
                  {{ book.yearOfPublication }}
                </footer>
              </blockquote>
              <div class="mt-3">
                <span class="text1">{{ book.author }}</span>
              </div>
              <div class="mt-3">
                <button
                  @click="executeAccion()"
                  class="btn"
                  :class="[
                    accion.status == 'return' ? 'btn-danger' : 'btn-primary',
                  ]"
                >
                <font-awesome-icon icon="fa-arrow-left" />
                  {{ accion.status }}
                </button>

                <div v-if="showAdminBoard">
                  <hr />
                  <button @click="onEditBook" class="btn btn-info"> <font-awesome-icon icon="fa-pen-to-square" /> edit book</button>
                  <button @click="deleteBook" class="btn btn-danger"> <font-awesome-icon icon="fa-trash" />delete book</button>
                </div>
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
//import EditBookComponent from "../components/EditBookComponent";

export default {
  name: "BookDetailComponent",
  components: {
    // EditBookComponent,
  },
  data() {
    return {
      book: { imageURL: image },
      accion: { status: "loading" },
    };
  },
  methods: {
    async executeAccion() {
      switch (this.accion.status) {
        case "return": {
          const returnBook = await BookService.returnBook(this.book._id);
          console.log(returnBook);
          if (returnBook.status == 204) this.$router.go();
          else alert(returnBook.statusText);
          break;
        }
        case "borrow": {
          const borrowResult = await BookService.borrowBook(this.book._id);
          console.log(borrowResult);
          if (borrowResult.status == 204) this.$router.go();
          else alert(borrowResult.statusText);
          break;
        }
        default:
          console.log("no accion");
      }
    },
    async deleteBook(){
       const deleteResult = await BookService.deleteBookById(this.book._id);
          if (deleteResult.status == 204) this.$router.push('/books');
          else alert(deleteResult.statusText);
    },
    async getBookById() {
      let id = this.$route.params.bookId;
      const axiosResponse = await BookService.getBookById(id);
      this.book = axiosResponse.data;

      if (this.book.lent) {
        this.book.isLent = true;
        this.book.lentDetail = "lent";

        if (this.book.lent._id == this.currentUser._id)
          this.accion = { status: "return", enable: true };
        else this.accion = { status: "lent", enable: false };
      } else {
        this.book.isLent = false;
        this.book.lentDetail = "available";
        this.accion = { status: "borrow", enable: true };
      }

      if (!this.book.imageURL) this.book.imageURL = image;
    },
    onEditBook() {
      this.$router.push("/edit-book/" + this.book._id);
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
  created() {
    this.getBookById();
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
.icon {
  width: 200px;
  height: 200px;
}
.card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 3px 3px solid #d2dae3;
  box-shadow: 0px 9px 20px 0px #d2dae3;
  box-shadow: 0px 9px 20px 0px #bdc3ca;
}
</style>