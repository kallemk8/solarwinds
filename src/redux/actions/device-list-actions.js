import { fetchApiGet, fetchApiPost } from '../../helpers/data-access/data-access-service';
import { actions as _A } from './../actions/actionTypes';

export function getDeviceList( req ) {
    return dispatch => {
        dispatch(showDeviceList()); //Show Device List Component
        dispatch( showLoader() ); //Show loader
        dispatch( updateDeviceStatus(req.status) ) // set status for device

        if (req.status && req.status === 'Faults') {
            req.status = 'Failed';
        }
        //Make API call
        fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICE_STATUS_DATA, req )
            .then( resp => {
                if(resp && !resp.error){
                    const restData = resp.map( ( { id, uri, deviceClass, Name, status, ticket } ) => ( {
                        id,
                        networkAddress: uri,
                        deviceClass,
                        description: Name,
                        status,
                        ticket
                    } ) );
                    const devices = [...restData];

                    //Update the Devi eList Items
                    dispatch( updateDeviceList( devices ) )
                }
            } );

    }
}

export function getTicketDetails( ticketId ) {
    return dispatch => {
        // dispatch( showDeviceList() ); //Show Device List Component
        dispatch( updateTicketDetailsShowLoader() ); //Show loader
        // dispatch( updateDeviceStatus( req.status ) ) // set status for device


        //Make API call
        fetchApiGet( process.env.REACT_APP_RETRIEVE_TICKET_DETAILS + '/' + ticketId )
            .then( resp => {
                if(resp && !resp.error){
                    const ticketDetails = {
                        ticketId,
                        ticketNumber: resp.details?.number,
                        description: resp.details?.description || '-',
                        status: resp.details?.status || '-',
                        createdOn: resp.info?.dates?.ticketCreatedDate || '-',
                        lastUpdatedOn: resp.info?.dates?.recLastUpdatedDate || '-',
                        closedOn: resp.info?.dates?.ticketClosedDate || '-',
                        closeNotes: resp.details?.close_notes || '-',
                        service: resp.info?.service || '-',
                        device: resp.info?.device?.name || '-',
                        deviceClass: resp.details?.category || '-',
                        site: resp.info?.site?.name || '-'

                    }
                    dispatch( updateTicketDetails( ticketDetails ) );

                } else {
                    if ( resp.error){
                        const customErrorMessage = "No Data found for the ticket " + ticketId;
                        dispatch( updateTicketDetailsError( customErrorMessage ) ); // resp.error.message
                    }else {
                        dispatch( updateTicketDetailsNoData() );
                    }
                }
            } );

    }
}

export function updateTicketDetails ( ticketDetails ){
    return {
        type: _A.UPDATE_TICKET_DETAILS,
        payload: {
            ticketDetails: ticketDetails
        }
    }
}
export function updateTicketDetailsShowLoader( ) {
    return {
        type: _A.UPDATE_TICKET_DETAILS_LOADING
    }
}
export function updateTicketDetailsNoData() {
    return {
        type: _A.UPDATE_TICKET_DETAILS_NO_DATA
    }
}
export function updateTicketDetailsError(errMsg) {
    return {
        type: _A.UPDATE_TICKET_DETAILS_ERROR,
        payload: {
            errMsg: errMsg
        }
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
export function updateDevicemapBounds( bounds ) {
    return {
        type: _A.SET_MAP_BOUNDS,
        payload: {
            bounds: bounds
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
    return dispatch => {
        dispatch( resetDeviceListState() );
        dispatch( hideDeviceDialog() );
    }
}

export function hideDeviceDialog() {
    return {
        type: _A.HIDE_DEVICE_DIALOG,
    }
}

export function resetDeviceListState() {
    return {
        type: _A.RESET_DEVICE_LIST_STATE,
    }
}
