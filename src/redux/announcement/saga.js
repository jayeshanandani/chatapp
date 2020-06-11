import { put, takeEvery, all } from 'redux-saga/effects'

import { localClient } from '../../../App'

import {
    CREATE_ANNOUNCEMENT_SUCCESS,
    CREATE_ANNOUNCEMENT_FAILURE,
    CREATE_ANNOUNCEMENT,
    GET_ANNOUNCEMENT,
    GET_ANNOUNCEMENT_SUCCESS,
    GET_ANNOUNCEMENT_FAILURE,
    UPDATE_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT_SUCCESS,
    UPDATE_ANNOUNCEMENT_FAILURE,
    ARCHIVE_ANNOUNCEMENT,
    ARCHIVE_ANNOUNCEMENT_SUCCESS,
    ARCHIVE_ANNOUNCEMENT_FAILURE,
} from '@constants/ActionTypes'

import { createAnnouncementMutation, getAnnouncementQuery, archiveAnnouncementMutation, updateAnnouncementMutation } from '@graphql/announcementSchema'

async function createAnnouncementData(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: createAnnouncementMutation,
        variables: { input },
    }).then(res => res)
    .catch((err) => {
        throw err
    })
}

async function getAnnouncementData() {
    return localClient.query({
        query: getAnnouncementQuery,
        fetchPolicy: 'no-cache',
    }).then(res => res).catch(err => err)
}

async function updateAnnouncement(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: updateAnnouncementMutation,
        variables: { input },
    }).then(res => res)
        .catch((err) => {
            throw err
        })
}

async function archiveAnnouncement(action) {
    const { input } = action.payload
    return localClient.mutate({
        mutation: archiveAnnouncementMutation,
        variables: { input },
    }).then(res => res)
        .catch((err) => {
            throw err
        })
}


function* createAnnouncementStart(action) {
    try {
        const data = yield createAnnouncementData(action)
        yield put({ type: CREATE_ANNOUNCEMENT_SUCCESS, data })
    } catch (e) {
        yield put({ type: CREATE_ANNOUNCEMENT_FAILURE, e })
    }
}

function* getAnnouncementStart(action) {
    try {
        const data = yield getAnnouncementData(action)
        yield put({ type: GET_ANNOUNCEMENT_SUCCESS, data })
    } catch (e) {
        yield put({ type: GET_ANNOUNCEMENT_FAILURE, e })
    }
}

function* updateAnnouncementStart(action) {
    try {
        const data = yield updateAnnouncement(action)
        yield put({ type: UPDATE_ANNOUNCEMENT_SUCCESS, data })
    } catch (e) {
        yield put({ type: UPDATE_ANNOUNCEMENT_FAILURE, e })
    }
}

function* archiveAnnouncementStart(action) {
    try {
        const data = yield archiveAnnouncement(action)
        yield put({ type: ARCHIVE_ANNOUNCEMENT_SUCCESS, data })
    } catch (e) {
        yield put({ type: ARCHIVE_ANNOUNCEMENT_FAILURE, e })
    }
}


function* createAnnouncementSaga() {
    yield takeEvery(CREATE_ANNOUNCEMENT, createAnnouncementStart)
}

function* getAnnouncementSaga() {
    yield takeEvery(GET_ANNOUNCEMENT, getAnnouncementStart)
}

function* updateAnnouncementSaga() {
    yield takeEvery(UPDATE_ANNOUNCEMENT, updateAnnouncementStart)
}

function* archiveAnnouncementSaga() {
    yield takeEvery(ARCHIVE_ANNOUNCEMENT, archiveAnnouncementStart)
}


export default function* announcementSaga() {
    yield all([createAnnouncementSaga(), getAnnouncementSaga(), updateAnnouncementSaga(), archiveAnnouncementSaga()])
}