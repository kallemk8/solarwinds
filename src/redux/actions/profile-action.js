import {actions as _A} from './../actions/actionTypes';
import {fetchApiGet, fetchApiPut, fetchImageGet} from "../../helpers/data-access/data-access-service";

export function retrieveUserProfile() {
    return dispatch => {
        fetchApiGet(process.env.REACT_APP_RETRIEVE_PROFILE)
            .then(resp => {
                if (resp) {
                    dispatch(updateProfile(resp));
                }
            })
    }
}

export function retrieveUserProfileImage() {
    return dispatch => {
        fetchImageGet(process.env.REACT_APP_RETRIEVE_AVATAR)
            .then(resp => {
                if (resp) {
                    dispatch(updateProfileImage(resp));
                }
            })
    }
}
export function updateUserProfile(req) {
    return dispatch => {
        fetchApiPut(process.env.REACT_APP_UPDATE_PROFILE, req)
            .then(resp => {
                if (resp) {
                    dispatch(retrieveUserProfile());
                }
            })
    }
}
export function resetUserPassword (password) {
    return dispatch => {
        fetchApiPut( process.env.REACT_APP_RESET_USER_PASSWORD, password )
            .then( resp => {
                if ( resp ) {
                    // dispatch( retrieveUserProfile() );

                }
            } )
    }
    

}
export function updateUserProfileAddress( req ) {
    return dispatch => {
        fetchApiPut( process.env.REACT_APP_UPDATE_PROFILE_ADDRESS, req.address )
            .then( resp => {
                if ( resp ) {
                    dispatch( retrieveUserProfile() );
                }
            } )
    }
}

export function showProfileDialog() {
    return {
        type: _A.SHOW_PROFILE_DIALOG
    }
}

export function hideProfileDialog() {
    return {
        type: _A.HIDE_PROFILE_DIALOG
    }
}

export function updateProfile(_profile) {
    return {
        type: _A.UPDATE_PROFILE,
        payload: {
            profile: _profile
        }
    }
}

export function updateProfileImage(_profileImage) {
    return {
        type: _A.UPDATE_PROFILE_IMAGE,
        payload: {
            profileImage: _profileImage
        }
    }
}

export function resetProfileState() {
    return {
        type: _A.RESET_PROFILE_STATE,
    }
}
