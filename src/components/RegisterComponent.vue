<template>
  <div class="container mt-5">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div class="card shadow-lg w-50">
          <div class="text-center">
            <img
              :src="image"
              width="150"
              class="rounded-circle"
            />
          </div>
        <div class="card-body p-3">
          <h1 class="fs-4 card-title fw-bold mb-4">Register</h1>
          <Form @submit="handleRegister" :validation-schema="schema">
            <div v-if="!successful">
              <div class="form-group">
                <label for="username">Name</label>
                <Field name="username" type="text" class="form-control" />
                <ErrorMessage name="username" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <Field name="email" type="email" class="form-control" />
                <ErrorMessage name="email" class="alert-warning" />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <Field name="password" type="password" class="form-control" />
                <ErrorMessage name="password" class="alert-warning" />
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="loading">
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  Register
                </button>
              </div>
              <div
                class="
                  p-3
                  d-flex
                  flex-row
                  justify-content-center
                  align-items-center
                "
              >
                <span>Already have an account? </span>
                <router-link to="/login" class="text-decoration-none ml-2"
                  >Login</router-link
                >
              </div>
            </div>
            <div class="form-group">
              <div v-if="message" :class="[successful ? 'alert-success' : 'alert-danger']" class="alert" role="alert">
                {{ message }}
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
import image from "../assets/logo.png";
import * as yup from "yup";
export default {
  name: "RegisterComponent",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("name is required!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(5, "Must be at least 5 characters!"),
    });
    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      image: image
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      this.$store.dispatch("auth/register", user).then(
        () => {
          this.message = "Register sucessfull";
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message = error.message || error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
  },
};
</script>
<style scoped>
</style>