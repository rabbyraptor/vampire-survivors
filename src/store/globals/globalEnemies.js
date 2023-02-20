const state = () => ({
  enemies: [],
  settings: {
    maxEnemies: 20,
    spawnInterval: null,
    spawnSpeed: 1600,
  },
  enemyId: 0,
  enemyTypes: [
    {
      type: "blob",
      health: 2,
      speed: 100, // In pixels per second
      damage: 1,
      dimensions: {
        width: 40,
        height: 40
      }
      // sprite: blobPath,
    },
  ],
});

// getters
const getters = {
  getEnemies: (state) => state.enemies,
  getEnemyTypes: (state) => state.enemyTypes,
  getEnemySettings: (state) => state.settings,
};

// actions
const actions = {
  // Based on an invterval
  spawnEnemies({state, commit, rootGetters}) {
    const gameIsPaused = rootGetters["game/getGameIsPaused"];
    if(gameIsPaused){
      return
    }

    if (state.enemies.length < state.settings.maxEnemies) {
      const randomEnemy =
        state.enemyTypes[Math.floor(Math.random() * state.enemyTypes.length)];

    // Randomly select which side of the screen to spawn the enemy on
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    if (side === 0) { // Spawn on top edge
      x = Math.floor(Math.random() * window.innerWidth);
      y = -randomEnemy.dimensions.height;
    } else if (side === 1) { // Spawn on right edge
      x = window.innerWidth + randomEnemy.dimensions.width;
      y = Math.floor(Math.random() * window.innerHeight);
    } else if (side === 2) { // Spawn on bottom edge
      x = Math.floor(Math.random() * window.innerWidth);
      y = window.innerHeight + randomEnemy.dimensions.height;
    } else { // Spawn on left edge
      x = -randomEnemy.dimensions.width;
      y = Math.floor(Math.random() * window.innerHeight);
    }

      const enemy = {
        id: state.enemyId++,
        type: randomEnemy.type,
        x,
        y,
        vx: 0,
        vy: 0,
        health: randomEnemy.health,
        ...randomEnemy,
      };
      commit('addEnemy', enemy);
    }
  },

  // A part of global update()
  updateEnemies({ getters, rootGetters }, { timeSinceLastRender }) {
    const gameIsPaused = rootGetters["game/getGameIsPaused"];
    if(gameIsPaused){
      return
    }
     const player = rootGetters["objPlayer/getPlayer"];
  getters.getEnemies.forEach((enemy) => {
    // Calculate the distance between the enemy and the player
    const dx = player.position.x - enemy.x;
    const dy = player.position.y - enemy.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const { speed } = enemy;
    const maxDistancePerFrame = speed * timeSinceLastRender / 1000;

    if (distance <= maxDistancePerFrame) {
      enemy.x = player.position.x;
      enemy.y = player.position.y;
    } else {
      const ratio = maxDistancePerFrame / distance;
      enemy.x += dx * ratio;
      enemy.y += dy * ratio;
    }
  });
  },
  damageEnemy({ state, commit, /* dispatch */ rootGetters }, enemyId) {
    const enemy = state.enemies.find((enemy) => enemy.id === enemyId);
    if (!enemy) {
      return;
    }
    enemy.health -= rootGetters["objPlayer/getPlayer"].stats.damage;
    if (enemy.health < 1) {
      // dispatch("playDeathAnimation", enemy);
      commit("destroyEnemy", enemy);
    }
  },
};

// mutations
const mutations = {
  addEnemy(state, enemy){
    state.enemies.push(enemy)
  },
  destroyEnemy(state, enemy) {
    enemy.damage = 0;
    enemy.speed = 0;
    setTimeout(() => {
      state.enemies = state.enemies.filter(
        (enemyOnScreen) => enemyOnScreen.id !== enemy.id
      );
    }, 500);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
