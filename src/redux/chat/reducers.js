import {
  GET_ROOM_MESSAGES,
  GET_ROOM_MESSAGES_SUCCESS,
  GET_ROOM_MESSAGES_FAILURE,
  GET_ROOM_MESSAGES_CLEAR_ALL,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  CLEAR_MESSAGE,
  ENTER_IN_ROOM,
  ENTER_IN_ROOM_FAILURE,
  ENTER_IN_ROOM_SUCCESS,
  LOG_OUT,
  SHOW_MESSAGE_INFO,
} from '@constants/ActionTypes'
import { getMessagesFromRealm } from '../../realm/messageHelper';

const INIT_STATE = {
  loading: false,
  error: false,
  messages: [],
  success: false,
  sendMessageSuccess: false,
  messageInfo: false,
  messageInfoAudioIndex: null,
  messageToShow: {},
}

const chatReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ROOM_MESSAGES:
      return {
        ...state,
        loading: true,
        messages: getMessagesFromRealm(action.payload.room),
        success: false,
      }
    case GET_ROOM_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: getMessagesFromRealm(action.roomId),
        success: false,
      }
    case GET_ROOM_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
      }
    case ENTER_IN_ROOM:
      return {
        ...state,
        loading: true,
        // messages: [],
        success: false,
      }
    case ENTER_IN_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        // messages: action.data,
        success: false,
      }
    case ENTER_IN_ROOM_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
      }
    case GET_ROOM_MESSAGES_CLEAR_ALL:
      return {
        ...state,
        loading: false,
        error: false,
        success: false,
      }
    case SEND_MESSAGE:
      return {
        ...state,
        sendMessageFail: false,
        loading: true,
        sendMessageSuccess: false,
        message: {},
      }
    case SEND_MESSAGE_SUCCESS: {
      return {
        ...state,
        loading: false,
        sendMessageFail: false,
        sendMessageSuccess: true,
        message: action.data.data.addMessage,
      }
    }
    case SEND_MESSAGE_FAILURE: {
      return {
        ...state,
        loading: false,
        sendMessageSuccess: false,
        sendMessageFail: true,
      }
    }
    case CLEAR_MESSAGE:
      return {
        ...state,
        sendMessageFail: false,
        loading: false,
        sendMessageSuccess: false,
        message: {},
      }

    case LOG_OUT:
      return {
        ...INIT_STATE
      }

    case SHOW_MESSAGE_INFO:
      return {
        ...state,
				messageInfo: action.payload.messageInfo,
				messageInfoAudioIndex: action.payload.messageInfoAudioIndex,
				messageToShow: action.payload.messageToShow
      }

    default: return { ...state }
  }
}

export default chatReducer