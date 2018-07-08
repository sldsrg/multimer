import mutations from '@/store/mutations'

describe('mutations', () => {
  it('setOrder set timers order', () => {
    const state = { timers: [], order: 'man' }
    mutations.setOrder(state, 'all')
    expect(state.order).toBe('all')
  })

  describe('setGlobalStatus', () => {
    describe('when timers order is "all"', () => {
      it('called with "active" set all uncompleted timers to "active"', () => {
        const state = {
          timers: [{status: 'ready'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'active')
        expect(state.timers[0].status).toBe('active')
        expect(state.timers[1].status).toBe('active')
        expect(state.timers[2].status).toBe('completed')
      })

      it('called with "paused" set statuses of all active timers to "paused"', () => {
        const state = {
          timers: [{status: 'ready'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'paused')
        expect(state.timers[0].status).toBe('ready')
        expect(state.timers[1].status).toBe('paused')
        expect(state.timers[2].status).toBe('completed')
      })

      it('called with "ready" set all timers to "ready"', () => {
        const state = {
          timers: [{status: 'paused'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'ready')
        state.timers.forEach(t => expect(t.status).toBe('ready'))
      })
    })

    describe('when timers order is "seq"', () => {
      it('called with "active" activate first ready timer', () => {
        const state = {
          timers: [{status: 'completed'}, {status: 'ready'}, {status: 'paused'}],
          order: 'seq'
        }
        mutations.setGlobalStatus(state, 'active')
        expect(state.timers[0].status).toBe('completed')
        expect(state.timers[1].status).toBe('active')
        expect(state.timers[2].status).toBe('paused')
      })

      it('called with "active" activate first paused timer if no ready timers occur', () => {
        const state = {
          timers: [{status: 'completed'}, {status: 'paused'}, {status: 'paused'}],
          order: 'seq'
        }
        mutations.setGlobalStatus(state, 'active')
        expect(state.timers[0].status).toBe('completed')
        expect(state.timers[1].status).toBe('active')
        expect(state.timers[2].status).toBe('paused')
      })

      it('called with "paused" suspend first active timer', () => {
        const state = {
          timers: [{status: 'completed'}, {status: 'active'}, {status: 'ready'}],
          order: 'seq'
        }
        mutations.setGlobalStatus(state, 'paused')
        expect(state.timers[0].status).toBe('completed')
        expect(state.timers[1].status).toBe('paused')
        expect(state.timers[2].status).toBe('ready')
      })

      it('called with "ready" resets all timers', () => {
        const state = {
          timers: [{status: 'completed'}, {status: 'active'}, {status: 'paused'}],
          order: 'seq'
        }
        mutations.setGlobalStatus(state, 'ready')
        expect(state.timers[0].status).toBe('ready')
        expect(state.timers[1].status).toBe('ready')
        expect(state.timers[2].status).toBe('ready')
      })
    })
  })

  describe('startTimer', () => {
    it('set timer status to "active"', () => {
      const state = {
        timers: [
          {id: 't1', status: 'paused'},
          {id: 't2', status: 'ready'}
        ]
      }
      mutations.startTimer(state, 't1')
      expect(state.timers).toEqual([
        {id: 't1', status: 'active'},
        {id: 't2', status: 'ready'}
      ])
    })
  })

  describe('stopTimer', () => {
    it('set timer status to "paused"', () => {
      const state = {
        timers: [
          {id: 't1', status: 'active'},
          {id: 't2', status: 'ready'}
        ]
      }
      mutations.stopTimer(state, 't1')
      expect(state.timers).toEqual([
        {id: 't1', status: 'paused'},
        {id: 't2', status: 'ready'}
      ])
    })
  })

  describe('resetTimer', () => {
    it('set timer status to "ready" and remaining to nominal', () => {
      const state = {
        timers: [
          {id: 't1', status: 'paused', remaining: 300, time: 600},
          {id: 't2', status: 'ready'}
        ],
        order: 'man'
      }
      mutations.resetTimer(state, 't1')
      expect(state.timers[0].status).toBe('ready')
      expect(state.timers[0].remaining).toBe(600)
    })
  })

  describe('resetAllTimers', () => {
    it('set status to "ready" and remaining to nominal for all timers', () => {
      const state = {
        timers: [
          {id: 't1', status: 'paused', remaining: 300, time: 600},
          {id: 't2', status: 'completed', remaining: 0, time: 300}
        ],
        order: 'man'
      }
      mutations.resetAllTimers(state)
      expect(state.timers[0].status).toBe('ready')
      expect(state.timers[0].remaining).toBe(600)
      expect(state.timers[1].status).toBe('ready')
      expect(state.timers[1].remaining).toBe(300)
    })
  })

  describe('tick', () => {
    it('subtract one second from all active timers', () => {
      const state = {
        timers: [
          {status: 'active', remaining: 89},
          {status: 'ready', remaining: 60},
          {status: 'active', remaining: 20}
        ]
      }
      mutations.tick(state)
      expect(state.timers[0].remaining).toBe(88)
      expect(state.timers[1].remaining).toBe(60)
      expect(state.timers[2].remaining).toBe(19)
    })

    it('when remaining time equals to zero set timer`s status to "completed"', () => {
      const state = {
        timers: [
          {status: 'active', remaining: 1}
        ]
      }
      mutations.tick(state)
      expect(state.timers[0].remaining).toBe(0)
      expect(state.timers[0].status).toBe('completed')
    })

    it('when timers order is "seq" just completed timer activate next whaiting timer', () => {
      const state = {
        timers: [
          {status: 'active', remaining: 1},
          {status: 'ready', remaining: 1},
          {status: 'paused'}
        ],
        order: 'seq'
      }
      mutations.tick(state)
      expect(state.timers[0].status).toBe('completed')
      expect(state.timers[1].status).toBe('active')
      expect(state.timers[2].status).toBe('paused')
      mutations.tick(state)
      expect(state.timers[0].status).toBe('completed')
      expect(state.timers[1].status).toBe('completed')
      expect(state.timers[2].status).toBe('active')
    })
  })

  describe('setupTimer', () => {
    let state

    beforeEach(() => {
      state = {
        timers: [
          {id: 't1', time: 300, remaining: 100, sound: 'snd1'},
          {id: 't2', time: 200, remaining: 200, sound: 'snd2', status: 'ready'}
        ]
      }
    })

    it('update specified timer`s time', () => {
      mutations.setupTimer(state, {id: 't1', data: {time: 400}})
      expect(state.timers[0]).toEqual({id: 't1', time: 400, remaining: 100, sound: 'snd1'})
    })

    it('trim remaining time if needed', () => {
      mutations.setupTimer(state, {id: 't1', data: {time: 60}})
      expect(state.timers[0]).toEqual({id: 't1', time: 60, remaining: 60, sound: 'snd1'})
    })

    it('extend remaining time if needed', () => {
      mutations.setupTimer(state, {id: 't2', data: {time: 400}})
      expect(state.timers[1]).toEqual({id: 't2', time: 400, remaining: 400, sound: 'snd2', status: 'ready'})
    })

    it('update specified timer`s sound', () => {
      mutations.setupTimer(state, {id: 't1', data: {sound: 'test'}})
      expect(state.timers[0]).toEqual({id: 't1', time: 300, remaining: 100, sound: 'test'})
    })

    it('update specified timer`s id', () => {
      mutations.setupTimer(state, {id: 't1', data: {id: 't4'}})
      expect(state.timers[0]).toEqual({id: 't4', time: 300, remaining: 100, sound: 'snd1'})
    })
  })
})
