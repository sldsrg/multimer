import { createLocalVue, mount } from '@vue/test-utils'
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
        {id: 't1', time: 300, sound: 'chime', status: 'ready'},
        {id: 't2', time: 600, sound: 'whoosh', status: 'ready'}
      ],
      order: 'man'
    }
    const store = new Vuex.Store({
      state,
      getters,
      mutations
    })
    wrapper = mount(Home, { store, localVue, propsData: {} })
  })

  it('contains "add" button', () => {
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
})
