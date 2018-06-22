export default {
  getTimerById: state => id => state.timers.find(timer => timer.id === id)
}
