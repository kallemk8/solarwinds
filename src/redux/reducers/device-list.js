import { actions as _A } from './../actions/actionTypes';


const initialState = {
    showDialog: false,
    isLoading: false,
    status: '',
    items: [],
    bounds:"",
    ticketDetails: {
        isLoading: false,
        noData: false,
        isError: false,
        errMsg: '',
        items: [],

    }
};

export function DeviceList( state = initialState, action ) {
    switch ( action.type ) {
        case _A.SHOW_DEVICE_DIALOG:
            return {
                ...state,
                showDialog: true
            };
        case _A.HIDE_DEVICE_DIALOG:
            return {
                ...state,
                showDialog: false
            };
        case _A.UPDATE_DEVICE_BY_STATUS:
            return {
                ...state,
                isLoading: false,
                items: action.payload.list
            };
        case _A.SET_DEVICE_STATUS:
            return {
                ...state,
                status: action.payload.status
            };
        case _A.UPDATE_DEVICE_BY_STATUS_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case _A.UPDATE_TICKET_DETAILS:
            return {
                ...state,
                ticketDetails: {
                    isError: false,
                    isLoading: false,
                    items: action.payload.ticketDetails
                }
            };
        case _A.UPDATE_TICKET_DETAILS_LOADING:
            return {
                ...state,
                ticketDetails: {
                    isLoading: true,
                    isError: false,
                    noData: false,
                    errMsg: '',
                    items: []
                }
            };
        case _A.UPDATE_TICKET_DETAILS_NO_DATA:
            return {
                ...state,
                ticketDetails: {
                    isLoading: false,
                    noData: true,
                    items: []
                }
            };
        case _A.UPDATE_TICKET_DETAILS_ERROR:
            return {
                ...state,
                ticketDetails: {
                    isLoading: false,
                    isError: false,
                    errMsg: action.payload.errMsg,
                    noData: false,
                    items: []
                }
            };
        case _A.SET_MAP_BOUNDS:
            return {
                ...state,
                bounds:action.payload
            }
        case _A.RESET_MAP_BOUNDERS_ON_CUSTOMER_CHANGE:
            return {
                ...state,
                bounds:""
            }
        case _A.RESET_DEVICE_LIST_STATE:
            return initialState;
        default:
            return state;
    }
}
