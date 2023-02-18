<template>
  <div class="game-wrapper">
    <div class="game" ref="game">
      <!-- <div class="player" :style="{ left: playerPosition.x + 'px', top: playerPosition.y + 'px' }"></div> -->
      <ObjPlayer />
      <ObjBullet
      v-for="(bullet) in bullets"
      :key="bullet.id"
      :bulletId="bullet.id"
    />
      <ObjEnemy v-for="enemy in enemies" :key="enemy.id" :id="enemy.id" />
    </div>
  </div>
</template>

<script>
import ObjPlayer from "@/components/gameObjects/objPlayer.vue";
import ObjBullet from "@/components/gameObjects/objBullet.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ObjEnemy from "@/components/gameObjects/objEnemy.vue";

export default {
  components: { ObjPlayer, ObjBullet, ObjEnemy },
  data() {
    return {
      playerShootSpeed: 2000,
      fps: 1 / 60,
      bulletSpeed: 8,
      enemySpawnInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      player: "objPlayer/getPlayer",
      bullets: "objBullet/getBullets",
      enemies: "globalEnemies/getEnemies",
      enemyTypes: "globalEnemies/getEnemyTypes",
      enemySettings: "globalEnemies/getEnemySettings",
    }),
  },
  mounted() {
    this.setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // Begin spawning of enemies
    this.spawnInterval = setInterval(
      this.spawnEnemies,
      this.enemySettings.spawnSpeed
    );

    setInterval(this.updateGame, this.fps);
    //setInterval(this.startShooting, this.playerShootSpeed);
    this.startShooting();
    this.$refs.game.focus();
  },
  beforeUnmount() {
    clearInterval(this.spawnInterval);
  },
  methods: {
    ...mapActions({
      addBullet: "objBullet/addBullet",
      updateBullets: "objBullet/updateBullets",
      updateEnemies: "globalEnemies/updateEnemies",
    }),
    ...mapMutations({
      setWindowSize: "setWindowSize",
      spawnEnemies: "globalEnemies/spawnEnemies",
    }),

    // spawnEnemy() {},
    startShooting() {
      // const { x, y } = this.player.position;
      setInterval(this.addBullet, this.playerShootSpeed);
    },
    updateGame() {
      if (this.gameIsPaused()) {
        return;
      }
      this.updateEnemies();
      this.updateBullets(this.enemies);
    },

    gameIsPaused() {
      return !document.hasFocus();
    },
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.game-wrapper::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 100%;
  height: 100%;
  background-color: transparent;
  background-image: url("~@/assets/sprites/backgrounds/grass_2.png");
  background-repeat: repeat;
  background-size: 10%;
  filter: brightness(75%) grayscale(20%);
}
.game {
  position: relative;
}
/* .vampire {
  background-color: red;
}
.zombie {
  background-color: blue;
}
.werewolf {
  background-color: orange;
} */
</style>