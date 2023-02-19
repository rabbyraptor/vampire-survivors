const state = () => ({
    game: {
        settings: {
            gameIsPaused: false
        }
    }
});

// getters
const getters = {
    getGameSettings: state => state.game.settings,
    getGameIsPaused: state => state.game.settings.gameIsPaused
};

// actions
const actions = {
};

// mutations
const mutations = {
    setGamePauseState(state, gamePauseState) {
        state.game.settings.gameIsPaused = gamePauseState
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
