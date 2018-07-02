import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import mutations from '@/store/mutations'
import Timer from '@/components/Timer'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer.vue component', () => {
  let store

  beforeEach(() => {
    jest.useFakeTimers()
    const state = {
      timers: [
        {id: 't_ready', remaining: 300, time: 300, sound: 'chime', status: 'ready'},
        {id: 't_active', remaining: 2, time: 600, sound: 'whoosh', status: 'active'},
        {id: 't_paused', remaining: 300, time: 600, sound: 'whoosh', status: 'paused'},
        {id: 't_completed', remaining: 0, time: 600, sound: 'whoosh', status: 'completed'}
      ],
      order: 'man'
    }
    store = new Vuex.Store({
      state,
      getters,
      mutations
    })
  })

  it('renders correct time', () => {
    const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
    expect(wrapper.html()).toContain('<span class="counter">00:05:00</span>')
  })

  it('mounted with saved in store value for remaining', () => {
    const wrapper = shallowMount(Timer, {store, localVue, propsData: {id: 't_active'}})
    expect(wrapper.vm.remaining).toBe(2)
  })

  it('save remaining in store when unmounted', () => {
    const wrapper = shallowMount(Timer, {store, localVue, propsData: {id: 't_active'}})
    wrapper.vm.tick()
    wrapper.destroy()
    expect(store.state.timers[1].remaining).toBe(1)
  })

  describe('status watcher', () => {
    it('call setInterval when status become "active"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_ready', data: {status: 'active'}})
      expect(setInterval).toBeCalled()
    })

    it('call clearInterval when status become "paused"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_active', data: {status: 'paused'}})
      expect(clearInterval).toBeCalled()
    })

    it('set status to completed and play sound when time is over', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.playSound = jest.fn()
      HTMLMediaElement.prototype.play = jest.fn() // still necessary despite stubbing playSound
      jest.advanceTimersByTime(2000)
      expect(wrapper.vm.remaining).toBe(0)
      expect(wrapper.vm.playSound).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.status).toBe('completed')
    })

    it('call clearInterval when status become "completed"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_active', data: {status: 'completed'}})
      expect(clearInterval).toBeCalled()
    })
  })

  describe('controls', () => {
    it('visible when timers order set to "man"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      const ctl = wrapper.find('.controls')
      expect(ctl.element.style.display).toBe('')
    })

    it('hidden when timers order set to "all"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      wrapper.vm.$store.commit('setOrder', 'all')
      const ctl = wrapper.find('.controls')
      expect(ctl.element.style.display).toBe('none')
    })

    describe('start/stop button', () => {
      it('display "Start" in "ready" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        expect(wrapper.find('.startStop').text()).toBe('Start')
      })

      it('display "Stop" in "active" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
        expect(wrapper.find('.startStop').text()).toBe('Stop')
      })

      it('set status to "paused" when clicked in "active" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
        const button = wrapper.find('.startStop')
        button.trigger('click')
        expect(wrapper.vm.status).toBe('paused')
      })

      it('disabled when staus "completed"', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_completed'} })
        const button = wrapper.find('.startStop')
        expect(button.attributes().disabled).toBe('disabled')
      })
    })

    describe('reset button', () => {
      it('disabled when status "ready"', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        const button = wrapper.find('.reset')
        expect(button.attributes().disabled).toBe('disabled')
      })

      it('disabled when status "active"', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
        const button = wrapper.find('.reset')
        expect(button.attributes().disabled).toBe('disabled')
      })

      it('enabled when status "paused"', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_paused'} })
        const button = wrapper.find('.reset')
        expect(button.attributes().disabled).toBeUndefined()
      })

      it('enabled when status "completed"', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_completed'} })
        const button = wrapper.find('.reset')
        expect(button.attributes().disabled).toBeUndefined()
      })

      it('set status to "ready" when clicked', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_completed'} })
        const button = wrapper.find('.reset')
        button.trigger('click')
        expect(wrapper.vm.status).toBe('ready')
      })
    })
  })
})
