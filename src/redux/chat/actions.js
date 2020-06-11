import {
  GET_ROOM_START,
  GET_USER_MESSAGES_START,
  SEND_USER_MESSAGE_START,
  GET_ROOM_MESSAGES,
  GET_ROOM_MESSAGES_SUCCESS,
  SEND_MESSAGE,
  GET_ROOMS,
  GET_ROOMS_SUCCESS,
  CLEAR_MESSAGE,
  GET_ROOMS_CLEAR,
  REMOVE_PARTICIPANT_FROM_ROOM,
  EXIT_FROM_GROUP,
  ADD_PARTICIPANT_FROM_ROOM,
  ENTER_IN_ROOM,
  SHOW_MESSAGE_INFO,
} from '@constants/ActionTypes'

export const getUserRoomList = content => ({
  type: GET_ROOM_START,
  payload: content,
})

export const getUserMessage = content => ({
  type: GET_USER_MESSAGES_START,
  payload: content,
})

export const sendUserMessage = content => ({
  type: SEND_USER_MESSAGE_START,
  payload: content,
})

export const getRoomMessages = data => ({
  type: GET_ROOM_MESSAGES,
  payload: data,
})

export const getCurrentRoomMessages = roomId => ({
  type: GET_ROOM_MESSAGES_SUCCESS,
  roomId,
})

export const sendMessage = input => ({
  type: SEND_MESSAGE,
  payload: { input },
})

export const enterInRoom = ({ input, action }) => ({
  type: ENTER_IN_ROOM,
  payload: { input, action },
})

export const getRooms = (data) => ({
  type: GET_ROOMS,
  data,
})

export const getRoomSuccess = (data) => ({
  type: GET_ROOMS_SUCCESS,
})

export const getRoomsClear = () => ({
  type: GET_ROOMS_CLEAR,
})

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
})

export const removeParticipantFromRoom = id => ({
  type: REMOVE_PARTICIPANT_FROM_ROOM,
  payload: id,
})

export const addParticipantFromRoom = data => ({
  type: ADD_PARTICIPANT_FROM_ROOM,
  payload: data,
})

export const exitFromGroup = id => ({
  type: EXIT_FROM_GROUP,
  payload: id,
})

export const showMessageInfo = data => ({
  type: SHOW_MESSAGE_INFO,
  payload: data,
})