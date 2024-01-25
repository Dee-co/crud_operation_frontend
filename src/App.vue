<template>
  <v-app>
    <v-main class="main_container">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
<style>
.main_container{
  background: rgb(121, 241, 195);
  background: linear-gradient(135deg, #008aff, #86d472);
}
</style>
