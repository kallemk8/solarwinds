import {actions as _A} from '../actions/actionTypes';

const initialState = {
    showDialog: false,
    isLoading: false,
    isError: true,
    selectedMonth: 0,
    noData: false,
    ticketTypes: {
    }, 
    overallTicketStatus: {
        showDialog: false,
        isLoading: false,
        isError: true,
        noData: false,
        overallTicketStatus: {

        }, 
    }
};

export function Dashboard(state = initialState, action) {
    switch (action.type) {
        case _A.UPDATE_TICKET_TYPE_DATA :
            return {
                ...state,
                isLoading: false,
                noData: false,
                ticketTypes: action.payload.ticketTypes
            };
        case _A.UPDATE_TICKET_TYPE_DATA_LOADING :
            return {
                ...state,
                noData: false,
                isLoading: true 
            }
        case _A.UPDATE_TICKET_TYPE_NO_DATA:
            return {
                ...state,
                noData: true,
                isLoading: false,
                ticketTypes: action.payload.ticketTypes
            }
        case _A.UPDATE_TICKET_TYPE_ERROR:
            return {
                ...state,
                isError: true,
                isLoading: false
            }

        case _A.UPDATE_OVERALL_TICKET_STATUS_DATA:
            return {
                ...state,
                overallTicketStatus : {
                    isLoading: false,
                    overallTicketStatus: action.payload.overallTicketStatus
                }
            };
        case _A.UPDATE_OVERALL_TICKET_STATUS_DATA_LOADING:
            return {
                ...state,
                overallTicketStatus: {
                    isLoading: true,
                    overallTicketStatus: action.payload.overallTicketStatus
                }
            }
        case _A.UPDATE_OVERALL_TICKET_STATUS_NO_DATA:
            return {
                ...state,
                overallTicketStatus: {
                    noData: true,
                    isLoading: false,
                    overallTicketStatus: action.payload.overallTicketStatus
                }
            }
        case _A.UPDATE_OVERALL_TICKET_STATUS_ERROR:
            return {
                ...state,
                overallTicketStatus: {
                    isError: true,
                    isLoading: false
                }
            }
        case _A.UPDATE_OVERALL_TICKET_STATUS_MONTH_SELECTED:
            return {
                ...state,
                selectedMonth: action.payload.selectedMonth
 
            }
        case _A.RESET_DASHBOARD_STATE:
            return initialState;

        default:
            return state;
    }
}
