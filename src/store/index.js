import Vue from 'vue'
import Vuex from 'vuex'
import objPlayer from './gameObjects/objPlayer/player'
import objBullet from './gameObjects/objBullet/bullet'
import globalEnemies from './globals/globalEnemies'

// const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    objPlayer,
    objBullet,
    globalEnemies
  },
  // strict: debug,
  // plugins: debug ? [Vuex.createLogger()] : []
})




