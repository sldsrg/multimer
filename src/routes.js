import Home from './components/Home'
import TimerEdit from './components/TimerEdit'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/timers/new',
    name: 'NewTimer',
    component: TimerEdit,
    props: false
  },
  {
    path: '/timers/:id',
    name: 'ModifyTimer',
    component: TimerEdit,
    props: true
  }
]
