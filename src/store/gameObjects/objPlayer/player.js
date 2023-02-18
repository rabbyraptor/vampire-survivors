// initial state
const state = () => ({
    player: {
      position: {
        y: 0,
        x: 0
      },
      dimensions: {
        width: Math.round(148 * 0.5),
        height: Math.round(199 * 0.5)
      },
      stats: {
        damage: 1
      }
    }
  })
  
  // getters
  const getters = {
    getPlayer: state => state.player
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
    mutations
  }