import {actions as _A} from './../actions/actionTypes';

const initialState = {
    showUserProfileDialog: false,
    profileInfo: {},
    profileImage: null

};

export function Profile(state = initialState, action) {
    switch (action.type) {
        case _A.SHOW_PROFILE_DIALOG:
            return {
                ...state,
                showUserProfileDialog: true
            };
        case _A.HIDE_PROFILE_DIALOG:
            return {
                ...state,
                showUserProfileDialog: false
            };
        case _A.UPDATE_PROFILE:
            return {
                ...state,
                profileInfo: action.payload.profile
            };
        case _A.UPDATE_PROFILE_IMAGE:
            return {
                ...state,
                profileImage: action.payload.profileImage
            };
            case _A.RESET_PROFILE_STATE:
        case _A.RESET_TICKET_STATE:
            return initialState;

        default:
            return state;
    }
}
