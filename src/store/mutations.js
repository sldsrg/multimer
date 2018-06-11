export default {

  fromLocalStorage(state, value) {
    const store = localStorage.getItem('store')
    if (store) {
      state.timers = JSON.parse(store).timers
    }
  },

  addTimer(state, value) {
    state.timers.push(value)
  },

  setTime(state, {id, time}) {
    state.timers[id].time = time
  }
}
