<template>
  <div class="container mt-5">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div class="card shadow-lg w-50">
        <div class="text-center">
            <img
              src="https://microbiology.ucr.edu/media/421/download?attachment"
              width="90 "
              class="rounded-circle"
            />
          </div>
        <div class="card-body p-3">
          <h1 class="fs-4 card-title fw-bold mb-4 text-center">login</h1>
          <Form @submit="handleLogin" :validation-schema="schema">
            <div class="form-group">
              <label for="username">Email</label>
              <Field name="username" type="text" class="form-control" />
              <ErrorMessage name="username" class="alert-danger" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <Field name="password" type="password" class="form-control" />
              <ErrorMessage name="password" class="alert-danger" />
            </div>
            <div class="form-group">
              <button class="btn btn-success   btn-block" :disabled="loading">
                <span
                  v-show="loading"
                  class="spinner-border text-primary spinner-border-sm"
                ></span>
                <span>Login</span>
              </button>
            </div>
            <div class="form-group">
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
            </div>
            <div class="p-3 d-flex flex-row justify-content-center align-items-center"> <span>don´t have an account? </span> <router-link to="/register" class="text-decoration-none ml-2">Register</router-link> </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "LoginComponent",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("email is required")
        .email("insert valid email format"),
      password: yup.string().required("password is required"),
    });
    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;
      this.$store.dispatch("auth/login", user).then(
        () => this.$router.push("/profile"),
        (error) => {
          this.loading = false;
          this.message = error.message || error.toString();
        }
      );
    },
  },
};
</script>
<style scoped>
</style>