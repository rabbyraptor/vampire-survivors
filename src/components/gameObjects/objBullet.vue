<template>
<div>
  <div v-if="bullet.visibility" class="bullet" :style="`
  left: ${this.bullet.x}px;
  top: ${this.bullet.y}px; 
  background-image: url('${require('@/assets/sprites/projectiles/steelball1.png')}');`"
  />
  <div v-else class="damage-done" :style="`top: ${lastTrailPosition.y}; left: ${lastTrailPosition.x};`">{{ this.bulletDamage }}</div>
  <canvas ref="bullet-trail" :class="!bullet.visibility ? 'fade-out' : ''" class="bullet-trail" :width="windowSize.width" :height="windowSize.height"></canvas>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      trailPositions: [],
      trailCtx: null,
      trailOpacity: 0.04,
      trailLength: null,
      bulletDamage: null,
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
    this.bulletDamage = this.bullet.damage;
  },
  updated() {
    // Subtract from the trail opacity
    this.trailOpacity -= 0.01 / this.trailLength;
    if (!this.bullet.visibility || this.trailLength < 20) {
      return;
    }

    // Clear the canvas
    this.trailCtx.clearRect(
      0,
      0,
      this.windowSize.width,
      this.windowSize.height
    );

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
      playerDamage: "objPlayer/getPlayerDamage",
      windowSize: "getWindowSize",
    }),
    bullet() {
      return this.bullets.find((bullet) => bullet.id === this.bulletId);
    },
    lastTrailPosition() {
      if (this.trailPositions.length < 1) {
        return {};
      }
      const { x, y } = this.trailPositions[this.trailPositions.length - 1];
      return { x, y };
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
.damage-done {
  position: absolute;
  z-index: 3;
  font-size: 13px;
  font-weight: 600;
  line-height: 12px;
  color: white;
  transform: translate(-50%, -50%);
  text-align: center;
  text-shadow: 1px 1px 0px rgba(30, 30, 30, 1);
  animation: jump-out 0.2s forwards ease-out;
}
@keyframes jump-out {
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -225%);
  }
}
.fade-out {
  animation: fadeout 0.4s forwards ease-out;
}
@keyframes fadeout {
  to {
    opacity: 0;
  }
}
</style>
