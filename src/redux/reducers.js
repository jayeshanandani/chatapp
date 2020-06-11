import { combineReducers } from 'redux'

import user from './user/reducers'
import chatReducer from './chat/reducers'
import reminderReducer from './reminder/reducers'
import announcementReducer from './announcement/reducers'

import { loadingReducer } from './common/loadingReducer'
import { errorReducer } from './common/errorReducer'
import { successReducer } from './common/successReducer'

const reducers = combineReducers({
  user,
  chat: chatReducer,
  reminder: reminderReducer,
  announcement: announcementReducer,
  loading: loadingReducer,
  error: errorReducer,
  success: successReducer,
})

export default reducers