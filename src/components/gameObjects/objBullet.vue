<template>
  <div class="bullet" :style="`
  left: ${this.bullet.x}px;
  top: ${this.bullet.y}px; 
  background-image: url('${require('@/assets/sprites/projectiles/steelball1.png')}');`"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    bulletId: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      bullets: "objBullet/getBullets",
    }),
    bullet() {
      return this.bullets.find((bullet) => bullet.id === this.bulletId);
    },
  },
};
</script>

<style>
.bullet {
  position: absolute;
  width: 32px;
  height: 32px;
  transform: translate(-50%, -50%);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 50%;
}
</style>