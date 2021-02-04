import {actions as _A} from './../actions/actionTypes';
import  ls  from 'local-storage';

const initialState = {
    isLoading: false,
    email: '',
    loginError: ''
};

export function Login(state = initialState, action) {
    switch (action.type) {
        case _A.SHOW_LOGIN_LOADER:
            return {
                ...state,
                isLoading: true
            };
        case _A.HIDE_LOGIN_LOADER:
            return {
                ...state,
                isLoading: false
            };
        case _A.SET_EMAIL_ID:
            // update customerId to the ls
            ls.set( 'email', action.payload.email );
            return {
                ...state,
                email: action.payload.email
            };

        case _A.UPDATE_LOGIN_ERROR:
            return {
                ...state,
                loginError: action.payload.message
            };
        case _A.RESET_LOGIN_STATE:
            // update customerId to the ls
            ls.set( 'customerId', '' );
            ls.set( 'email', '' );
            ls.set( 'accessToken', '' );
            return initialState;

        default:
            return state;
    }
}
