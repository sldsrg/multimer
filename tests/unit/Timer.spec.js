import { mount } from '@vue/test-utils'
import Timer from '@/components/Timer'

describe('Timer.vue component', () => {
  let timer
  let wrapper

  beforeEach(() => {
    timer = { id: 'test', time: 300, sound: 'chime' }
    wrapper = mount(Timer, { propsData: timer })
  })

  it('renders correct time', () => {
    expect(wrapper.html()).toContain('<span class="counter">00:05:00</span>')
  })

  describe('start/stop button', () => {
    let button
    beforeEach(() => {
      button = wrapper.find('.startStop')
    })

    it('set intrvalId to undefined when clicked', () => {
      wrapper.vm.intervalId = 9
      button.trigger('click')
      expect(wrapper.vm.intervalId).toBeUndefined()
    })
  })

  describe('reset button', () => {
    let button
    beforeEach(() => {
      button = wrapper.find('.reset')
    })

    it('disabled by default', () => {
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled if remaining time differs from nominal time', () => {
      wrapper.vm.remaining = 0
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('disabled if timer active', () => {
      wrapper.vm.remaining = 10
      wrapper.vm.intervalId = 'dummy' // timer active
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled if timer stopped and remaining time differs from nominal time', () => {
      wrapper.vm.remaining = timer.time - 10
      wrapper.vm.intervalId = undefined // timer idle
      expect(button.attributes().disabled).toBeUndefined()
    })
  })
})
