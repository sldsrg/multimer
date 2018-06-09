import { shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'

describe('Timer.vue', () => {
  it('renders props.time when passed', () => {
    const time = 300
    const wrapper = shallowMount(Timer, {
      propsData: { time }
    })
    expect(wrapper.text()).toContain('5:00')
  })
})
