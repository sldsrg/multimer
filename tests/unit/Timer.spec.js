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

  it('renders correct nominal time', () => {
    const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_paused'} })
    expect(wrapper.html()).toContain('<span>t_paused (00:10:00)</span>')
  })

  it('renders correct remaining time', () => {
    const wrapper = shallowMount(Timer, {store, localVue, propsData: {id: 't_paused'}})
    expect(wrapper.html()).toContain('<span class="counter">00:05:00</span>')
  })

  describe('status watcher', () => {
    it('set status to completed and play sound when time is over', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.playSound = jest.fn()
      wrapper.vm.$store.commit('tick')
      wrapper.vm.$store.commit('tick')
      expect(wrapper.vm.playSound).toHaveBeenCalledTimes(1)
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

    it('hidden when timers order set to "seq"', () => {
      const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      wrapper.vm.$store.commit('setOrder', 'seq')
      const ctl = wrapper.find('.controls')
      expect(ctl.element.style.display).toBe('none')
    })

    describe('start/stop button', () => {
      it('display "Start" in "ready" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        expect(wrapper.find('.startStop').text()).toBe('Start')
      })

      it('display "Start" in "paused" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_paused'} })
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

      it('set status to "active" when clicked in "ready" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        const button = wrapper.find('.startStop')
        button.trigger('click')
        expect(wrapper.vm.status).toBe('active')
      })

      it('set status to "active" when clicked in "paused" state', () => {
        const wrapper = shallowMount(Timer, { store, localVue, propsData: {id: 't_paused'} })
        const button = wrapper.find('.startStop')
        button.trigger('click')
        expect(wrapper.vm.status).toBe('active')
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
