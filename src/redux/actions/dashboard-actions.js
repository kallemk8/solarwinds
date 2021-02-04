import {actions as _A} from './../actions/actionTypes';
import { fetchApiPost } from '../../helpers/data-access/data-access-service';

export function updateDashboardAnalytics() {
    return {
        type: _A.UPDATE_DASHBOARD_ANALYTICS
    }
}


export function getTicketTypes( _dim ) {
    return dispatch => {
        dispatch( showLoader());

        //Make API call
        const req = {
            id: _dim.id,
            type: _dim.type
        }
        fetchApiPost( process.env.REACT_APP_RETRIEVE_TICKET_TYPES, req )
            .then( resp => {
                const ticketTypes = {
                    "title": "Type"
                }
                if ( resp && resp.serviceTypeTickets){
                    const ticketTypeData = resp.serviceTypeTickets
                                            .filter( ( ticketType => {
                                                return ['Patch Status v2', 'CPU', 'Disk', 'Memory'].indexOf(ticketType.service) !== -1; }))
                                            .map(({service, count}) => {
                                                return {
                                                    type: service,
                                                    count
                                                };
                                            });
                    ticketTypes["data"] = ticketTypeData;
                    if ( ticketTypeData.length > 0){
                        dispatch( updateTicketTypes( ticketTypes ) );
                    }else {
                        dispatch( ticketTypesNoData( ticketTypes ) ); // nodata
                    }
                } else {
                    //dispatch( ticketTypesError() ); // error
                    dispatch( ticketTypesNoData( ticketTypes ) ); // nodata
                }
            } );
    }
}

export function overallTicketStatus( {id, type, month} ) {
    return dispatch => {
        const overallTicketStatus = {
            "title": "Overall Status",
            "data": {}
        }
        dispatch( overallTicketStatusLoader( overallTicketStatus ) );
        if ( !month ) {
            month = 0;
        }
        //Make API call
        fetchApiPost( process.env.REACT_APP_RETRIEVE_OVERALL_TICKET_STATUS, { id, type, month } )
            .then( resp => {
                
                if ( resp && Object.keys( resp ).length > 0 ) {
                    //Filter response for New , In Progress tickets
                    const filteredResponse = Object.keys( resp )
                        .map( key => {
                            return {
                                type: key,
                                count: resp[key]
                            };
                        } )
                        .filter( object => ['New', 'In Progress'].includes( object.type ) );

                    if ( Object.keys( filteredResponse ).length === 0 ) {
                        dispatch( overallTicketStatusNoData( overallTicketStatus ) ); // nodata
                    } else {
                        overallTicketStatus["data"] = filteredResponse;
                        dispatch( updateOverallTicketStatus( overallTicketStatus ) );
                    }
                } else {
                    // dispatch(overallTicketStatusError()); 
                    dispatch( overallTicketStatusNoData( overallTicketStatus ) ); // nodata

                }
            } );
    }
}

export function showLoader() {
    return {
        type: _A.UPDATE_TICKET_TYPE_DATA_LOADING,
    }
}
export function ticketTypesNoData( ticketTypes ) {
    return {
        type: _A.UPDATE_TICKET_TYPE_NO_DATA,
        payload: {
            ticketTypes: ticketTypes
        }
    }
}
export function ticketTypesError() {
    return {
        type: _A.UPDATE_TICKET_TYPE_ERROR
    }
}


export function updateTicketTypes( ticketTypes ) {
    return {
        type: _A.UPDATE_TICKET_TYPE_DATA,
        payload: {
            ticketTypes: ticketTypes
        }
    }
}


export function overallTicketStatusLoader( overallTicketStatus ) {
    return {
        type: _A.UPDATE_OVERALL_TICKET_STATUS_DATA_LOADING,
        payload: {
            overallTicketStatus: overallTicketStatus
        }
    }
}
export function overallTicketStatusNoData( overallTicketStatus ) {
    return {
        type: _A.UPDATE_OVERALL_TICKET_STATUS_NO_DATA,
        payload: {
            overallTicketStatus: overallTicketStatus
        }
    }
}
export function overallTicketStatusError( ) {
    return {
        type: _A.UPDATE_OVERALL_TICKET_STATUS_ERROR
    }
}

export function updateOverallTicketStatus( overallTicketStatus ) {
    return {
        type: _A.UPDATE_OVERALL_TICKET_STATUS_DATA,
        payload: {
            overallTicketStatus: overallTicketStatus
        }
    }
}

export function selectedMonthChanged( req ) {
    return dispatch => {
        dispatch( selectedMonthChangedAction( req.month ) );
        dispatch( overallTicketStatus( req ) );
    }

}
export function selectedMonthChangedAction( selectedMonth ) {
    return {
        type: _A.UPDATE_OVERALL_TICKET_STATUS_MONTH_SELECTED,
        payload: {
            selectedMonth: selectedMonth
        }

    }
}
export function resetDashboardState() {
    return {
        type: _A.RESET_DASHBOARD_STATE,
    }
}
