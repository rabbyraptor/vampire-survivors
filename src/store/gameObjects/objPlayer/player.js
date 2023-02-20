const state = () => ({
    player: {
      position: {
        y: 250,
        x: 250
      },
      dimensions: {
        width: Math.round(148 * 0.5),
        height: Math.round(199 * 0.5)
      },
      stats: {
        movementSpeed: 5.5,
        damage: 5,
        projectileSpeed: 7,
        shootingSpeed: 1200,
        penetrationsLeft: 1
      }
    }
  })
  
  // getters
  const getters = {
    getPlayer: state => state.player,
    getPlayerDamage: state => state.player.stats.damage
  }
  
  // actions
  const actions = {
    
  }
  
  // mutations
  const mutations = {
    setPosition (state, playerPosition) {
      state.player.position = playerPosition
    },  
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }