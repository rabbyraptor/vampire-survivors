<template>
  <div class="player" ref="player" :style="playerStyles" tabindex="0"></div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  mounted() {
    // Set the initial position of the player element on the page
    // this.$refs.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
    const fps = 1 / 60;
    setInterval(this.updatePlayerPosition, fps); //

    // Set up a listener for the 'keydown' event to detect when the player moves
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.startShooting();
  },
  updated() {
    // Update the background position of the player element to show the next frame of the animation
    this.$refs.player.style.backgroundPosition = `${
      -this.frame * this.player.dimensions.width
    }px 0`;
  },
  data() {
    return {
      playerX: 250, // The x-coordinate of the player's position
      playerY: 250, // The y-coordinate of the player's position
      frame: 0, // The current frame of the animation
      intervalId: null, // The ID of the interval that updates the animation
      keysPressed: {},
      playerWalkDirection: "right",
    };
  },
  computed: {
    ...mapGetters({
      player: "objPlayer/getPlayer",
    }),
    playerStyles() {
      return `
      left: ${this.playerX}px; 
      top: ${this.playerY}px; 
      width: ${this.player.dimensions.width}px; 
      height: ${this.player.dimensions.height}px;
      transform: translate(-50%, -50%) scale(${
        this.playerWalkDirection === "left" ? -1 : 1
      }, 1);
      `;
    },
  },
  watch: {
    playerY() {
      this.setPlayerPosition({ x: this.playerX, y: this.playerY });
    },
    playerX() {
      this.setPlayerPosition({ x: this.playerX, y: this.playerY });
    },
  },
  methods: {
    ...mapActions({
      addBullet: "objBullet/addBullet",
    }),
    ...mapMutations({
      setPlayerPosition: "objPlayer/setPosition",
    }),
    handleKeyUp(event) {
      this.keysPressed[event.key] = false;
    },
    handleKeyDown(event) {
      this.keysPressed[event.key] = true;
    },
    updatePlayerPosition() {
      // Move the player when the user presses the arrow keys
      if (this.keysPressed["w"]) {
        this.playerY -= this.player.stats.movementSpeed;
        this.startAnimation();
      }
      if (this.keysPressed["a"]) {
        this.playerX -= this.player.stats.movementSpeed;
        this.playerWalkDirection = "left";
        this.startAnimation();
      }
      if (this.keysPressed["s"]) {
        this.playerY += this.player.stats.movementSpeed;
        this.startAnimation();
      }
      if (this.keysPressed["d"]) {
        this.playerX += this.player.stats.movementSpeed;
        this.playerWalkDirection = "right";
        this.startAnimation();
      } else if (
        !this.keysPressed["w"] &&
        !this.keysPressed["a"] &&
        !this.keysPressed["s"] &&
        !this.keysPressed["s"]
      ) {
        this.stopAnimation();
      }
    },
    startShooting() {
      // const { x, y } = this.player.position;
      setInterval(this.addBullet, this.player.stats.shootingSpeed);
    },
    startAnimation() {
      if (this.intervalId) {
        return;
      }
      this.intervalId = setInterval(() => {
        this.frame = (this.frame + 1) % 5; // There are 5 frames in the animation
      }, 120);
    },
    stopAnimation() {
      // Stop the animation by clearing the interval and resetting the frame to the first frame of the animation
      clearInterval(this.intervalId);
      this.intervalId = null;
      //this.frame = 0;
    },
  },
  beforeDestroy() {
    // Stop the animation and remove the event listener when the player is destroyed
    this.stopAnimation();
    window.removeEventListener("keydown", this.handleKeyDown);
  },
};
</script>

<style scoped>
.player {
  position: absolute;
  z-index: 1;
  /* transform: translate(-50%, -50%); */
  background-color: transparent;
  background-image: url("~@/assets/sprites/man_walking/man_walking_trans.png");
  background-size: calc(740px * 0.5) calc(199px * 0.5); /* The sprite is 6 frames wide */
}
</style>
