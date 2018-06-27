import { createLocalVue, mount } from '@vue/test-utils'
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
        {id: 't_ready', time: 300, sound: 'chime', status: 'ready'},
        {id: 't_active', time: 600, sound: 'whoosh', status: 'active'},
        {id: 't_paused', time: 600, sound: 'whoosh', status: 'paused'},
        {id: 't_completed', time: 600, sound: 'whoosh', status: 'completed'}
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
    const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
    expect(wrapper.html()).toContain('<span class="counter">00:05:00</span>')
  })

  describe('status watcher', () => {
    it('call setInterval when status become "active"', () => {
      const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_ready', data: {status: 'active'}})
      expect(setInterval).toBeCalled()
    })

    it('call clearInterval when status become "paused"', () => {
      const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_active', data: {status: 'paused'}})
      expect(clearInterval).toBeCalled()
    })

    it('call clearInterval when status become "completed"', () => {
      const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_active'} })
      wrapper.vm.$store.commit('setTimer', {id: 't_active', data: {status: 'completed'}})
      expect(clearInterval).toBeCalled()
    })
  })

  describe('controls', () => {
    it('visible when timers order set to "man"', () => {
      const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      const ctl = wrapper.find('.controls')
      expect(ctl.element.style.display).toBe('')
    })

    it('hidden when timers order set to "all"', () => {
      const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
      wrapper.vm.$store.commit('setOrder', 'all')
      const ctl = wrapper.find('.controls')
      expect(ctl.element.style.display).toBe('none')
    })

    describe('start/stop button', () => {
      it('display "Start" in "ready" state', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        expect(wrapper.find('.startStop').text()).toBe('Start')
      })

      it('display "Stop" in "active" state', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_active'} })
        expect(wrapper.find('.startStop').text()).toBe('Stop')
      })

      it('set status to "paused" when clicked in "active" state', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_active'} })
        const button = wrapper.find('.startStop')
        button.trigger('click')
        expect(wrapper.vm.status).toBe('paused')
      })

      it('become disabled when staus become "completed"', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_completed'} })
        const button = wrapper.find('.startStop')
        expect(button.attributes().disabled).toBe('disabled')
      })
    })

    describe('reset button', () => {
      it('disabled by default', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_ready'} })
        const button = wrapper.find('.reset')
        expect(button.attributes().disabled).toBe('disabled')
      })

      it('enabled if remaining time differs from nominal time', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_paused'} })
        const button = wrapper.find('.reset')
        wrapper.vm.remaining = 100
        expect(button.attributes().disabled).toBeUndefined()
      })

      it('disabled if timer active', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_active'} })
        const button = wrapper.find('.reset')
        wrapper.vm.remaining = 10
        expect(button.attributes().disabled).toBe('disabled')
      })

      it('enabled if timer paused and remaining time differs from nominal time', () => {
        const wrapper = mount(Timer, { store, localVue, propsData: {id: 't_paused'} })
        const button = wrapper.find('.reset')
        wrapper.vm.remaining = 100
        expect(button.attributes().disabled).toBeUndefined()
      })
    })
  })
})
