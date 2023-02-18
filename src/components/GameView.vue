<template>
  <div class="game-wrapper">
    <div class="game" ref="game">
      <!-- <div class="player" :style="{ left: playerPosition.x + 'px', top: playerPosition.y + 'px' }"></div> -->
      <ObjPlayer :target="target" />
      <ObjBullet
      v-for="(bullet) in bullets"
      :key="bullet.id"
      :x="bullet.x"
      :y="bullet.y"
    />
      <div v-for="enemy in enemies" :key="enemy.id" :class="['enemy', enemy.type]" :style="{ left: enemy.x + 'px', top: enemy.y + 'px' }"></div>
    </div>
  </div>
</template>

<script>
import ObjPlayer from "@/components/gameObjects/objPlayer.vue";
import ObjBullet from "@/components/gameObjects/objBullet.vue";
import { mapGetters } from "vuex";

export default {
  components: { ObjPlayer, ObjBullet },
  data() {
    return {
      enemies: [],
      bullets: [],
      enemyTypes: [
        { type: "vampire", health: 1 },
        { type: "zombie", health: 2 },
        { type: "werewolf", health: 3 },
      ],
      spawnInterval: null,
      spawnSpeed: 1500,
      playerShootSpeed: 2000,
      maxEnemies: 10,
      enemyId: 0,
      fps: 1 / 60,
      target: null,
      bulletSpeed: 8,
    };
  },
  mounted() {
    this.spawnInterval = setInterval(this.spawnEnemy, this.spawnSpeed);
    setInterval(this.updateGame, this.fps);
    setInterval(this.startShooting, this.playerShootSpeed);
    this.$refs.game.focus();
  },
  beforeUnmount() {
    clearInterval(this.spawnInterval);
  },
  methods: {
    spawnEnemy() {
      if (this.gameIsPaused()) {
        return;
      }
      if (this.enemies.length < this.maxEnemies) {
        const randomEnemy =
          this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        const enemy = {
          id: this.enemyId++,
          type: randomEnemy.type,
          x: Math.floor(Math.random() * window.innerWidth),
          y: Math.floor(Math.random() * window.innerHeight),
          vx: 0,
          vy: 0,
          health: randomEnemy.health,
        };
        this.enemies.push(enemy);
      }
    },
    addBullet() {
      if (!this.target) {
        return;
      }

      const id = crypto.randomUUID();
      const distanceX = this.target.x - this.player.position.x;
      const distanceY = this.target.y - this.player.position.y;
      const angle = Math.atan2(distanceY, distanceX);
      const xVelocity = Math.cos(angle) * this.bulletSpeed;
      const yVelocity = Math.sin(angle) * this.bulletSpeed;

      this.bullets.push({
        x: this.player.position.x,
        y: this.player.position.y,
        target: this.target,
        id,
        speed: this.bulletSpeed,
        xVelocity,
        yVelocity,
      });
    },
    startShooting() {
      const { x, y } = this.player.position;
      setInterval(this.addBullet(x + 25, y + 25), this.playerShootSpeed);
    },
    bulletIsOutOfBounds(bullet) {
      return bullet.x < 0 || bullet.x > 1920 || bullet.y < 0 || bullet.y > 1080;
    },
    updateGame() {
      if (this.gameIsPaused()) {
        return;
      }
      this.updateEnemies();
      this.updateBullets();
    },
    updateEnemies() {
      this.enemies.forEach((enemy) => {
        const dx = this.player.position.x - enemy.x;
        const dy = this.player.position.y - enemy.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const speed = 2;
        enemy.vx = (dx / distance) * speed;
        enemy.vy = (dy / distance) * speed;
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        if (enemy.health < 1) {
          this.destroyEnemy(enemy.id);
        }
      });

      // Calculate the distance between the player and each enemy, and sort the enemies by distance
      const enemiesWithDistance = this.enemies.map((enemy) => {
        const distanceX = this.player.position.x - enemy.x;
        const distanceY = this.player.position.y - enemy.y;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );
        return { ...enemy, distance };
      });
      enemiesWithDistance.sort((a, b) => a.distance - b.distance);

      // Set the target property of the player to the closest enemy
      if (enemiesWithDistance.length > 0) {
        this.target = enemiesWithDistance[0];
      }
    },
    updateBullets() {
      // Update the position of each bullet
      this.bullets.forEach((bullet) => {
        if (!bullet.target) {
          return;
        }

        bullet.x += bullet.xVelocity;
        bullet.y += bullet.yVelocity;

        // Check for collisions with enemies
        this.enemies.forEach((enemy) => {
          const distance = Math.sqrt(
            (bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2
          );
          if (distance < 20) {
            // Remove the bullet
            this.destroyBullet(bullet);
            // Damage and enemy
            this.damageEnemy(enemy.id); //

            // Increase the score
            this.score += 10;
          }
        });

        // Remove the bullet if it goes off the screen
        if (this.bulletIsOutOfBounds(bullet)) {
          this.destroyBullet(bullet);
        }
      });
    },
    destroyBullet(bullet) {
      this.bullets = this.bullets.filter(
        (bulletOnScreen) => bulletOnScreen.id !== bullet.id
      );
    },
    damageEnemy(enemyId) {
      const enemy = this.enemies.find((enemy) => enemy.id === enemyId);
      enemy.health -= this.player.stats.damage;
      if (enemy.health < 1) {
        this.destroyEnemy(enemyId);
      }
    },
    destroyEnemy(enemyId) {
      this.enemies = this.enemies.filter(
        (enemyOnScreen) => enemyOnScreen.id !== enemyId
      );
    },
    gameIsPaused() {
      return !document.hasFocus();
    },
  },
  computed: {
    ...mapGetters({
      player: "objPlayer/getPlayer",
    }),
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
.enemy {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.vampire {
  background-color: red;
}
.zombie {
  background-color: blue;
}
.werewolf {
  background-color: orange;
}
</style>