import { shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer'

describe('Timer.vue', () => {
  it('renders props.time when passed', () => {
    const timer = { id: 'test', time: 300 }
    const wrapper = shallowMount(Timer, {
      propsData: timer
    })
    expect(wrapper.text()).toContain('5:00')
  })
})
