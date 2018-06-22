import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import Home from '@/components/Home'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Home.vue component', () => {
  let store
  let wrapper

  beforeEach(() => {
    const state = {
      timers: [
        {id: 't1', time: 300, sound: 'chime'},
        {id: 't2', time: 600, sound: 'whoosh'}
      ]
    }
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = mount(Home, {
      store,
      localVue
    })
  })

  it('contains "add" button', () => {
    const button = wrapper.find('.add')
    expect(button.text()).toBe('Add')
  })
})
