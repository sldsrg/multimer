import getters from '@/store/getters'

describe('getters', () => {
  describe('when timers order is "all"', () => {
    it('getGlobalStatus active if at least one timer active', () => {
      const state = {
        timers: [{status: 'ready'}, {status: 'active'}, {status: 'completed'}],
        order: 'all'
      }
      expect(getters.getGlobalStatus(state)).toBe('active')
    })

    it('getGlobalStatus paused if at least one timer paused', () => {
      const state = {
        timers: [{status: 'completed'}, {status: 'paused'}, {status: 'completed'}],
        order: 'all'
      }
      expect(getters.getGlobalStatus(state)).toBe('paused')
    })

    it('getGlobalStatus ready if all timers ready', () => {
      const state = {
        timers: [{status: 'ready'}, {status: 'ready'}, {status: 'ready'}],
        order: 'all'
      }
      expect(getters.getGlobalStatus(state)).toBe('ready')
    })

    it('getGlobalStatus completed if all timers completed', () => {
      const state = {
        timers: [{status: 'completed'}, {status: 'completed'}, {status: 'completed'}],
        order: 'all'
      }
      expect(getters.getGlobalStatus(state)).toBe('completed')
    })
  })
})
