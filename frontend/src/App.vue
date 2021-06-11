<template>
  <v-app>
    <v-main v-if="mountedApp">
      <div class="main-app-body"></div>
      <Index/>
    </v-main>
  </v-app>
</template>

<script>
import Index from '@/components/Index';

export default {
  name: 'App',
  components: {
    Index
  },
  data: () => ({
    mountedApp: false
  }),
  mounted() {
    this.mountedApp = true;
  }
};
</script>

<style lang="sass">
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap')

  .main-app-body
    position: fixed
    width: 100vw
    height: 100vh
    background-color: url("assets/fondo-celeste.png")
    background-position: center center
    background-size: cover
    filter: brightness(1) opacity(.6) blur(1px)
    z-index: -1

  body,html
    height: 100%
    margin: 0
    padding: 0

</style>
