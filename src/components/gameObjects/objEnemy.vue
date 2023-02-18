<template>
    <div 
    :class="['enemy', enemy.type, enemy.vx < 0 ? 'left' : '', {'lost-health': lostHealth }]" 
    :style="enemyStyles + ' background-image: url(' + require('@/assets/sprites/enemies/blob/Blob1-128.png') + ')'">
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
      }, 60);
    },
  },
  destroyed() {
    console.log(this.enemy, "was destroyed!");
  },
  computed: {
    ...mapGetters({
      enemies: "globalEnemies/getEnemies",
    }),
    enemy() {
      return this.enemies.find((enemy) => enemy.id === this.id);
    },
    enemyHealth() {
      return this.enemy.health;
    },
    enemyStyles() {
      return `
      left: ${this.enemy.x}px;
      top: ${this.enemy.y}px;
       transition-property: filter;
        transition-duration: 60ms;
        transition-timing-function: ease-in;
      `;
    },
  },
};
</script>

<style scoped>
.enemy {
  position: absolute;
  background-position: center;
  background-size: contain;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
}
.left {
  transform: translate(-50%, -50%) scale(-1, 1);
}
.lost-health {
  transition-duration: 0ms !important;
  filter: brightness(250%) !important;
}
</style>