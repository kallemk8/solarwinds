import {actions as _A} from '../actions/actionTypes';

const initialState = {
    ticketId: '',
    isLoading: false,
    noData: false,
    timelineInfo: {},
    failureTimelineInfo: {
        isLoading: false,
        noData: false,
        items: {}
    },
};

export function Ticket(state = initialState, action) {
    switch (action.type) {
        case _A.UPDATE_TICKET_TIMELINE_INFO :
            return {
                ...state,
                isLoading: false,
                noData: false,
                timelineInfo: action.payload.timelineInfo,
            };
        case _A.UPDATE_TICKET_TIMELINE_INFO_LOADING:
            return {
                ...state,
                isLoading: true,
                noData: false,
            };
        case _A.UPDATE_TICKET_TIMELINE_INFO_NO_DATA:
            return {
                ...state,
                isLoading: false,
                noData: true,
            };
        case _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO:
            return {
                ...state,
                failureTimelineInfo: {
                    isLoading: false,
                    noData: false,
                    items: action.payload.failureTimelineInfo,
                }
                
            };
        case _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO_LOADING:
            return {
                ...state,
                failureTimelineInfo: {
                    isLoading: true,
                    noData: false,
                }
            };
        case _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO_NO_DATA:
            return {
                ...state,
                failureTimelineInfo: {
                isLoading: false,
                noData: true,
                }
            };
        case _A.RESET_TICKET_STATE:
            return initialState;
        default:
            return state;
    }
}
