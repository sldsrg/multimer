export default {
  getTimerById: state => id => state.timers.find(timer => timer.id === id),
  getGlobalStatus(state) {
    if (state.order === 'all') {
      let ready = true
      let completed = true
      for (const timer of state.timers) {
        if (timer.status === 'active') return 'active'
        if (timer.status === 'paused') return 'paused'
        if (timer.status !== 'ready') ready = false
        if (timer.status !== 'completed') completed = false
      }
      if (ready) return 'ready'
      if (completed) return 'completed'
    }
    return ''
  }
}
