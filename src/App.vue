<template>
  <div id="app">
    <GameView />
  </div>
</template>

<script>
import GameView from "./components/GameView.vue";

export default {
  name: "App",
  components: {
    GameView,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
