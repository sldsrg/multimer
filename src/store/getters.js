export default {
  getTimerById: state => id => state.timers.find(timer => timer.id === id),
  getGlobalStatus(state) {
    let ready = true
    let paused = false
    let completed = true
    for (const timer of state.timers) {
      if (timer.status === 'active') return 'active'
      if (timer.status === 'paused') paused = true
      if (timer.status !== 'ready') ready = false
      if (timer.status !== 'completed') completed = false
    }
    if (paused) return 'paused'
    if (ready) return 'ready'
    if (completed) return 'completed'
  }
}
