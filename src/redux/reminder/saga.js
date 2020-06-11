import { put, takeEvery, all } from 'redux-saga/effects'

import { localClient } from '../../../App'

import {
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
    ACCEPT_REMINDER_SUCCESS,
    ACCEPT_REMINDER_FAILURE,
    ACCEPT_REMINDER_START,
} from '@constants/ActionTypes'

import { createReminderMutation, getReminderQuery, acceptReminderInvitation, deleteReminderMutation, updateReminderMutation } from '@graphql/reminderSchema'

async function createReminder(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: createReminderMutation,
        variables: { input },
    }).then(res => res)
    .catch((err) => {
        throw err
    })
}

async function updateReminder(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: updateReminderMutation,
        variables: { input },
    }).then(res => res)
        .catch((err) => {
            throw err
        })
}

async function deleteReminder(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: deleteReminderMutation,
        variables: { input },
    }).then(res => res)
        .catch((err) => {
            throw err
        })
}

async function acceptReminderData(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: acceptReminderInvitation,
        variables: { input },
    }).then(res => res)
        .catch((err) => {
            throw err
        })
}

async function getReminderData() {
    return localClient.query({
        query: getReminderQuery,
        fetchPolicy: 'no-cache',
    }).then(res => res).catch(err => err)
}


function* createReminderStart(action) {
    try {
        const data = yield createReminder(action)
        yield put({ type: CREATE_REMINDER_SUCCESS, data })
    } catch (e) {
        yield put({ type: CREATE_REMINDER_FAILURE, e })
    }
}

function* updateReminderStart(action) {
    try {
        const data = yield updateReminder(action)
        yield put({ type: UPDATE_REMINDER_SUCCESS, data })
    } catch (e) {
        yield put({ type: UPDATE_REMINDER_FAILURE, e })
    }
}

function* deleteReminderStart(action) {
    try {
        const data = yield deleteReminder(action)
        yield put({ type: DELETE_REMINDER_SUCCESS, data })
    } catch (e) {
        yield put({ type: DELETE_REMINDER_FAILURE, e })
    }
}

function* acceptReminderStart(action) {
    try {
        const data = yield acceptReminderData(action)
        yield put({ type: ACCEPT_REMINDER_SUCCESS, data })
    } catch (e) {
        yield put({ type: ACCEPT_REMINDER_FAILURE, e })
    }
}

function* getReminderStart(action) {
    try {
        const data = yield getReminderData(action)
        yield put({ type: GET_REMINDER_SUCCESS, data })
    } catch (e) {
        yield put({ type: GET_REMINDER_FAILURE, e })
    }
}


function* createReminderSaga() {
    yield takeEvery(CREATE_REMINDER, createReminderStart)
}

function* updateReminderSaga() {
    yield takeEvery(UPDATE_REMINDER, updateReminderStart)
}

function* deleteReminderSaga() {
    yield takeEvery(DELETE_REMINDER, deleteReminderStart)
}

function* acceptReminderSaga() {
    yield takeEvery(ACCEPT_REMINDER_START, acceptReminderStart)
}

function* getReminderSaga() {
    yield takeEvery(GET_REMINDER, getReminderStart)
}

export default function* reminderSaga() {
    yield all([createReminderSaga(), updateReminderSaga(), deleteReminderSaga(), getReminderSaga(), acceptReminderSaga()])
}