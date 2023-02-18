<template>
    <div 
    :class="['enemy', enemy.type, enemy.vx < 0 ? 'left' : '']" 
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
  computed: {
    ...mapGetters({
      enemies: "globalEnemies/getEnemies",
    }),
    enemy() {
      return this.enemies.find((enemy) => enemy.id === this.id);
    },
    enemyStyles() {
      return `
      left: ${this.enemy.x}px;
      top: ${this.enemy.y}px;
      
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
</style>