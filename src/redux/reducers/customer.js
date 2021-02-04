import {actions as _A} from './../actions/actionTypes';
import ls from 'local-storage';

const initialState = {
    customerId: '',
    address: {},
    dimensions: [],
    selectedDimension: {},
    selectedMenu: 'home',
    adminDimensions: []
};

export function Customer(state = initialState, action) {
    switch (action.type) {
        case _A.SET_CUSTOMER_ID :
            // update customerId to the ls
            ls.set( 'customerId', action.payload.customerId );
            return {
                ...state,
                customerId: action.payload.customerId
            };
            case _A.SET_CUSTOMER_DETAILS:
            return {
                ...state,
                details: action.payload.details
            }
        case _A.SET_SELECTED_MENU :
            return {
                ...state,
                selectedMenu: action.payload.menu
            };
        case _A.SET_CUSTOMER_DIMENSIONS :
            return {
                ...state,
                dimensions: action.payload.dimensions
            };
        case _A.SET_ADMIN_DIMENSIONS :
            return {
                ...state,
                adminDimensions: action.payload.adminDimensions
            };
        case _A.SET_CUSTOMER_SELECTED_DIMENSIONS :
            return {
                ...state,
                selectedDimension: action.payload.selectedDimension
            };
        case _A.RESET_CUSTOMER_STATE:
            return initialState;
        default:
            return state;
    }
}
