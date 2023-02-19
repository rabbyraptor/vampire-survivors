<template>
  <div class="game-wrapper">
    <div class="ui">
      <h1 class="fps-counter">{{ fpsAverage }} fps</h1>
      </div>
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
      bulletSpeed: 8,
      enemySpawnInterval: null,
      lastTimeToRender: 0,
      fpsAverage: 0,
      fpsHistory: [],
    };
  },
  computed: {
    ...mapGetters({
      gameIsPaused: "game/getGameIsPaused",
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
    this.lastTimeToRender = performance.now();
    window.requestAnimationFrame(this.updateGame);
    window.addEventListener("focus", () => {
      // Unpause the game
      this.setGamePauseState(false);
    });
    window.addEventListener("blur", () => {
      // Pause the game
      window.cancelAnimationFrame(this.updateGame);
      this.setGamePauseState(true);
    });

    // document.addEventListener("blur", this.handleVisibilityChange);
    this.$refs.game.focus();
  },
  beforeUnmount() {
    clearInterval(this.spawnInterval);
  },
  methods: {
    ...mapActions({
      updateBullets: "objBullet/updateBullets",
      spawnEnemies: "globalEnemies/spawnEnemies",
      updateEnemies: "globalEnemies/updateEnemies",
    }),
    ...mapMutations({
      setGamePauseState: "game/setGamePauseState",
      setWindowSize: "setWindowSize",
    }),
    updateGame() {
      const timeToRender = performance.now();
      const timeSinceLastRender = timeToRender - this.lastTimeToRender;
      /* if (elapsed < 16.7) {
        console.error(elapsed);

        // skip frame if it's been less than 16.7 ms (60 FPS)
        return;
      } */
      this.lastTimeToRender = timeToRender;

      // UPDATE FRAMES
      this.updateEnemies({ timeSinceLastRender });
      this.updateBullets({ timeSinceLastRender });

      // CALCULATE THE CURRENT FPS
      this.calculateFps(timeSinceLastRender);

      // CALL THE NEXT FRAME RENDER
      window.requestAnimationFrame(this.updateGame);
    },
    calculateFps(timeSinceLastRender) {
      // Calculate fps for current frame
      const fps = Math.round(1000 / timeSinceLastRender);
      this.fpsHistory.push(fps);

      if (this.fpsHistory.length > 30) {
        // Remove the oldest fps value in the array
        this.fpsHistory.shift();
      }
      // Calculate the sum of the fps values
      const sum = this.fpsHistory.reduce((total, fps) => total + fps, 0);
      // Calculate average fps by dividing the sum by the length
      this.fpsAverage = Math.round(sum / this.fpsHistory.length);
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
.ui {
  position: relative;
}
.game {
  position: relative;
}
.fps-counter {
  position: absolute;
  top: 0;
  right: 0;
  font-weight: normal;
  font-size: 15px;
  color: #333;
  padding: 2px 4px;
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