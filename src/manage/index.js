import { requests } from '@/request/requests'
import store from '@/store'
import user from './user'

export default {
  $requests: requests,
  $store: store,
  user
}
