import {actions as _A} from './../actions/actionTypes';
import {fetchApiGet, fetchApiPost} from "../../helpers/data-access/data-access-service";
import {
    dimensionsChanged,
    getCustomerDimensions,
    updateCustomerId,
    updateSelectedMenu,
    resetCustomerState,
    setCustomerDetails,
    updateAdminDimensions
} from "./customer-actions";
import {retrieveUserProfile, resetProfileState, retrieveUserProfileImage} from "./profile-action";
//import store from '../store';
import { resetTicketState } from './ticket-actions';
import { resetDeviceListState } from './device-list-actions';
import { resetDashboardState } from './dashboard-actions';

export function signIn(userCred, navHistory) {
    return dispatch => {
        dispatch(showLoginLoader());

        //Call The Login API
        const req = {
            email: userCred.user,
            password: userCred.password,
        };
        fetchApiPost(process.env.REACT_APP_LOGIN, req)
            .then(resp => {
                if (resp && resp.code && resp.code === 200) {
                    dispatch( getCustomerId(userCred.user));
                    
                    dispatch(hideLoginLoader());
                    navHistory.push('/dashboard/overview');
                    dispatch(retrieveUserProfile());
                    dispatch(retrieveUserProfileImage());
                } else {
                    if (resp.error) {
                        dispatch(updateLoginError(resp.error.message));
                    }
                    dispatch(hideLoginLoader());
                }
            });
    }
}

export function getCustomerId( email ) {
    return dispatch => {
        //Call The User Mapping API
        fetchApiGet( process.env.REACT_APP_USER_MAPPINGS + '/' + email )
            .then( resp => {
                if ( resp.customers && resp.customers.length >0 && resp.customers[0].id  ) {
                    const customer = resp.customers[0];
                    const req = {
                        id: customer.id,
                        type: 'customer'
                    };
                    const details = customer.details|| {};
                    if ( resp.isAdmin) {
                        details.custName = customer.name;
                    }

                    dispatch( updateEmailId( email ) );
                    dispatch( setCustomerDetails( details ));
                    dispatch( updateCustomerId( customer.id ) );
                    dispatch( updateSelectedMenu('home'));


                    /**
                     * Logic to Prepare the Dimension Object for the Admin
                     */
                    if (resp.isAdmin && resp.customers && resp.customers.length > 0) {
                        let allCustomers = [];
                        resp.customers.forEach((customer) => {
                            let tempCustomer = {};
                            tempCustomer.customerName = customer.name;
                            tempCustomer.sites = [];
                            tempCustomer.sites.push({
                                id: customer.id,
                                type: customer.type,
                                name: customer.name
                            });
                            if (customer.details && customer.details.sites && customer.details.sites.length > 0) {
                                tempCustomer.sites = tempCustomer.sites.concat(customer.details.sites);
                            }
                            allCustomers.push(tempCustomer);
                        });
                        dispatch(updateAdminDimensions(allCustomers));
                        dispatch( dimensionsChanged( allCustomers[0].sites[0] ) );  //TODO Need to set the default Value from the BE Response.
                    } else {//Customer Login - GET data for the Normal Dropdown
                        dispatch( getCustomerDimensions( customer.id, email ) );
                        dispatch( dimensionsChanged( req ) );
                    }
                } else {
                    if ( resp.error ) {
                    }
                }
            } );
    }
}

export function updateUserStoreData( userState ) {
    return dispatch => {
        // Clear the state for logged in user
        dispatch( resetLoginState() );
        dispatch( resetCustomerState() );
        dispatch( resetTicketState() );
        dispatch( resetProfileState() );
        dispatch( resetDeviceListState() );
        dispatch( resetDashboardState() );

    }
}



export function updateEmailId(email) {
    return {
        type: _A.SET_EMAIL_ID,
        payload: {
            email
        }
    }
}

export function showLoginLoader() {
    return {
        type: _A.SHOW_LOGIN_LOADER
    }
}

export function hideLoginLoader() {
    return {
        type: _A.HIDE_LOGIN_LOADER
    }
}

export function updateLoginError(_msg) {
    return {
        type: _A.UPDATE_LOGIN_ERROR,
        payload: {
            message : _msg
        }
    }
}


export function resetLoginState() {
    return {
        type: _A.RESET_LOGIN_STATE,
    }
}

