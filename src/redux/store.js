import { createStore, applyMiddleware } from 'redux'
import { fork, all } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import rootReducers from './reducers'

import userSaga from './user/saga'
import rootChatSaga from './chat/saga'
import reminderSaga from './reminder/saga'
import announcementSaga from './announcement/saga'


function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(rootChatSaga),
    fork(reminderSaga),
    fork(announcementSaga),
  ])
}

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducers,
    applyMiddleware(sagaMiddleware, createLogger())
  )
  sagaMiddleware.run(rootSaga)

  return { store }
}