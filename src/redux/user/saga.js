import { put, takeEvery, all } from 'redux-saga/effects'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { request, PERMISSIONS } from 'react-native-permissions'
import Contacts from 'react-native-contacts'

import { localClient } from '../../../App'

import {
  addUserMutation,
  checkUserExistsMutation,
  getAllUserQuery,
  getUserInfo,
  updateUserInfo,
  createDeviceMutation,
  updateGroupMutation,
  getCareIdSuggestions,
} from '@graphql/userSchema'
import { addRoomMutation } from '@graphql/messageSchema'

import {
  GET_USER_ID,
  GET_USER_ID_SUCCESS,
  GET_USER_ID_FAILURE,
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  GET_ALL_USER_LIST_SUCCESS,
  GET_ALL_USER_LIST_FAILURE,
  GET_ALL_USER_LIST,
  ADD_ROOM_LIST,
  ADD_ROOM_LIST_SUCCESS,
  ADD_ROOM_LIST_FAILURE,
  SEND_TOKEN_SUCCESS,
  SEND_TOKEN_FAILURE,
  SEND_TOKEN,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_FAILURE,
  UPDATE_GROUP,
  UPDATE_USER_PROFILE_FAILURE,
  GET_SYSTEM_CONTACTS,
  GET_SYSTEM_CONTACTS_SUCCESS,
  GET_SYSTEM_CONTACTS_FAILURE,
  GET_CAREID,
  GET_CAREID_SUCCESS,
  GET_CAREID_FAILURE,
  CHECK_EMAIL_EXIST,
  CHECK_EMAIL_EXIST_SUCCESS,
  CHECK_EMAIL_EXIST_FAILURE
} from '@constants/ActionTypes'

async function getUser(action) {
  const { input } = action.payload
  return localClient.mutate({
    mutation: addUserMutation,
    variables: { input },
    fetchPolicy: 'no-cache',
  }).then(res => res).catch((err) => {
    throw err
  })
}

async function emailExist(action) {
  return localClient.mutate({
    mutation: checkUserExistsMutation,
    variables: { input: action.payload },
    fetchPolicy: 'no-cache',
  }).then(res => {
    return res;
  }).catch((err) => {
    throw err
  })
}

async function getCareId(action) {
  const { input } = action.payload
  return localClient.query({
    query: getCareIdSuggestions,
    variables: { ...input },
    fetchPolicy: 'no-cache',
  }).then(res => res)
    .catch((err) => {
      throw err
    })
}

async function getAllUser() {
  return localClient.query({
    query: getAllUserQuery,
    fetchPolicy: 'no-cache',
  }).then(res => res).catch((err) => {
    throw err
  })
}

async function getUserInfoData() {
  return localClient.query({
    query: getUserInfo,
    fetchPolicy: 'no-cache',
  }).then(res => {
    console.log('getUserInfoData res', res);
    return res;
  }).catch((err) => {
    console.log('getUserInfoData err', err);
    throw err
  })
}

async function updateUserInfoData(action) {
  const { input } = action.payload

  return localClient.mutate({
    mutation: updateUserInfo,
    variables: {
      input,
    },
    fetchPolicy: 'no-cache',
  }).then(res => res).catch((err) => {
    throw err
  })
}

function addRoomList(action) {
  const { input } = action.data

  return localClient.mutate({
    mutation: addRoomMutation,
    variables: {
      input,
    },
    fetchPolicy: 'no-cache',
  }).then(res => res).catch(err => {
    throw err
  })
}

function* getUserData(action) {
  try {
    const data = yield getUser(action)
    yield put({ type: GET_USER_ID_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_USER_ID_FAILURE, e })
  }
}

function* emailExistData(action) {
  try {
    const data = yield emailExist(action)
    yield put({ type: CHECK_EMAIL_EXIST_SUCCESS, data })
  } catch (e) {
    yield put({ type: CHECK_EMAIL_EXIST_FAILURE, e })
  }
}

function* getAllUserData() {
  try {
    const data = yield getAllUser()
    yield put({ type: GET_ALL_USER_LIST_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_ALL_USER_LIST_FAILURE, e })
  }
}

function* getCareIdData(action) {
  try {
    const data = yield getCareId(action)
    yield put({ type: GET_CAREID_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_CAREID_FAILURE, e })
  }
}

function* getUserInfoDetails() {
  try {
    const data = yield getUserInfoData()
    yield put({ type: GET_USER_INFO_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_USER_INFO_FAILURE, e })
  }
}

function* addRoomListData(action) {
  try {
    const data = yield addRoomList(action)
    if (data?.data?.addRoom) {
      yield put({ type: ADD_ROOM_LIST_SUCCESS, data })
    }
  } catch (e) {
    yield put({ type: ADD_ROOM_LIST_FAILURE, e })
  }
}

function sendTokenData(action) {
  const { input } = action.payload
  return localClient.mutate({
    mutation: createDeviceMutation,
    variables: {
      input,
    },
    fetchPolicy: 'no-cache',
  }).then(res => res)
    .catch(err => err)
}

async function updateGroupData(action) {
  const { input } = action.payload

  return localClient.mutate({
    mutation: updateGroupMutation,
    variables: {
      input,
    },
    fetchPolicy: 'no-cache',
  }).then(res => res).catch((err) => {
    throw err
  })
}

async function fetchSystemContacts() {
  try {
    var contactPermission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
      ios: PERMISSIONS.IOS.CONTACTS,
    })
    return new Promise((resolve, reject) => request(contactPermission).then(async (response) => {
      if (response === 'granted') {
        Contacts.getAll(async (err, contacts) => {
          await AsyncStorage.setItem('contactSynced', "true")
          resolve(contacts)
        })
      } else {
        reject({ err: 'denied' })
      }
    }).catch((err) => {
      console.log(err)
    })
    )
  } catch (err) {
    return err
  }
}

function* sendToken(action) {
  try {
    const data = yield sendTokenData(action)

    yield put({ type: SEND_TOKEN_SUCCESS, data })
  } catch (e) {
    yield put({ type: SEND_TOKEN_FAILURE, e })
  }
}


function* updateUserInfoDetails(action) {
  try {
    const data = yield updateUserInfoData(action)
    yield put({ type: UPDATE_USER_PROFILE_SUCCESS, data })
  } catch (e) {
    yield put({ type: UPDATE_USER_PROFILE_FAILURE, e })
  }
}

function* updateGroup(action) {
  try {
    const data = yield updateGroupData(action)
    yield put({ type: UPDATE_GROUP_SUCCESS, data: data?.data?.updateRoom })
  } catch (e) {
    yield put({ type: UPDATE_GROUP_FAILURE, e })
  }
}

function* fetchSystemContactsData() {
  try {
    const data = yield fetchSystemContacts()

    yield put({ type: GET_SYSTEM_CONTACTS_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_SYSTEM_CONTACTS_FAILURE, e })
  }
}

function* sendTokenSaga() {
  yield takeEvery(SEND_TOKEN, sendToken)
}

function* getUserDataSaga() {
  yield takeEvery(GET_USER_ID, getUserData)
}

function* emailExistDataSaga() {
  yield takeEvery(CHECK_EMAIL_EXIST, emailExistData)
}

function* getAllUserDataSaga() {
  yield takeEvery(GET_ALL_USER_LIST, getAllUserData)
}

function* getCareIdSaga() {
  yield takeEvery(GET_CAREID, getCareIdData)
}

function* getUserInfoSaga() {
  yield takeEvery(GET_USER_INFO, getUserInfoDetails)
}


function* updateUserInfoSaga() {
  yield takeEvery(UPDATE_USER_PROFILE, updateUserInfoDetails)
}

function* addRoomListDataSaga() {
  yield takeEvery(ADD_ROOM_LIST, addRoomListData)
}

function* updateGroupSaga() {
  yield takeEvery(UPDATE_GROUP, updateGroup)
}

function* fetchSystemContactsSaga() {
  yield takeEvery(GET_SYSTEM_CONTACTS, fetchSystemContactsData)
}

export default function* userSaga() {
  yield all([getUserDataSaga(), emailExistDataSaga(), getAllUserDataSaga(), getCareIdSaga(), getUserInfoSaga(), updateUserInfoSaga(), addRoomListDataSaga(), sendTokenSaga(), updateGroupSaga(), fetchSystemContactsSaga()])
}