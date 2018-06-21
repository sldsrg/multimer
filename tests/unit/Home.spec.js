import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import Home from '@/components/Home'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Home.vue component', () => {
  let store
  let wrapper

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        timers: [
          {id: 't1', time: 300, sound: 'chime'},
          {id: 't2', time: 600, sound: 'whoosh'}
        ]
      }
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
