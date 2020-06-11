import _ from 'lodash'

import {
    CREATE_ANNOUNCEMENT,
    CREATE_ANNOUNCEMENT_FAILURE,
    CREATE_ANNOUNCEMENT_SUCCESS,
    GET_ANNOUNCEMENT,
    GET_ANNOUNCEMENT_SUCCESS,
    GET_ANNOUNCEMENT_FAILURE,
    UPDATE_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT_SUCCESS,
    UPDATE_ANNOUNCEMENT_FAILURE,
    ARCHIVE_ANNOUNCEMENT,
    ARCHIVE_ANNOUNCEMENT_SUCCESS,
    ARCHIVE_ANNOUNCEMENT_FAILURE,
    CLEAR_ANNOUNCEMENT_FLAGS,
    CREATE_ANNOUNCEMENT_CLEAR,
    ADD_LOCALLY,
    LOG_OUT
} from '../../constants/ActionTypes'

const INIT_STATE = {
    createLoading: false,
    createAnnouncementSuccess: false,
    createError: false,
    createdAnnouncement: {},
    getAnnouncementList: [],
    updateAnnouncementSuccess: false,
    archiveAnnouncementSuccess: false,
}

const announcementReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CREATE_ANNOUNCEMENT: {
            return {
                ...state,
                createLoading: true,
                createAnnouncementSuccess: false,
                createError: false,
                createdAnnouncement: {},
            }
        }
        case CREATE_ANNOUNCEMENT_SUCCESS: {
            return {
                ...state,
                createLoading: false,
                createAnnouncementSuccess: true,
                createError: false,
                createdAnnouncement: action.data.data.createAnnouncement,
            }
        }
        case CREATE_ANNOUNCEMENT_FAILURE:
            return {
                ...state,
                createLoading: false,
                createAnnouncementSuccess: false,
                createError: true,
                createdAnnouncement: {},
            }
        case CREATE_ANNOUNCEMENT_CLEAR:
            return {
                ...state,
                createLoading: false,
                createAnnouncementSuccess: false,
                createError: false,
                createdAnnouncement: {},
            }

        case GET_ANNOUNCEMENT: {
            return {
                ...state,
                getLoading: true,
                getAnnouncementSuccess: false,
                getError: false,
                getAnnouncementList: [],
            }
        }
        case GET_ANNOUNCEMENT_SUCCESS: {
            return {
                ...state,
                getLoading: false,
                getAnnouncementSuccess: true,
                getError: false,
                getAnnouncementList: action.data.data.userAnnouncement,
            }
        }
        case GET_ANNOUNCEMENT_FAILURE:
            return {
                ...state,
                getLoading: false,
                getAnnouncementSuccess: false,
                getError: true,
                getAnnouncementList: [],
            }

        case UPDATE_ANNOUNCEMENT:
            return {
                ...state,
                loading: true,
                updateAnnouncementSuccess: false,
                error: false,
                // updateAnnouncementData: [],
            }
        case UPDATE_ANNOUNCEMENT_SUCCESS: {
            console.log(action, 'action in update announcement')
            return {
                ...state,
                loading: false,
                updateAnnouncementSuccess: true,
                error: false,
                // updateAnnouncementData: action.data.data.getUserReminders,
            }
        }
        case UPDATE_ANNOUNCEMENT_FAILURE:
            return {
                ...state,
                loading: false,
                updateAnnouncementSuccess: false,
                error: true,
                // updateAnnouncementData: [],
            }

        case ARCHIVE_ANNOUNCEMENT:
            return {
                ...state,
                loading: true,
                archiveAnnouncementSuccess: false,
                error: false,
            }
        case ARCHIVE_ANNOUNCEMENT_SUCCESS: {
            return {
                ...state,
                loading: false,
                archiveAnnouncementSuccess: true,
                error: false,
            }
        }
        case ARCHIVE_ANNOUNCEMENT_FAILURE:
            return {
                ...state,
                loading: false,
                archiveAnnouncementSuccess: false,
                error: true,
            }

        case CLEAR_ANNOUNCEMENT_FLAGS:
            return {
                ...state,
                createLoading: false,
                createAnnouncementSuccess: false,
                createError: false,
                archiveAnnouncementSuccess: false,
                updateAnnouncementSuccess: false,
            }

        case ADD_LOCALLY: {
            const addInAnnouncementList = [{ ...action.payload }, ...state.getAnnouncementList]
            const removeDuplicate = _.uniqBy(addInAnnouncementList, 'id')
            return {
                ...state,
                getAnnouncementList: removeDuplicate,
            }
        }

        case LOG_OUT:
            return {
                ...INIT_STATE
            }

        default: return { ...state }
    }
}

export default announcementReducer