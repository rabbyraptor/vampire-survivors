const state = () => ({
    enemies: [],
    settings: {
      maxEnemies: 10,
      spawnInterval: null,
      spawnSpeed: 1500,
    },
    enemyId: 0,
    enemyTypes: [
      {
        type: "blob",
        health: 1,
        speed: 1.75,
        // sprite: blobPath,
      },
    ],
  })
  
  // getters
  const getters = {
    getEnemies: state => state.enemies,
    getEnemyTypes: state => state.enemyTypes,
    getEnemySettings: state => state.settings
  }
  
  // actions
  const actions = {
    updateEnemies({getters, rootGetters }) {
      const player = rootGetters['objPlayer/getPlayer']
      getters.getEnemies.forEach((enemy) => {
        const dx = player.position.x - enemy.x;
        const dy = player.position.y - enemy.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        enemy.vx = (dx / distance) * enemy.speed;
        enemy.vy = (dy / distance) * enemy.speed;
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        if (enemy.health < 1) {
          this.destroyEnemy(enemy.id);
        }
      });
    },
    damageEnemy({state, commit, rootGetters }, enemyId) {
      const enemy = state.enemies.find((enemy) => enemy.id === enemyId);
      if(!enemy){ return }
      enemy.health -= rootGetters['objPlayer/getPlayer'].stats.damage;
      if (enemy.health < 1) {
        commit('destroyEnemy', enemyId);
      }
    },
  }
  
  // mutations
  const mutations = {
    spawnEnemies (state) {
      /* if (this.gameIsPaused()) {
        return;
      } */
      if (state.enemies.length < state.settings.maxEnemies) {
        const randomEnemy =
          state.enemyTypes[Math.floor(Math.random() * state.enemyTypes.length)];
        const enemy = {
          id: state.enemyId++,
          type: randomEnemy.type,
          x: Math.floor(Math.random() * window.innerWidth),
          y: Math.floor(Math.random() * window.innerHeight),
          vx: 0,
          vy: 0,
          health: randomEnemy.health,
          ...randomEnemy,
        };
        state.enemies.push(enemy);
      }
    },
    destroyEnemy(state, enemyId) {
      state.enemies = state.enemies.filter(
        (enemyOnScreen) => enemyOnScreen.id !== enemyId
      );
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }