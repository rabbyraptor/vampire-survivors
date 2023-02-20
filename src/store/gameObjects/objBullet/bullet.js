const state = () => ({
  bullets: [],
  target: null,
});

// getters
const getters = {
  getBullets: (state) => state.bullets,
  getTarget: (state) => state.target,
};

// actions
const actions = {
  // === ADDING ===
  addBullet({ commit, getters, rootGetters }) {
    const gameIsPaused = rootGetters["game/getGameIsPaused"];
    if(gameIsPaused){
      return
    }

    const player = rootGetters["objPlayer/getPlayer"];

    if (!getters.getTarget) {
      return;
    }

    const id = crypto.randomUUID();
    const distanceX = getters.getTarget.x - player.position.x;
    const distanceY = getters.getTarget.y - player.position.y;
    const angle = Math.atan2(distanceY, distanceX);
    const xVelocity = Math.cos(angle) * player.stats.projectileSpeed;
    const yVelocity = Math.sin(angle) * player.stats.projectileSpeed;

    const bullet = {
      x: player.position.x,
      y: player.position.y,
      target: getters.getTarget,
      id,
      speed: player.stats.projectileSpeed,
      xVelocity,
      yVelocity,
      visibility: true,
      penetrationsLeft: player.stats.penetrationsLeft
    };
    commit("shootBullet", bullet);
  },

  // === UPDATING ===
  // A part of global update()
  updateBullets({ commit, dispatch, getters, rootGetters }) {
    const gameIsPaused = rootGetters["game/getGameIsPaused"];
    if(gameIsPaused){
      return
    }
     const player = rootGetters["objPlayer/getPlayer"];
    const enemies = rootGetters["globalEnemies/getEnemies"];
    const bullets = getters.getBullets;

    // Calculate the distance between the player and each enemy, and sort the enemies by distance
    const enemiesWithDistance = enemies.map((enemy) => {
      const distanceX = player.position.x - enemy.x;
      const distanceY = player.position.y - enemy.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      return { ...enemy, distance };
    });
    enemiesWithDistance.sort((a, b) => a.distance - b.distance);

    // Set the target property of the player to the closest enemy
    if (enemiesWithDistance.length > 0) {
      commit("setTarget", enemiesWithDistance[0]);
    }

    // Update the position of each bullet
    bullets.forEach(async (bullet) => {
      if (!bullet.target || !bullet.visibility) {
        return;
      }

      bullet.x += bullet.xVelocity;
      bullet.y += bullet.yVelocity;

      // Check for collisions with enemies
      enemies.forEach(async (enemy) => {
        if(enemy.health < 1) { return }
        const distance = Math.sqrt(
          (bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2
        );
        if (distance < 20) {
          bullet.penetrationsLeft--
          if(bullet.penetrationsLeft < 1){
            // Remove the bullet
            commit("destroyBullet", bullet);
          }
          // Damage and enemy
          return dispatch("globalEnemies/damageEnemy", enemy.id, { root: true }); //

          // Increase the score
          // this.score += 10;
        }
      });

      // Remove the bullet if it goes off the screen
      if (await dispatch("bulletIsOutOfBounds", bullet)) {
        commit("destroyBullet", bullet);
      }
    });
  },
  bulletIsOutOfBounds({ rootGetters }, bullet) {
    const { width, height } = rootGetters.getWindowSize
    return bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height;
  },
};

// mutations
const mutations = {
  shootBullet(state, bullet) {
    state.bullets.push(bullet);
  },
  destroyBullet(state, bullet) {
    bullet.visibility = false
    setTimeout(() => {
      state.bullets = state.bullets.filter(
        (bulletOnScreen) => bulletOnScreen.id !== bullet.id
      );
    }, 500);
  },
  setTarget(state, target) {
    state.target = target;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
