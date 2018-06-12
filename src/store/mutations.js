export default {

  fromLocalStorage(state, value) {
    const store = localStorage.getItem('store')
    if (store) {
      Object.assign(state, JSON.parse(store))
    }
  },

  addTimer(state, value) {
    state.timers.push(value)
  },

  setTimer(state, {id, timer}) {
    timer.name && (state.timers[id].name = timer.name.trim())
    timer.time && (state.timers[id].time = Number(timer.time))
    timer.sound && (state.timers[id].sound = timer.sound)
  }
}
