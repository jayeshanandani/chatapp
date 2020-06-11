import { put, takeEvery, all } from 'redux-saga/effects'

import { localClient } from '../../../App'

import {
  GET_ROOM_MESSAGES,
  GET_ROOM_MESSAGES_SUCCESS,
  GET_ROOM_MESSAGES_FAILURE,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  GET_ROOMS,
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAILURE,
  DELETE_MESSAGE,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILURE,
  ENTER_IN_ROOM_SUCCESS,
  ENTER_IN_ROOM_FAILURE,
  ENTER_IN_ROOM,
} from '@constants/ActionTypes'

import {
  getMessagesSchema, sendMessageMutation, getUserRoomsSchema, deleteMessageMutation, EnterInRoomMutation, LeaveRoomMutation,
} from '@graphql/messageSchema'
import { addRoomsToRealm, addRoomWiseMessageToRealm, appendRoomWiseMessageToRealm } from '../../realm/messageHelper'

async function getMessagesData(data) {
  return localClient.query({
    query: getMessagesSchema,
    variables: {
      input: data,
    },
    fetchPolicy: 'no-cache',
  }).then(async res => {
    await appendRoomWiseMessageToRealm(data.room, res.data.getUserRoomMessages);
    return res;
  })
    .catch((err) => {
      throw err
    })
}

async function sendMessageData(action) {
  const { input } = action.payload
  return localClient.mutate({
    mutation: sendMessageMutation,
    variables: {
      input,
    },
    optimisticResponse: {
      addMessage: { ...input, __typename: 'Message' },
    },
  }).then(res => res)
    .catch((err) => {
      throw err
    })
}

async function enterInRoom(action) {
  const { input, action: Action } = action.payload
  return localClient.mutate({
    mutation: Action === 'enter' ? EnterInRoomMutation : LeaveRoomMutation,
    variables: {
      input,
    },
  }).then(res => res)
    .catch((err) => {
      throw err
    })
}

async function deleteMessageData(action) {
  const { input } = action.payload
  return localClient.mutate({
    mutation: deleteMessageMutation,
    variables: {
      input,
    },
  }).then(res => res)
    .catch((err) => {
      throw err
    })
}

async function getRoomsData(action) {
  return localClient.query({
    query: getUserRoomsSchema,
    variables: { id: action.data },
    fetchPolicy: 'no-cache',
  }).then(async res => {
    console.log('get all rooms', res.data.getUserRooms);
    if (res?.data?.getUserRooms?.length > 0) {
      let isNew = action.data === '' ? true : false;
      await addRoomsToRealm(res.data.getUserRooms, isNew);
      await addRoomWiseMessageToRealm(res.data.getUserRooms);
      Promise.all(res.data.getUserRooms.map(item => {
        getMessagesData({ room: item.room, id: isNew ? '' : item?.message?.id })
      })).then(data => {}).catch((e) => {
        console.log('err in get all room messages', e);
        throw e
      })
    }
    return res
  })
  .catch((err) => {
    console.log('get all rooms', err);
    throw err
  })
}

function* getMessages(action) {
  try {
    const data = yield getMessagesData(action.payload);
    yield put({ type: GET_ROOM_MESSAGES_SUCCESS, roomId: action.payload.room })
  } catch (e) {
    yield put({ type: GET_ROOM_MESSAGES_FAILURE, e })
  }
}

function* sendMessage(action) {
  try {
    const data = yield sendMessageData(action)

    yield put({ type: SEND_MESSAGE_SUCCESS, data })
  } catch (e) {
    yield put({ type: SEND_MESSAGE_FAILURE, e })
  }
}

function* enterInRoomStart(action) {
  try {
    const data = yield enterInRoom(action)

    yield put({ type: ENTER_IN_ROOM_SUCCESS, data })
  } catch (e) {
    yield put({ type: ENTER_IN_ROOM_FAILURE, e })
  }
}

function* getRooms(action) {
  try {
    const data = yield getRoomsData(action);
    yield put({ type: GET_ROOMS_SUCCESS })
  } catch (e) {
    yield put({ type: GET_ROOMS_FAILURE, e })
  }
}

function* deleteMessageStart(action) {
  try {
    const data = yield deleteMessageData(action)
    yield put({ type: DELETE_MESSAGE_SUCCESS, data })
  } catch (e) {
    yield put({ type: DELETE_MESSAGE_FAILURE, e })
  }
}

function* getMessagesSaga() {
  yield takeEvery(GET_ROOM_MESSAGES, getMessages)
}

function* sendMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessage)
}

function* enterInRoomSaga() {
  yield takeEvery(ENTER_IN_ROOM, enterInRoomStart)
}

function* getRoomsSaga() {
  yield takeEvery(GET_ROOMS, getRooms)
}

function* deleteMessageSaga() {
  yield takeEvery(DELETE_MESSAGE, deleteMessageStart)
}

export default function* rootChatSaga() {
  yield all([getMessagesSaga(), sendMessageSaga(), getRoomsSaga(), deleteMessageSaga(), enterInRoomSaga()])
}