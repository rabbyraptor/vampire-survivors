import Vue from 'vue'
import Vuex from 'vuex'
import objPlayer from './gameObjects/objPlayer/player'

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
    objPlayer
  },
  // strict: debug,
  // plugins: debug ? [Vuex.createLogger()] : []
})




