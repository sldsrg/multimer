import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import mutations from '@/store/mutations'
import Timer from '@/components/Timer'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer.vue component', () => {
  let wrapper
  let store

  beforeEach(() => {
    const state = {
      timers: [
        {id: 't1', time: 300, sound: 'chime', status: 'ready'},
        {id: 't2', time: 600, sound: 'whoosh', status: 'ready'}
      ]
    }
    store = new Vuex.Store({
      state,
      getters,
      mutations
    })
    wrapper = mount(Timer, {
      store,
      localVue,
      propsData: {id: 't1'}
    })
  })

  it('renders correct time', () => {
    expect(wrapper.html()).toContain('<span class="counter">00:05:00</span>')
  })

  it('call setInterval when timer become active', () => {
    wrapper.vm.$store.commit('setTimer', {id: 't1', data: {status: 'active'}})
    expect(wrapper.vm.intervalId).toBeDefined()
  })

  it('call clearInterval when timer paused', () => {
    wrapper.vm.remaining = 10
    wrapper.vm.intervalId = 12345 // timer active
    wrapper.vm.$store.commit('setTimer', {id: 't1', data: {status: 'paused'}})
    expect(wrapper.vm.intervalId).toBeUndefined()
  })

  it('call clearInterval when timer completed', () => {
    wrapper.vm.remaining = 0
    wrapper.vm.intervalId = 12345 // timer active
    wrapper.vm.$store.commit('setTimer', {id: 't1', data: {status: 'completed'}})
    expect(wrapper.vm.intervalId).toBeUndefined()
  })

  describe('start/stop button', () => {
    let button
    beforeEach(() => {
      button = wrapper.find('.startStop')
    })

    it('set intrvalId to undefined when clicked in active state', () => {
      wrapper.vm.intervalId = 9
      button.trigger('click')
      expect(wrapper.vm.intervalId).toBeUndefined()
    })

    it('become disabled when timer completed', () => {
      wrapper.vm.remaining = 0
      expect(button.attributes().disabled).toBe('disabled')
    })
  })

  describe('reset button', () => {
    let button
    beforeEach(() => {
      button = wrapper.find('.reset')
    })

    it('disabled by default', () => {
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled if remaining time differs from nominal time', () => {
      wrapper.vm.remaining = 0
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('disabled if timer active', () => {
      wrapper.vm.remaining = 10
      wrapper.vm.intervalId = 12345 // timer active
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled if timer stopped and remaining time differs from nominal time', () => {
      wrapper.vm.remaining = 10
      wrapper.vm.intervalId = undefined // timer ready
      expect(button.attributes().disabled).toBeUndefined()
    })
  })
})
