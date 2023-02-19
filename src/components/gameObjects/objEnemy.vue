<template>
<div>
    <div
      :class="[
        'enemy',
        enemy.type,
        { 'lost-health': lostHealth },
      ]"
      :style="
        enemyStyles +
        (enemyHealth > 0
          ? ' background-image: url(' +
            require('@/assets/sprites/enemies/blob/Blob1-128.png') +
            ')'
          : '')
      "
    >
    </div>
    <div v-show="enemyHealth < 1" class="cloud" :style="`left: ${enemy.x}px; top: ${enemy.y}px`"></div>
    <p v-show="enemyHealth < 1" class="deathcry" :style="`left: ${enemy.x}px; top: ${enemy.y}px`">{{  }}</p>
    <div v-show="enemyHealth < 1" class="xp-animation" :style="`left: ${enemy.x}px; top: ${enemy.y}px`">
        <p style="width: max-content">10 XP</p>
    </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      lostHealth: false,
    };
  },
  watch: {
    enemyHealth() {
      this.lostHealth = true;
      setTimeout(() => {
        this.lostHealth = false;
      }, 30);
    },
  },
  destroyed() {
    // console.log(this.enemy, "was destroyed!");
  },
  computed: {
    ...mapGetters({
      player: "objPlayer/getPlayer",
      enemies: "globalEnemies/getEnemies",
    }),
    getRandomDeathCry() {
      const deathCries = [
        "AEE!",
        "HUEE!",
        "YAO!",
        "DAH!",
        "IDONTWANNADIE!",
        "GOD DAMMIT!",
        "ASS!",
        "OUCH!",
        "OOF!",
        "ICANTBELIEVEYOUVEDONETHIS",
      ];
      const deathCry =
        deathCries[Math.floor(Math.random() * deathCries.length)];
      return deathCry;
    },
    enemy() {
      return this.enemies.find((enemy) => enemy.id === this.id);
    },
    enemyHealth() {
      return this.enemy.health;
    },
    enemyStyles() {
      return `
      top: -20px;
      left: -20px;
      width: ${this.enemy.dimensions.width}px;
      height: ${this.enemy.dimensions.height}px;
      transform: translate(${this.enemy.x}px, ${this.enemy.y}px) ${
        this.enemy.x > this.player.position.x ? "scale(-1, 1)" : ""
      };
       transition-property: filter;
        transition-duration: 0ms;
        transition-timing-function: ease-in;
      `;
    },
  },
  methods: {},
};
</script>

<style scoped>
.enemy {
  position: absolute;
  z-index: 2;
  background-position: center;
  background-size: contain;
  transition: transform 0.5s ease-out;
  transform: translate(-50%, -50%);
}
.lost-health {
  transition-duration: 0ms !important;
  filter: brightness(250%) !important;
}
.cloud {
  position: absolute;
  z-index: -100;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  background-image: url("~@/assets/sprites/effects/cloud1.png");
  background-position: center;
  background-size: contain;
  animation: rotate 0.5s linear forwards;
}
@keyframes rotate {
  from {
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) rotate(35deg) scale(1.5);
    opacity: 0;
  }
}
.deathcry {
  position: absolute;
  z-index: -100;
  transform: translate(-50%, -50%);
  font-size: 13px;
  font-family: sans-serif;
  font-weight: 900;
  color: darkred;
  opacity: 0.5;
  text-shadow: 1px 1px 1px rgba(80, 80, 80, 0.7);
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s forwards;
}
.xp-animation {
  position: absolute;
  z-index: -100 !important; /* Hide UI element behind everything else */
  transform: translate(-50%, -50%);
  font-family: sans-serif;
  font-weight: bold;
  font-size: 10px;
  color: white;
  animation-name: bottom-to-top;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
  mix-blend-mode: soft-light;
}
@keyframes bottom-to-top {
  from {
    transform: translate(-50%, -50%) scale(0.1);
    opacity: 0.8;
  }
  to {
    transform: translate(-50%, -1000%) scale(8);
    opacity: 0;
  }
}
@keyframes shake {
  0% {
    translate: (1px, 1px);
    rotate: 0deg;
  }
  10% {
    translate: -1px, -2px;
    rotate: -1deg;
  }
  20% {
    translate: -3px, 0px;
    rotate: 1deg;
  }
  30% {
    translate: 3px, 2px;
    rotate: 0deg;
  }
  40% {
    translate: 1px, -1px;
    rotate: 1deg;
  }
  50% {
    translate: -1px, 2px;
    rotate: -1deg;
  }
  60% {
    translate: -3px, 1px;
    rotate: 0deg;
  }
  70% {
    translate: 3px, 1px;
    rotate: -1deg;
  }
  80% {
    translate: -1px, -1px;
    rotate: 1deg;
  }
  90% {
    translate: 1px, 2px;
    rotate: 0deg;
  }
  100% {
    translate: 1px, -2px;
    rotate: -1deg;
  }
}
</style>
