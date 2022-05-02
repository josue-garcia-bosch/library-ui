<template>
  <div class="container mt-5">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div class="card shadow-lg w-50">
        <div class="card-body p-3">
          <h1 class="fs-4 card-title fw-bold mb-4">Edits Book</h1>
          <Form @submit="updateBok" :validation-schema="schema">
            <div v-if="!successful">
              <div class="form-group">
                <label for="title">Title</label>
                <Field v-model="currentBook.title" name="title" type="text" class="form-control" />
                <ErrorMessage name="title" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="category">Category</label>
                <Field v-model="currentBook.category" name="category" type="text" class="form-control" />
                <ErrorMessage name="category" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="author">Author</label>
                <Field v-model="currentBook.author" name="author" type="text" class="form-control" />
                <ErrorMessage name="author" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="yearOfPublication">yearOfPublication</label>
                <Field
                  name="yearOfPublication"
                  v-model="currentBook.yearOfPublication"
                  type="number"
                  class="form-control"
                />
                <ErrorMessage name="yearOfPublication" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="imageURL">imageURL</label>
                <Field v-model="currentBook.imageURL" name="imageURL" type="text" class="form-control" />
                <ErrorMessage name="imageURL" class="alert-warning" />
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="loading">
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  Update
                </button>
              </div>
              <div class="form-group">
                <div v-if="message" class="alert alert-danger" role="alert">
                  {{ message }}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import BookService from "../services/book.service";

export default {
  name: "EditBookComponent",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      yearOfPublication: yup
        .number()
        .required("year Of Publication is required!"),
        author: yup.string().required("author is required!"),
      title: yup.string().required("title is required!"),
      category: yup.string(),
      imageURL: yup.string().url("this format is not correct"),
    });
    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      currentBook:{},
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
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
  methods: {
      async getBookById() {
        let id = this.$route.params.id;
        const axiosResponse = await BookService.getBookById(id);
        this.currentBook = axiosResponse.data;
      },
    async updateBok(book) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      try {
        const newBook = await BookService.updateBook(this.currentBook._id, book);

        this.message = `created  ${newBook.data.title} sucessfull`;
        this.successful = true;
        this.loading = false;
        this.$router.push("/books");
      } catch (error) {
        this.message = error.message || error.toString();
        this.successful = false;
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
</style>