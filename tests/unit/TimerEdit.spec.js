import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'

import TimerEdit from '@/components/TimerEdit'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer.vue', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        timers: [{id: 't1', time: 300}]
      }
    })
  })

  it('renders timer`s data', () => {
    const wrapper = mount(TimerEdit, {
      store,
      localVue,
      propsData: {id: 't1'}
    })
    expect(wrapper.text()).toContain('Edit timer t1')
  })
})
