import {
    CREATE_REMINDER,
    GET_REMINDER,
    UPDATE_REMINDER,
    DELETE_REMINDER,
    ACCEPT_REMINDER_START,
    CLEAR_REMINDER_FLAGS,
    ADD_REMINDER_LOCALLY
} from '@constants/ActionTypes'

export const createReminder = input => ({
    type: CREATE_REMINDER,
    payload: { input },
})

export const getReminder = () => ({
    type: GET_REMINDER,
})

export const updateReminder = input => ({
    type: UPDATE_REMINDER,
    payload: { input },
})

export const deleteReminder = input => ({
    type: DELETE_REMINDER,
    payload: { input },
})

export const acceptReminder = input => ({
    type: ACCEPT_REMINDER_START,
    payload: { input },
})

export const clearFlags = () => ({
    type: CLEAR_REMINDER_FLAGS,
})

export const addReminderLocally = data => ({
    type: ADD_REMINDER_LOCALLY,
    payload: data,
})