<template>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-12">
        <div class="card p-3 py-4">
          <div class="text-center">
            <img
              src="https://microbiology.ucr.edu/media/421/download?attachment"
              width="100"
              class="rounded-circle"
            />
          </div>
          <div class="text-center mt-3">
            <span class="bg-secondary p-1 px-4 rounded text-white">{{
              currentUser.name
            }}</span>
            <h5 class="mt-2 mb-0">Email: {{ currentUser.email }}</h5>
            <div class="px-4 mt-1">
              <p class="fonts">Role: {{ currentUser.role.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProfileComponent",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.card {
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background: #ede8eedc;
}

.card:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #e1bee7;
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
  background-color: #8e24aa;
  transform: scaleY(0);
  transition: all 0.5s;
  transform-origin: bottom;
}

.card:hover::after {
  transform: scaleY(1);
}
</style>