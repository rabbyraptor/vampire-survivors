<template>
<div>

  <div class="bullet" :style="`
  left: ${this.bullet.x}px;
  top: ${this.bullet.y}px; 
  background-image: url('${require('@/assets/sprites/projectiles/steelball1.png')}');`"
  />
  <canvas ref="bullet-trail" class="bullet-trail" :width="windowSize.width" :height="windowSize.height"></canvas>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      trailPositions: [],
      trailCtx: null,
      trailOpacity: 0.05,
      trailLength: null,
    };
  },
  props: {
    bulletId: {
      type: String,
      default: null,
    },
  },
  mounted() {
    // Get the canvas context and call the render method
    this.trailCtx = this.$refs["bullet-trail"].getContext("2d");
    this.trailLength = this.bullet.target.distance;
  },
  updated() {
    // Clear the canvas
    this.trailCtx.clearRect(
      0,
      0,
      this.windowSize.width,
      this.windowSize.height
    );

    // Subtract from the trail opacity
    this.trailOpacity -= 0.01 / this.trailLength;

    // Add the current bullet position to the trail
    this.trailPositions.push({ x: this.bullet.x, y: this.bullet.y });

    const trailGradient = this.trailCtx.createRadialGradient(
      this.bullet.x,
      this.bullet.y,
      0,
      this.bullet.x,
      this.bullet.y,
      this.trailLength
    );
    trailGradient.addColorStop(0, `rgba(255, 255, 255, ${this.trailOpacity})`);
    trailGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    this.trailCtx.beginPath();
    this.trailCtx.moveTo(this.bullet.x, this.bullet.y);
    this.trailPositions.forEach((position) => {
      const distanceFromBullet = Math.sqrt(
        Math.pow(this.bullet.x - position.x, 2) +
          Math.pow(this.bullet.y - position.y, 2)
      );
      const opacity = 1 - distanceFromBullet / this.trailPositions.length;
      this.trailCtx.globalAlpha = opacity;
      this.trailCtx.strokeStyle = trailGradient;
      this.trailCtx.globalCompositeOperation = "lighter";
      this.trailCtx.lineTo(position.x, position.y);
    });
    this.trailCtx.lineWidth = 8;
    this.trailCtx.stroke();

    if (this.trailPositions.length > this.trailLength) {
      this.trailPositions.shift();
    }
  },
  computed: {
    ...mapGetters({
      bullets: "objBullet/getBullets",
      windowSize: "getWindowSize",
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
  z-index: 2;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 50%;
}
.bullet-trail {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}
</style>
