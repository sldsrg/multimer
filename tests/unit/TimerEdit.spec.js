import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import TimerEdit from '@/components/TimerEdit'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer.vue component', () => {
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
