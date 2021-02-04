
import {actions as _A} from './../actions/actionTypes';
import {fetchApiGet} from "../../helpers/data-access/data-access-service";
import { getTicketTypes, overallTicketStatus } from './dashboard-actions';
import { getFailureTimelineInfo, getTicketTimelineInfo } from './ticket-actions';
import store from '../store';
import {retrieveUserProfile, retrieveUserProfileImage} from './profile-action';

// export function getCustomerDimensions(_id, email) {
//
//     return dispatch => {
//         dispatch(updateCustomerId(_id));
//         //_id vinay113@sw.com
//         fetchApiGet( process.env.REACT_APP_USER_MAPPINGS + '/' + email)
//             .then(resp => {
//                 const customers = resp.customers.map(cus => {
//                     const customer = Object.assign( {}, cus );
//                     customer.name = cus.info.name;
//                     return customer;
//                 });
//
//                 if ( resp ) {
//                     dispatch(updateCustomerDimensions(customers));
//                     dispatch(updateCustomerSelectedDimensions(customers[0]));
//                     dispatch( retrieveUserProfile() );
//                 }
//             });
//     }
// }

export function getCustomerDimensions(_id) {

    return dispatch => {
        dispatch(updateCustomerId(_id));
        fetchApiGet(process.env.REACT_APP_RETRIEVE_DIMENSIONS + '/' + _id)
            .then(resp => {
                if (resp) {
                    dispatch(updateCustomerDimensions(resp));
                    dispatch(updateCustomerSelectedDimensions(resp[0]));
                    dispatch( retrieveUserProfile() );
                    dispatch(retrieveUserProfileImage());
                }
            });
    }
}

export function setCustomerDetails(details) {
    return {
        type: _A.SET_CUSTOMER_DETAILS,
        payload: {
            details
        }
    }

}
export function updateCustomerId(_id) {

    return {
        type: _A.SET_CUSTOMER_ID,
        payload: {
            customerId: _id
        }
    }
}


export function updateCustomerDimensions(_dim) {
    return {
        type: _A.SET_CUSTOMER_DIMENSIONS,
        payload: {
            dimensions: _dim
        }
    }
}

export function updateAdminDimensions(_adminDim) {
    return {
        type: _A.SET_ADMIN_DIMENSIONS,
        payload: {
            adminDimensions: _adminDim
        }
    }
}
export function dimensionsChanged(_dim) {
    const menuSelected = store.getState().Customer.selectedMenu;
    return (dispatch, getState) => {
        dispatch( updateCustomerSelectedDimensions( _dim ) );

        switch ( menuSelected ) {
            case 'home':

                dispatch( getFailureTimelineInfo( _dim ) );
                break;
            case 'ticket':
                // update dimentions after the customer selection changed
                dispatch( getTicketTypes( _dim ) );
                dispatch( getTicketTimelineInfo( _dim ) );

                _dim.month = getState().Dashboard.selectedMonth || 0;
                dispatch( overallTicketStatus( _dim ) );
                break;
            case 'device':
                // update charts for device
                dispatch(removeMapBoundsonchange(_dim));
                break;
            default:
                break;
        }


    }
}
export function removeMapBoundsonchange() {
    return {
        type: _A.RESET_MAP_BOUNDERS_ON_CUSTOMER_CHANGE,
    }
}
export function updateCustomerSelectedDimensions(_dim) {
    return {
        type: _A.SET_CUSTOMER_SELECTED_DIMENSIONS,
        payload: {
            selectedDimension: _dim
        }
    }
}

export function updateSelectedMenu(_item) {
    return {
        type: _A.SET_SELECTED_MENU,
        payload: {
            menu: _item
        }
    }
}
export function resetCustomerState() {
    return {
        type: _A.RESET_CUSTOMER_STATE,
    }
}
