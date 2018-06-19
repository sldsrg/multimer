export default {

  fromLocalStorage(state, value) {
    const store = localStorage.getItem('store')
    if (store) {
      Object.assign(state, JSON.parse(store))
    }
  },

  addTimer(state, value) {
    if (!value.name) { value.name = `Timer ${state.timers.length + 1}`}
    state.timers.push(value)
  },

  setTimer(state, {name, timer}) {
    state.timers = state.timers.map(t => t.name === name ? {...t, ...timer} : t)
  },

  removeTimer(state, name) {
    state.timers = state.timers.filter(t => t.name !== name)
  }
}
