import _ from 'lodash'

import {
    LOG_OUT,
    CREATE_REMINDER,
    CREATE_REMINDER_SUCCESS,
    CREATE_REMINDER_FAILURE,
    GET_REMINDER,
    GET_REMINDER_SUCCESS,
    GET_REMINDER_FAILURE,
    UPDATE_REMINDER,
    UPDATE_REMINDER_SUCCESS,
    UPDATE_REMINDER_FAILURE,
    DELETE_REMINDER,
    DELETE_REMINDER_SUCCESS,
    DELETE_REMINDER_FAILURE,
    ACCEPT_REMINDER_START,
    ACCEPT_REMINDER_SUCCESS,
    ACCEPT_REMINDER_FAILURE,
    CLEAR_REMINDER_FLAGS,
    ADD_REMINDER_LOCALLY,
} from '@constants/ActionTypes'

const INIT_STATE = {
    loading: false,
    getReminder: false,
    error: false,
    reminderSuccess: false,
    createReminder: {},
    reminderData: [],
    acceptSuccess: false,
    updateReminderSuccess: false,
    deleteReminderSuccess: false,
}

const reminderReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CREATE_REMINDER: {
            return {
                ...state,
                createLoading: true,
                reminderSuccess: false,
                getReminder: false,
                error: false,
            }
        }
        case CREATE_REMINDER_SUCCESS: {
            return {
                ...state,
                createLoading: false,
                reminderSuccess: true,
                getReminder: false,
                error: false,
                createReminder: action.data.data.addReminder[0],
            }
        }
        case CREATE_REMINDER_FAILURE:
            return {
                ...state,
                createLoading: false,
                reminderSuccess: false,
                getReminder: false,
                error: true,
            }

        case UPDATE_REMINDER:
            return {
                ...state,
                loading: true,
                updateReminderSuccess: false,
                error: false,
                reminderData: [],
            }
        case UPDATE_REMINDER_SUCCESS: {
            console.log(action, 'action in update reminder')
            return {
                ...state,
                loading: false,
                updateReminderSuccess: true,
                error: false,
                // reminderData: action.data.data.getUserReminders,
            }
        }
        case UPDATE_REMINDER_FAILURE:
            return {
                ...state,
                loading: false,
                updateReminderSuccess: false,
                error: true,
                reminderData: [],
            }

        case DELETE_REMINDER:
            return {
                ...state,
                loading: true,
                deleteReminderSuccess: false,
                error: false,
            }
        case DELETE_REMINDER_SUCCESS: {
            return {
                ...state,
                loading: false,
                deleteReminderSuccess: true,
                error: false,
            }
        }
        case DELETE_REMINDER_FAILURE:
            return {
                ...state,
                loading: false,
                deleteReminderSuccess: false,
                error: true,
            }

        case GET_REMINDER:
            return {
                ...state,
                getLoading: true,
                getReminder: false,
                error: false,
                reminderData: [],
            }
        case GET_REMINDER_SUCCESS: {
            return {
                ...state,
                getLoading: false,
                getReminder: true,
                error: false,
                reminderData: action.data.data.getUserReminders,
            }
        }
        case GET_REMINDER_FAILURE:
            return {
                ...state,
                getLoading: false,
                getReminder: false,
                error: true,
                reminderData: [],
            }

        case ACCEPT_REMINDER_START: {
            return {
                ...state,
                acceptSuccess: false,
                error: false,
            }
        }
        case ACCEPT_REMINDER_SUCCESS: {
            return {
                ...state,
                acceptSuccess: true,
                error: false,
            }
        }
        case ACCEPT_REMINDER_FAILURE:
            return {
                ...state,
                acceptSuccess: false,
                error: true,
            }

        case CLEAR_REMINDER_FLAGS:
            return {
                ...state,
                loading: false,
                getReminder: false,
                updateReminderSuccess: false,
                deleteReminderSuccess: false,
                acceptSuccess: false,
                error: false,
            }

        case ADD_REMINDER_LOCALLY: {
            const addInReminderList = [{ ...action.payload }, ...state.reminderData]
            const removeDuplicate = _.uniqBy(addInReminderList, 'id')
            return {
                ...state,
                reminderData: removeDuplicate,
            }
        }

        case LOG_OUT:
            return {
                ...INIT_STATE
            }

        default: return { ...state }
    }
}

export default reminderReducer