import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import TimerEdit from '@/components/TimerEdit'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer.vue', () => {
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
    wrapper = mount(TimerEdit, {
      store,
      localVue,
      propsData: {id: 't1'}
    })
  })

  it('renders timer`s id', () => {
    expect(wrapper.text()).toContain('Edit timer t1')
  })
})
