import { fetchApiPost } from '../../helpers/data-access/data-access-service';
import { actions as _A } from './actionTypes';


export function getTicketTimelineInfo( req ) {
    return dispatch => {
        dispatch( updateTicketTimelineInfoShowLoader() ); //Show loader

        fetchApiPost( process.env.REACT_APP_RETRIEVE_TICKET_TIMELINE, req )
            .then( resp => {
                if(resp){
                    dispatch( updateTicketTimelineInfo( resp ) );
                }
            } );
    }
}

export function getFailureTimelineInfo( req ) {
    return dispatch => {
        dispatch( updateFailureTicketTimelineInfoShowLoader() ); //Show loader

        fetchApiPost( process.env.REACT_APP_RETRIEVE_ISSUE_TIMELINE, req )
            .then( resp => {
                if ( resp ) {

                    if ( Array.isArray( resp.data ) ) {
                        const data = resp.data.map( ( cd, index ) => {
                            return {
                                On: cd.On,
                                date: cd.date,
                                values: cd.values.map( ( vl, i ) => {

                                    const label = vl.type === 'issues' ? 'faults' : vl.type;
                                    return {
                                        type: label,
                                        count: vl.count
                                    };
                                    

                                } )
                            }
                            
                        } );
                        resp.data = data;
                        resp.title = "Tickets vs Faults"

                    }
                    dispatch( updateFailureTicketTimelineInfo( resp ) );
                }
            } );
    }
}

export function updateTicketTimelineInfo ( timelineInfo ){
    return {
        type: _A.UPDATE_TICKET_TIMELINE_INFO,
        payload: {
            timelineInfo: timelineInfo
        }
    }
}
export function updateTicketTimelineInfoShowLoader( ) {
    return {
        type: _A.UPDATE_TICKET_TIMELINE_INFO_LOADING
    }
}

export function updateTicketTimelineInfoNoData() {
    return {
        type: _A.UPDATE_TICKET_TIMELINE_INFO_NO_DATA
    }
}
export function updateFailureTicketTimelineInfo( failureTimelineInfo ) {
    return {
        type: _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO,
        payload: {
            failureTimelineInfo: failureTimelineInfo
        }
    }
}
export function updateFailureTicketTimelineInfoShowLoader() {
    return {
        type: _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO_LOADING
    }
}

export function updateFailureTicketTimelineInfoNoData() {
    return {
        type: _A.UPDATE_FAILURE_TICKET_TIMELINE_INFO_NO_DATA
    }
}

export function updateDeviceList( deviceList ) {
    return {
        type: _A.UPDATE_DEVICE_BY_STATUS,
        payload: {
            list: deviceList
        }
    }
}

export function updateDeviceStatus( status ) {
    return {
        type: _A.SET_DEVICE_STATUS,
        payload: {
            status: status
        }
    }
}

export function showLoader() {
    return {
        type: _A.UPDATE_DEVICE_BY_STATUS_LOADING,
    }
}

export function showDeviceList() {
    return {
        type: _A.SHOW_DEVICE_DIALOG,
    }
}
export function hideDeviceList() {
    return {
        type: _A.HIDE_DEVICE_DIALOG,
    }
}

export function resetTicketState() {
    return {
        type: _A.RESET_TICKET_STATE,
    }
}


