import _ from 'lodash'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import {
  UPDATE_STORED_USER,
  LOG_OUT,
  SIGN_UP_START,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_CLEAR,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  CHECK_VERIFICATION_CODE_START,
  CHECK_VERIFICATION_CODE_SUCCESS,
  CHECK_VERIFICATION_CODE_FAILURE,
  UPDATE_USER_ATTRIBUTES_START,
  UPDATE_USER_ATTRIBUTES_SUCCESS,
  UPDATE_USER_ATTRIBUTES_FAILURE,
  FALSE_FLAGS_IN_USER,
  CREATE_USER_PASSWORD_START,
  CREATE_USER_PASSWORD_SUCCESS,
  CREATE_USER_PASSWORD_FAILURE,
  GET_USER_ID,
  GET_USER_ID_SUCCESS,
  GET_USER_ID_FAILURE,
  CHECK_EMAIL_EXIST,
  CHECK_EMAIL_EXIST_SUCCESS,
  CHECK_EMAIL_EXIST_FAILURE,
  CHECK_EMAIL_EXIST_CLEAR,
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
  GET_ALL_USER_LIST,
  GET_ALL_USER_LIST_SUCCESS,
  GET_ALL_USER_LIST_FAILURE,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_CLEAR,
  ADD_ROOM_LIST_CLEAR,
  ADD_ROOM_LIST,
  ADD_ROOM_LIST_SUCCESS,
  ADD_ROOM_LIST_FAILURE,
  SEND_TOKEN, SEND_TOKEN_SUCCESS, SEND_TOKEN_FAILURE,
  UPDATE_GROUP,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_FAILURE,
  UPDATE_GROUP_CLEAR,
  SIGN_IN_CLEAR,
  UPDATE_USER_PROFILE_FAILURE,
  GET_SYSTEM_CONTACTS_CLEAR,
  GET_SYSTEM_CONTACTS_FAILURE,
  GET_SYSTEM_CONTACTS_SUCCESS,
  GET_SYSTEM_CONTACTS,
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_CLEAR,
  STORE_SELECTED_ROOM_START,
  STORE_SELECTED_ROOM_SUCCESS,
  STORE_SELECTED_ROOM_FAILURE,
  STORE_SELECTED_ROOM_CLEAR,
  FORGOT_PASSWORD_START,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  GET_MEDIA,
  GET_MEDIA_CLEAR,
  GET_ROOMS,
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAILURE,
  GET_ROOMS_CLEAR,
  REMOVE_PARTICIPANT_FROM_ROOM,
  GET_USER_INFO_CLEAR,
  EXIT_FROM_GROUP,
  ADD_PARTICIPANT_FROM_ROOM,
  DELETE_MESSAGE,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILURE,
  GET_CAREID,
  GET_CAREID_SUCCESS,
  GET_CAREID_FAILURE,
  GET_ALL_USER_LIST_CLEAR,
  CHECK_VERIFICATION_CODE_CLEAR,
  CHECK_FOR_APP_CONTACTS,
  SOCKET_CONNECTION,
} from '@constants/ActionTypes'
import {getMyRoom, sortRoomByDate, filterMediaFromRealm} from '../../realm/messageHelper'

const INIT_STATE = {
  userData: {},
  cognitoUser: {},
  loading: false,
  data: '',
  media: [],
  rooms: [],
  allUserData: [],
  allUserInContact: [],
  storedUser: {},
  success: false,
  userInfoFromLogin: '',
  signUpUserDetails: '',
  signInUserDetails: '',
  signUpSuccess: false,
  signInSuccess: false,
  verificationResponse: '',
  codeVerified: false,
  updateUserWithFullName: false,
  userUpdateSuccess: false,
  addRoomSuccess: false,
  checkUserExistSuccess: false,
  socketStatus: false,
  userExist: null,
  myRoom: {}
}

const profileReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SOCKET_CONNECTION:
      return {
        ...state,
        socketStatus: action.data,
      };
    case SIGN_UP_START:
      return {
        ...state,
        flagError: false,
        signUploading: true,
        errorMessage: '',
      }
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpUserDetails: action.data,
        signUploading: false,
        errorMessage: '',
        flagError: false,
      }
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUploading: false,
        errorMessage: action.data.message,
        flagError: true,
      }
    case SIGN_UP_CLEAR:
      return {
        ...state,
        signUploading: false,
        errorMessage: '',
        flagError: false,
      }
    case SIGN_IN_START:
      return {
        ...state,
        userInfoFromLogin: [],
        signInSuccess: false,
        signInUserDetails: '',
        loading: true,
        page: '',
      }
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        signInUserDetails: action.data.user,
        signInSuccess: true,
        loading: false,
        flagError: false,
        rooms: [],
        allUserData: [],
        userData: {},
        cognitoUser: action.data.loginUser,
        page: action.page,
      }
    case SIGN_IN_FAILURE:
      return {
        ...state,
        signUpSuccess: false,
        signInSuccess: false,
        loading: false,
        flagError: true,
        signInUserDetails: '',
        error: action.data,
        page: '',
      }
    case SIGN_IN_CLEAR:
      return {
        ...state,
        signInUserDetails: '',
        signUpSuccess: false,
        signInSuccess: false,
        flagError: false,
        loading: false,
      }
    case GET_ROOMS: {
      return {
        ...state,
        success: false,
      }
    }
    case GET_ROOMS_SUCCESS:
      return {
        ...state,
        rooms: sortRoomByDate(),
        myRoom: getMyRoom(),
      }
    case GET_ROOMS_FAILURE:
      return {
        ...state,
        success: false,
        rooms: [],
      }
    case GET_ROOMS_CLEAR:
      return {
        ...state,
        success: false,
      }
    case DELETE_MESSAGE: {
      return {
        ...state,
        deleteSuccess: false,
        deleteError: false,
        deletedMessage: {},
      }
    }
    case DELETE_MESSAGE_SUCCESS: {
      // const { removeMessage } = action.data.data || {}
      // const roomListWithNewMessage = state.rooms.map(user => ({
      //   ...user,
      //   messages: user.id === removeMessage && removeMessage.room ? user.messages.filter(message => message.id !== removeMessage && removeMessage.id) : [...user.messages],
      // }))

      // const updateStoreUser = state && state.storedUser && state.storedUser.messages & state.storedUser.messages.filter(message => message && message.id !== removeMessage && removeMessage.id)
      // state.storedUser.messages = updateStoreUser
      return {
        ...state,
        // rooms: roomListWithNewMessage,
        // deletedMessage: action.data.data.removeMessage,
        deleteSuccess: true,
        deleteError: false,
      }
    }
    case DELETE_MESSAGE_FAILURE:
      return {
        ...state,
        deletedMessage: {},
        deleteSuccess: false,
        deleteError: true,
      }

    case REMOVE_PARTICIPANT_FROM_ROOM: {
      const removeFromStore = state && state.storedUser && state.storedUser.members && state.storedUser.members.filter(user => user.id !== action.payload)
      state.storedUser.members = removeFromStore
      const roomList = state.rooms.map(user => ({
        ...user,
        members: user.members.filter(item => item && item.id !== action.payload),
      }))

      return {
        ...state,
        rooms: roomList,
      }
    }
    case ADD_PARTICIPANT_FROM_ROOM: {
      state.storedUser.members = action.payload
      const roomList = state.rooms.map(user => ({
        ...user,
        members: action.payload,
      }))

      return {
        ...state,
        rooms: roomList,
      }
    }
    case EXIT_FROM_GROUP: {
      const roomList = state.rooms.filter(item => item?.id !== action.payload)
      return {
        ...state,
        rooms: roomList,
        exitSuccess: true,
      }
    }
    case FORGOT_PASSWORD_START:
      return {
        ...state,
        success: false,
        forgotPasswordDetails: {},
        loading: true,
        forgotErrorFlag: false,
        error: {},
      }
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        success: true,
        forgotPasswordDetails: action.data,
        loading: false,
        forgotErrorFlag: false,
      }
    case FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        success: false,
        forgotPasswordDetails: {},
        loading: false,
        forgotErrorFlag: true,
        error: action.data,
      }
    case CHECK_VERIFICATION_CODE_START:
      return {
        ...state,
        data: '',
        isLoading: true,
        codeError: false,
        errorMessage: '',
        signUpSuccess: false,
        codeVerified: false,
        signInSuccess: false,
      }
    case CHECK_VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
        errorMessage: '',
        codeError: false,
        signUpSuccess: false,
        codeVerified: true,
        signInSuccess: false,
      }
    case CHECK_VERIFICATION_CODE_FAILURE:
      return {
        ...state,
        isLoading: false,
        data: '',
        errorMessage: action.data.message,
        codeError: true,
        signUpSuccess: false,
        codeVerified: false,
        signInSuccess: false,
      }

    case CHECK_VERIFICATION_CODE_CLEAR:
      return {
        ...state,
        isLoading: false,
        data: '',
        errorMessage: false,
        codeError: false,
        signUpSuccess: false,
        codeVerified: false,
        signInSuccess: false,
      }
    case UPDATE_USER_ATTRIBUTES_START:
      return {
        ...state,
        loading: true,
        dataFromUpdateAttributes: [],
      }
    case UPDATE_USER_ATTRIBUTES_SUCCESS:
      return {
        ...state,
        loading: false,
        dataFromUpdateAttributes: action.data,
        error: false,
        errorMessage: '',
      }
    case UPDATE_USER_ATTRIBUTES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.e,
        signUpSuccess: false,
        codeVerified: false,
        updateUserWithFullName: false,
        signInSuccess: false,
      }
    case CREATE_USER_PASSWORD_START:
      return {
        ...state,
        passwordCreated: false,
        isLoading: true,
      }
    case CREATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        passwordCreated: true,
        createPasswordData: action.data,
      }
    case CREATE_USER_PASSWORD_FAILURE:
      return {
        ...state,
        passwordCreated: false,
        isLoading: false,
        error: action.e,
        passwordError: action.data.message,
      }
    case RESET_PASSWORD_START:
      return {
        ...state,
        isLoading: true,
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        resetPasswordData: action.data,
      }
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.data,
      }
    case RESET_PASSWORD_CLEAR:
      return {
        ...state,
        resetPasswordData: {},
        error: {},
      }
    case FALSE_FLAGS_IN_USER:
      return {
        ...state,
        loading: false,
        error: false,
        signUpSuccess: false,
        codeVerified: false,
        updateUserWithFullName: false,
        signInSuccess: false,
        dataFromUpdateAttributes: '',
        passwordCreated: false,
        createPasswordData: '',
        data: '',
        signInUserDetails: state.signInUserDetails?.message ? '' : state.signInUserDetails,
        signUpUserDetails: state.signUpUserDetails?.message ? '' : state.signUpUserDetails,
      }
    case GET_USER_ID:
      return {
        ...state,
        isLoading: true,
        addUserSuccess: false,
      }
    case GET_USER_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        addUserSuccess: true,
        addUseData: action.data,
      }
    case GET_USER_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        addUserSuccess: false,
        addUseData: action.e,
      }
    case CHECK_EMAIL_EXIST:
      return {
        ...state,
        isLoading: true,
        checkUserExistSuccess: false,
        userExist: null
      }
    case CHECK_EMAIL_EXIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        checkUserExistSuccess: true,
        userExist: action.data?.data?.checkUserExists?.userExists
      }
    case CHECK_EMAIL_EXIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        checkUserExistSuccess: false,
        userExist: null
      }
    case CHECK_EMAIL_EXIST_CLEAR:
      return {
        ...state,
        isLoading: false,
        checkUserExistSuccess: false,
        userExist: null
      }
    case GET_USER_INFO:
      return {
        ...state,
        userData: {},
        dataStored: false,
      }
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userData: action.data.data.getLoginUser,
        dataStored: true,
      }
    case GET_USER_INFO_FAILURE:
      return {
        ...state,
        userData: action.e,
        dataStored: false,
      }
    case GET_USER_INFO_CLEAR:
      return {
        ...state,
        userData: {},
      }
    case GET_ALL_USER_LIST:
      return {
        ...state,
        allUserData: [],
        contactLoading: true,
        usersListFetched: false,
      }
    case GET_ALL_USER_LIST_SUCCESS:
      return {
        ...state,
        allUserData: action.data.data.users,
        contactLoading: false,
        usersListFetched: true,
      }
    case GET_ALL_USER_LIST_FAILURE:
      return {
        ...state,
        allUserData: action.e,
        contactLoading: false,
        usersListFetched: false,
      }
    case GET_ALL_USER_LIST_CLEAR:
      return {
        ...state,
        allUserData: [],
        allUserInContact: [],
        contactLoading: false,
        usersListFetched: false,
      }
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userData: action.data.data.updateUser,
        userUpdateSuccess: true,
        loading: false,
        flagError: false,
      }
    case UPDATE_USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        flagError: true,
      }
    case UPDATE_USER_PROFILE_CLEAR:
      return {
        ...state,
        userUpdateSuccess: false,
        loading: false,
        flagError: false,
      }
    case ADD_ROOM_LIST:
      return {
        ...state,
        addRoomSuccess: false,
      }
    case ADD_ROOM_LIST_SUCCESS:
      return {
        ...state,
        storedUser: action?.data?.data?.addRoom || {},
        storedUserSuccess: true,
        addRoomSuccess: true,
        storedUserList: [],
      }
    case ADD_ROOM_LIST_FAILURE:
      return {
        ...state,
        addRoomSuccess: false,
        error: true,
        message: action.e,
      }
    case ADD_ROOM_LIST_CLEAR:
      return {
        ...state,
        error: false,
        addRoomSuccess: false,
      }
    case SEND_TOKEN:
      return {
        ...state,
        token: '',
      }
    case SEND_TOKEN_SUCCESS:
      return {
        ...state,
        tokenSuccess: true,
        tokenError: false,
        token: action.data,
      }
    case SEND_TOKEN_FAILURE:
      return {
        ...state,
        token: '',
        tokenSuccess: false,
        tokenError: true,
      }
    case UPDATE_GROUP:
      return {
        ...state,
        roomUpdated: false,
        exitSuccess: false,
        updateGroupLoading: true,
        updateErrorFlag: false,
        updateError: {},
      }
    case UPDATE_GROUP_SUCCESS:
      if (action?.data) {
        updateRoomToRealm(action.data)
      }
      return {
        ...state,
        roomUpdated: true,
        updateGroupLoading: false,
        updateErrorFlag: false,
        rooms: sortRoomByDate(),
        storedUser: action.data || state.storedUser,
        updateError: {},
      }
    case UPDATE_GROUP_FAILURE:
      return {
        ...state,
        roomUpdated: false,
        updateGroupLoading: false,
        updateErrorFlag: true,
        updateError: action.e.message,
      }
    case UPDATE_GROUP_CLEAR:
      return {
        ...state,
        roomUpdated: false,
        updateGroupLoading: false,
        updateError: {},
      }
    case GET_SYSTEM_CONTACTS:
      return {
        ...state,
        contacts: [],
        isLoading: true,
        error: false,
        dataFetched: false,
      }
    case GET_SYSTEM_CONTACTS_SUCCESS: {
      let allUsers = []
      action.data.forEach((contact, index) => {
        if (contact.phoneNumbers.length) {
          if (contact.phoneNumbers[0].number.includes("+")) {
            const phoneNumber = parsePhoneNumberFromString(contact.phoneNumbers[0].number)
            const number = phoneNumber.getURI().slice(4)

            const isAppUser = state.allUserData.find((item) => item && item.phoneNumber === number)
            if (isAppUser) {
              isAppUser.number = number
              allUsers.unshift(isAppUser)
            } else {
              // contact.number = number
              // allUsers.push(contact)
            }
          } else {
            const number = "+91" + contact.phoneNumbers[0].number
            let isAppUser = state.allUserData.find((item) => item && item.phoneNumber === number);
            if (isAppUser) {
              isAppUser.number = number

              allUsers.unshift(isAppUser)
            } else {
              // contact.number = number

              // allUsers.push(contact)
            }
          }
        }
      })
      return {
        ...state,
        isLoading: false,
        contacts: action.data,
        error: false,
        dataFetched: true,
        allUserInContact: allUsers,
      }
    }
    case GET_SYSTEM_CONTACTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.e.message,
        dataFetched: false,
        allUserData: [],
        allUserInContact: [],
      }
    case GET_MEDIA:
      let mediaFilter = [];
      if (state?.storedUser?.room) {
        mediaFilter = filterMediaFromRealm(state.storedUser.room)
      }

      return {
        ...state,
        media: mediaFilter,
      }
    case GET_MEDIA_CLEAR:
      return {
        ...state,
        media: [],
      }
    case GET_CAREID:
      return {
        ...state,
        start: true,
        suggestion: {},
        load: true,
        error: false,
        getSuggestions: false,
      }
    case GET_CAREID_SUCCESS:
      return {
        ...state,
        start: false,
        load: false,
        loadSuggestion: false,
        suggestion: action.data?.data?.userNameSuggestions?.userName,
        error: false,
        getSuggestions: true,
      }
    case GET_CAREID_FAILURE:
      return {
        ...state,
        start: false,
        load: false,
        suggestion: {},
        error: action.e.message,
        getSuggestions: false,
      }
    case GET_SYSTEM_CONTACTS_CLEAR:
      return {
        ...state,
        start: false,
        load: false,
        suggestion: {},
        error: {},
        getSuggestions: false,
        dataFetched: false,
        contactSynced: false,
        dataStored: false,
        usersListFetched: false,
        userFromDbFetched: false,
      }
    case CHECK_FOR_APP_CONTACTS: {
      let allUsers = []
      action.data.map((user) => {
        allUsers.push(user?.id)
      })
      return {
        ...state,
        userFromDb: allUsers,
        userFromDbFetched: true,
        contactSynced: state.allUserInContact.length !== allUsers.length,
      }
    }
    case STORE_SELECTED_ROOM_START:
      return {
        ...state,
        storedUser: {},
        storedUserSuccess: false,
        errorFlag: false,
        addRoomSuccess: false,
        errorMessage: {},
      }
    case STORE_SELECTED_ROOM_SUCCESS:
      return {
        ...state,
        storedUser: action.data,
        storedUserSuccess: true,
        errorFlag: false,
        errorMessage: {},
      }
    case STORE_SELECTED_ROOM_FAILURE:
      return {
        ...state,
        storedUser: {},
        storedUserSuccess: false,
        errorFlag: true,
        errorMessage: action.data,
      }
    case STORE_SELECTED_ROOM_CLEAR:
      return {
        ...state,
        storedUser: {},
        storedUserSuccess: false,
        errorFlag: false,
        errorMessage: {},
      }

    case UPDATE_STORED_USER:
      try {
        if (state.storedUser) {
          state.storedUser.members[0] = action.data;
        }
        state.storedUser.members[0] = action.data;
      } catch (e) {
        console.log("error while update user", e);
      }

      return {
        ...state
      }

    case LOG_OUT:
      return {
        ...INIT_STATE
      }

    default: return { ...state }
  }
}

export default profileReducer