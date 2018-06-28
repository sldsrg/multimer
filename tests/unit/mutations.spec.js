import mutations from '@/store/mutations'

describe('mutations', () => {
  let state

  beforeEach(() => {
    state = {
      timers: [
        {id: 't1', time: 300, sound: 'chime', status: 'ready'},
        {id: 't2', time: 600, sound: 'whoosh', status: 'active'},
        {id: 't3', time: 200, sound: 'chime', status: 'completed'}
      ],
      order: 'man',
      status: 'ready'
    }
  })

  it('set timers order', () => {
    mutations.setOrder(state, 'all')
    expect(state.order).toBe('all')
  })

  describe('when timers order is "all"', () => {
    beforeEach(() => {
      state.order = 'all'
    })

    it('setGlobalStatus with "active" set statuses of all uncompleted timers to "active"', () => {
      mutations.setGlobalStatus(state, 'active')
      expect(state.timers[0].status).toBe('active')
      expect(state.timers[1].status).toBe('active')
      expect(state.timers[2].status).toBe('completed')
    })

    it('setGlobalStatus with "paused" set statuses of all active timers to "paused"', () => {
      mutations.setGlobalStatus(state, 'paused')
      expect(state.timers[0].status).toBe('ready')
      expect(state.timers[1].status).toBe('paused')
      expect(state.timers[2].status).toBe('completed')
    })
  })
})
