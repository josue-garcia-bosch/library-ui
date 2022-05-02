<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>
<script>
export default {
  name: "HomeView",
  data() {
    return {
      content: "Welcome to the librarys",
    };
  },
  mounted() {
  },
};
</script>