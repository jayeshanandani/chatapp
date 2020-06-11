import {
  SIGN_UP_START,
  SIGN_IN_START,
  CHECK_VERIFICATION_CODE_START,
  UPDATE_USER_ATTRIBUTES_START,
  FALSE_FLAGS_IN_USER,
  CREATE_USER_PASSWORD_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_IN_CLEAR,
  SIGN_UP_CLEAR,
  SIGN_UP_FAILURE,
  CHECK_VERIFICATION_CODE_SUCCESS,
  CHECK_VERIFICATION_CODE_FAILURE,
  CHECK_VERIFICATION_CODE_CLEAR,
  UPDATE_USER_ATTRIBUTES_FAILURE,
  CREATE_USER_PASSWORD_SUCCESS,
  CREATE_USER_PASSWORD_FAILURE,
  CREATE_USER_PASSWORD_CLEAR,
  SIGN_UP_SUCCESS,
  UPDATE_USER_ATTRIBUTES_CLEAR,
  UPDATE_USER_ATTRIBUTES_SUCCESS,
  GET_USER_ID,
  GET_USER_INFO,
  GET_USER_ID_SUCCESS,
  GET_USER_ID_FAILURE,
  CHECK_EMAIL_EXIST,
  CHECK_EMAIL_EXIST_SUCCESS,
  CHECK_EMAIL_EXIST_FAILURE,
  CHECK_EMAIL_EXIST_CLEAR,
  GET_ALL_USER_LIST,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_CLEAR,
  ADD_ROOM_LIST,
  ADD_ROOM_LIST_FAILURE,
  ADD_ROOM_LIST_SUCCESS,
  ADD_ROOM_LIST_CLEAR,
  SEND_TOKEN,
  UPDATE_GROUP,
  UPDATE_GROUP_CLEAR,
  GET_SYSTEM_CONTACTS,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_START,
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
  LOG_OUT,
  UPDATE_STORED_USER,
  GET_USER_INFO_CLEAR,
  DELETE_MESSAGE,
  GET_CAREID,
  GET_ALL_USER_LIST_CLEAR,
  GET_SYSTEM_CONTACTS_CLEAR,
  CHECK_FOR_APP_CONTACTS,
  SET_ALL_USER,
  SOCKET_CONNECTION,
} from '@constants/ActionTypes'

export const socketConnection = data => ({
  type: SOCKET_CONNECTION,
  data,
});

// sign-in
export const userSignIn = content => ({
  type: SIGN_IN_START,
  payload: content,
})

export const getMedia = () => ({
  type: GET_MEDIA
})

export const logout = () => ({
  type: LOG_OUT
})

export const getMediaClear = () => ({
  type: GET_MEDIA_CLEAR
})

export const signInSuccess = (response, page) => ({
  type: SIGN_IN_SUCCESS,
  data: response,
  page,
})

export const signInFailure = e => ({
  type: SIGN_IN_FAILURE,
  data: e,
})

export const signInStart = () => ({
  type: SIGN_IN_START,
})

export const signInClear = () => ({
  type: SIGN_IN_CLEAR,
})

// sign-up
export const userSignUpStart = () => ({
  type: SIGN_UP_START,
})

export const signUpSuccess = response => ({
  type: SIGN_UP_SUCCESS,
  data: response,
})

export const signUpFailure = e => ({
  type: SIGN_UP_FAILURE,
  data: e,
})

export const updateStoredUser = user => ({
  type: UPDATE_STORED_USER,
  data: user,
})

export const signUpClear = () => ({
  type: SIGN_UP_CLEAR,
})

// check-verification
export const checkVerificationCodeStart = content => ({
  type: CHECK_VERIFICATION_CODE_START,
  payload: content,
})

export const checkVerificationCodeSuccess = response => ({
  type: CHECK_VERIFICATION_CODE_SUCCESS,
  data: response,
})

export const checkVerificationCodeFailure = e => ({
  type: CHECK_VERIFICATION_CODE_FAILURE,
  data: e,
})

export const checkVerificationCodeClear = () => ({
  type: CHECK_VERIFICATION_CODE_CLEAR,
})

// update-attribute
export const updateUserAttributes = () => ({
  type: UPDATE_USER_ATTRIBUTES_START,
})

export const updateUserAttributesSuccess = response => ({
  type: UPDATE_USER_ATTRIBUTES_SUCCESS,
  data: response,
})

export const updateUserAttributesFailure = e => ({
  type: UPDATE_USER_ATTRIBUTES_FAILURE,
  data: e,
})

export const updateUserAttributesClear = () => ({
  type: UPDATE_USER_ATTRIBUTES_CLEAR,
})

export const updateGroupClear = () => ({
  type: UPDATE_GROUP_CLEAR,
})

export const falseFlagsInUser = () => ({
  type: FALSE_FLAGS_IN_USER,
})

// create user password
export const createUserPassword = () => ({
  type: CREATE_USER_PASSWORD_START,
})

export const createUserPasswordSuccess = response => ({
  type: CREATE_USER_PASSWORD_SUCCESS,
  data: response,
})

export const createUserPasswordFailure = e => ({
  type: CREATE_USER_PASSWORD_FAILURE,
  data: e,
})

export const resetPassword = () => ({
  type: RESET_PASSWORD_START,
})

export const resetPasswordSuccess = response => ({
  type: RESET_PASSWORD_SUCCESS,
  data: response,
})

export const resetPasswordFailure = e => ({
  type: RESET_PASSWORD_FAILURE,
  data: e,
})

export const resetPasswordClear = e => ({
  type: RESET_PASSWORD_CLEAR
})

export const createUserPasswordClear = () => ({
  type: CREATE_USER_PASSWORD_CLEAR,
})

export const addUser = input => ({
  type: GET_USER_ID,
  payload: { input },
})

export const addUserSuccess = () => ({
  type: GET_USER_ID_SUCCESS,
})

export const addUserFailure = () => ({
  type: GET_USER_ID_FAILURE,
})

export const checkEmailExist = input => ({
  type: CHECK_EMAIL_EXIST,
  payload: input,
})

export const checkEmailExistSuccess = () => ({
  type: CHECK_EMAIL_EXIST_SUCCESS,
})

export const checkEmailExistFailure = () => ({
  type: CHECK_EMAIL_EXIST_FAILURE,
})

export const checkEmailExistClear = () => ({
  type: CHECK_EMAIL_EXIST_CLEAR,
})

export const getUserInfo = () => ({
  type: GET_USER_INFO,
})

export const getUserInfoClear = () => ({
  type: GET_USER_INFO_CLEAR,
})

export const allUser = () => ({
  type: GET_ALL_USER_LIST,
})

export const updateUserProfile = input => ({
  type: UPDATE_USER_PROFILE,
  payload: { input },
})

export const updateUserProfileClear = () => ({
  type: UPDATE_USER_PROFILE_CLEAR,
})

export const addRoomList = input => ({
  type: ADD_ROOM_LIST,
  data: { input },
})

export const addRoomListSuccess = input => ({
  type: ADD_ROOM_LIST_SUCCESS,
  data: { input },
})

export const addRoomListFailure = e => ({
  type: ADD_ROOM_LIST_FAILURE,
  data: e,
})

export const clearAddRoom = () => ({
  type: ADD_ROOM_LIST_CLEAR,
})

export const sendToken = input => ({
  type: SEND_TOKEN,
  payload: { input },
})

export const updateGroup = input => ({
  type: UPDATE_GROUP,
  payload: { input },
})

export const getSystemContacts = () => ({
  type: GET_SYSTEM_CONTACTS,
})

export const storeRoomStart = () => ({
  type: STORE_SELECTED_ROOM_START,
})

export const storeRoomSuccess = response => ({
  type: STORE_SELECTED_ROOM_SUCCESS,
  data: response,
})

export const storeRoomFailure = e => ({
  type: STORE_SELECTED_ROOM_FAILURE,
  data: e,
})

export const storeRoomClear = () => ({
  type: STORE_SELECTED_ROOM_CLEAR,
})

export const forgotPasswordStart = () => ({
  type: FORGOT_PASSWORD_START,
})

export const forgotPasswordSuccess = response => ({
  type: FORGOT_PASSWORD_SUCCESS,
  data: response,
})

export const forgotPasswordFailure = e => ({
  type: FORGOT_PASSWORD_FAILURE,
  data: e,
})

export const deleteMessageAction = input => ({
  type: DELETE_MESSAGE,
  payload: { input },
})

export const getCareIdAction = input => ({
  type: GET_CAREID,
  payload: { input },
})

export const getAllUserClear = () => ({
  type: GET_ALL_USER_LIST_CLEAR,
})

export const getSystemContactsClear = () => ({
  type: GET_SYSTEM_CONTACTS_CLEAR,
})

export const checkForAppContacts = (data) => ({
  type: CHECK_FOR_APP_CONTACTS,
  data,
})

export const setAllUser = () => ({
  type: SET_ALL_USER,
})