import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import mutations from '@/store/mutations'
import Home from '@/components/Home'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Home.vue component', () => {
  let wrapper

  beforeEach(() => {
    jest.useFakeTimers()
    const state = {
      timers: [
        {id: 't1', time: 300, remaining: 300, sound: 'chime', status: 'ready'},
        {id: 't2', time: 600, remaining: 600, sound: 'whoosh', status: 'ready'}
      ],
      order: 'man'
    }
    const store = new Vuex.Store({ state, getters, mutations })
    wrapper = shallowMount(Home, { store, localVue })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('contains "Add another timer" link', () => {
    const button = wrapper.find('.add')
    expect(button.text()).toBe('Add another timer')
  })

  it('when timers order set to "man" renders no additional controls', () => {
    const ctl = wrapper.find('.globalControls')
    expect(ctl.element.style.display).toBe('none')
  })

  it('when timers order set to "all" renders additional controls', () => {
    wrapper.vm.$store.commit('setOrder', 'all')
    const ctl = wrapper.find('.globalControls')
    expect(ctl.element.style.display).toBe('')
  })

  describe('status watcher', () => {
    it('call setInterval when global status become "active"', () => {
      wrapper.vm.$store.commit('startTimer', 't1')
      expect(setInterval).toBeCalled()
    })

    it('call clearInterval when global status become not "active"', () => {
      wrapper.vm.$store.commit('startTimer', 't1')
      expect(clearInterval).not.toBeCalled()
      wrapper.vm.$store.commit('stopTimer', 't1')
      expect(clearInterval).toBeCalled()
    })
  })

  it('call tick every second when global status is active', () => {
    wrapper.vm.tick = jest.fn()
    wrapper.vm.$store.commit('startTimer', 't1')
    jest.advanceTimersByTime(5000)
    expect(wrapper.vm.tick).toHaveBeenCalledTimes(5)
  })

  describe('global start/stop button', () => {
    let button

    beforeEach(() => {
      wrapper.vm.$store.commit('setOrder', 'all')
      button = wrapper.find('.globalStartStop')
    })

    it('enabled when status "ready"', () => {
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('display "Start" when status "ready"', () => {
      expect(button.text()).toBe('Start')
    })

    it('enabled when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('display "Stop" when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.text()).toBe('Stop')
    })

    it('set status to "paused" if clicked when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      button.trigger('click')
      expect(wrapper.vm.status).toBe('paused')
    })

    it('enabled when status "paused"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'paused')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('disabled when staus "completed"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      expect(button.attributes().disabled).toBe('disabled')
    })
  })

  describe('global reset button', () => {
    let button

    beforeEach(() => {
      wrapper.vm.$store.commit('setOrder', 'all')
      button = wrapper.find('.globalReset')
    })

    it('disabled when status "ready"', () => {
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('disabled when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled when status "paused"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active') // ready to paused don't work
      wrapper.vm.$store.commit('setGlobalStatus', 'paused')
      expect(wrapper.vm.$store.getters.getGlobalStatus).toBe('paused')
      expect(wrapper.find('.globalReset').attributes().disabled).toBeUndefined()
    })

    it('enabled when status "completed"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      expect(wrapper.vm.$store.getters.getGlobalStatus).toBe('completed')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('set status to "ready" if clicked', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      button.trigger('click')
      expect(wrapper.vm.status).toBe('ready')
    })
  })
})
