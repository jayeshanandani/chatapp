import {
    CREATE_ANNOUNCEMENT,
    GET_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT,
    ARCHIVE_ANNOUNCEMENT,
    CLEAR_ANNOUNCEMENT_FLAGS,
    CREATE_ANNOUNCEMENT_CLEAR,
    ADD_LOCALLY,
} from '@constants/ActionTypes'

export const createAnnouncement = input => ({
    type: CREATE_ANNOUNCEMENT,
    payload: { input },
})

export const getAnnouncement = () => ({
    type: GET_ANNOUNCEMENT,
})

export const updateAnnouncement = input => ({
    type: UPDATE_ANNOUNCEMENT,
    payload: { input },
})

export const archiveAnnouncement = input => ({
    type: ARCHIVE_ANNOUNCEMENT,
    payload: { input },
})

export const clearAnnouncementFlags = () => ({
    type: CLEAR_ANNOUNCEMENT_FLAGS,
})

export const clearCreateAnnouncement = () => ({
    type: CREATE_ANNOUNCEMENT_CLEAR,
})

export const addLocally = data => ({
    type: ADD_LOCALLY,
    payload: data,
})