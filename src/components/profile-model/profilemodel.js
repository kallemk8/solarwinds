import React from "react";


import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {retrieveUserProfileImage, updateUserProfile} from "../../redux/actions/profile-action";
import { updateUserProfileAddress, resetUserPassword } from './../../redux/actions/profile-action';
import { connect } from "react-redux";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {fetchImagePost} from '../../helpers/data-access/data-access-service';
import DefaultProfile from "../../assets/img/Profile-1.png";

import "./profilemodel.scss";
import { Avatar } from "@material-ui/core";


class ProfileModel extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            openprofile: this.props.showModel,
            ResetPassword: false,
            showPassword: false,
            repeatPassword: false,
            successMessage: '',
            password:'',
            repeatPasswordInput:'',
            pic:"",
            profile: {
                firstName: '',
                lastName: '',
                email: '',
                mobile: '',
                address: {
                    address1: '',
                    address2: '',
                    city: '',
                    subDivision: '',
                    state: '',
                    zip: '',
                    country: ''
                    
                }
            },
            profileErrors: {
                exists : true
            },
            resetPasswordErrors:{exists : true}
            
        };
        this.myInput = React.createRef();
        
    }

    submitResetPassword(){
       this.props.resetUserPassword( { password: this.state.password } );
        this.setState( {
            successMessage: 'Password Updated Successfully!',
            password: '',
            repeatPasswordInput: '',
            resetPasswordErrors: { exists: true },
            ResetPassword: false 
        },() => {
            this.isResetPasswordFormvalid();
        });

    }
    ResetPassword () {
        this.setState( { ResetPassword: true } );
    }

    CloseResetPassword() {
        this.setState({password:'',
        repeatPasswordInput:'',resetPasswordErrors:{exists : true}});
        this.setState( { ResetPassword: false } );
        
    }

    componentDidMount() {
        const { profile } = this.props;
        
        if(profile.firstName || profile.lastName || profile.email || profile.mobile 
            || profile.address){
        this.setState( {
            profile: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                mobile: profile.mobile,
                address: {
                    address1: profile.address.address1,
                    address2: profile.address.address2,
                    city: profile.address.city,
                    subDivision: profile.address.subDivision,
                    zip: profile.address.zip,
                    country: profile.address.country,

                }
            } 
        } );
    }
    }
    updateProfileimage(selectedimage) {
        const profileimageFormData = new FormData();
        profileimageFormData.append("file",selectedimage.target.files[0]);
        fetchImagePost(process.env.REACT_APP_RETRIEVE_AVATAR, profileimageFormData)
            .then(resp => {
                if (resp) {
                    this.props.getUserProfileImage();
                }
            });
    }

    componentWillReceiveProps( nextProps ) {
        console.log(nextProps);
        if ( nextProps && nextProps.profile ) {
            if(nextProps.profile.firstName || nextProps.profile.lastName || nextProps.profile.email || nextProps.profile.mobile 
                || nextProps.profile.address){
            this.setState( {
                profile: {
                    firstName: nextProps.profile.firstName,
                    lastName: nextProps.profile.lastName,
                    email: nextProps.profile.email,
                    mobile: nextProps.profile.mobile,
                    address: {
                        address1: nextProps.profile.address.address1,
                        address2: nextProps.profile.address.address2,
                        city: nextProps.profile.address.city,
                        subDivision: nextProps.profile.address.subDivision,
                        zip: nextProps.profile.address.zip,
                        country: nextProps.profile.address.country
                    }

                }
            } );
        }
        }
    }

    updatePassword(event) {
        this.setState( {
                ...this.state,
                password: event.target.value
        }, () => {
            this.isResetPasswordFormvalid();
        });

    }
    updateRepeatPassword(event) {
        this.setState( {
            ...this.state,
            repeatPasswordInput: event.target.value
        }, () => {
            this.isResetPasswordFormvalid();
        } );
    }

    updateProfileValue( _name, event, child=null ) {
        //const updatedProfile = {};
        if(child){

            this.setState( {
                profile: {
                    ...this.state.profile,
                    [child]: {
                        ...this.state.profile.address,
                        [_name]: event.target.value
                    }
                },
            }, () => {
                this.isFormValid();
            } );

        }else {
            this.setState( {
                profile: {
                    ...this.state.profile,
                    [_name]: event.target.value
                },
            }, () => {
                this.isFormValid();
            } );
        }


    }

    updateProfile() {
        const { firstName,
            lastName ,
            email ,
            mobile, address} = this.state.profile;

        this.props.updateUserProfile( {
            firstName,
            lastName,
            email,
            mobile
        } );

        address.location = {
            "coordinates": [
                0, 0
            ]
        };
        this.props.updateUserProfileAddress( {
            address
        } );

        this.setState( {
            successMessage :'Profile Saved Successfully!'
        });

    }
    isResetPasswordFormvalid(){
        const password = this.state.password;
        const repeatPasswordInput = this.state.repeatPasswordInput;
        const errors = {};
        let isDisabled = false;
        if ( typeof password !== "undefined" ) {
            let pattern = new RegExp( /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/ );
        
            if ( !pattern.test( password ) ) {
                isDisabled = true;
                errors["password"] = "Please enter valid password.";
            }
        }
        if ( typeof repeatPasswordInput !== "undefined" ) {
        
            if ( password !== repeatPasswordInput ) {
                isDisabled = true;
                errors["repeatPasswordInput"] = "Please enter valid repeatPassword.";
            }
        }

 

        errors['exists'] = isDisabled;

        this.setState( {
            resetPasswordErrors: errors
        } );
    }
    isFormValid() {
        const profile = this.state.profile;
        //const password = this.state.password;
        //const repeatPasswordInput = this.state.repeatPasswordInput;
        const errors = {};
        let isDisabled = false;

        if ( !profile["firstName"] ) {
            isDisabled = true;
            errors["firstName"] = "Please enter your first name.";
        }

        if ( !profile["lastName"] ) {
            isDisabled = true;
            errors["lastName"] = "Please enter your last name.";
        }

        if ( !profile["email"] ) {
            isDisabled = true;
            errors["email"] = "Please enter your email Address.";
        }

        if ( typeof profile["email"] !== "undefined" ) {

            let pattern = new RegExp( /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i );
            if ( !pattern.test( profile["email"] ) ) {
                isDisabled = true;
                errors["email"] = "Please enter valid email address.";
            }
        }

        if ( !profile["mobile"] ) {
            isDisabled = true;
            errors["mobile"] = "Please enter your mobile number.";
        }
        if ( !profile.address?.address1 ) {
            isDisabled = true;
            errors["address1"] = "Please enter your Address1.";
        }
        if ( !profile.address?.address2 ) {
            isDisabled = true;
            errors["address2"] = "Please enter your Address2.";
        }
        if ( !profile.address?.city ) {
            isDisabled = true;
            errors["city"] = "Please enter your city.";
        }
        if ( !profile.address?.subDivision ) {
            isDisabled = true;
            errors["subDivision"] = "Please enter your State.";
        }
        if ( !profile.address?.zip ) {
            isDisabled = true;
            errors["zip"] = "Please enter your Zip.";
        }
        if ( !profile.address?.country ) {
            isDisabled = true;
            errors["country"] = "Please enter your Country.";
        }
        if ( typeof profile["mobile"] !== "undefined" ) {
            let pattern = new RegExp( /^\d{10}$/ );

            if ( !pattern.test( profile["mobile"] ) ) {
                isDisabled = true;
                errors["mobile"] = "Please enter valid 10 degit mobile number.";
            }
        }

        // if ( typeof password !== "undefined" ) {
        //     let pattern = new RegExp( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ );
        //
        //     if ( !pattern.test( password ) ) {
        //         isDisabled = true;
        //         errors["password"] = "Please enter valid password.";
        //     }
        // }
        // if ( typeof repeatPasswordInput !== "undefined" ) {
        //
        //     if ( password !== repeatPasswordInput ) {
        //         isDisabled = true;
        //         errors["repeatPasswordInput"] = "Please enter valid repeatPasswordInput.";
        //     }
        // }

 

        errors['exists'] = isDisabled;

        this.setState( {
            profileErrors: errors
        } );


    }

    savedSuccessfully( event, reason) {
        if ( reason === 'clickaway' ) {
            return;
        }
        this.setState( {
            successMessage: ''
        } );

    }

    toggleShowPassword(event){
        event.preventDefault();
        
        const showPassword = !this.state.showPassword;

        this.setState( {
            showPassword: showPassword
        } );

    }

    toggleShowRepeatPassword(event) {
        event.preventDefault();
        const repeatPassword = !this.state.repeatPassword;
        this.setState( {
            repeatPassword: repeatPassword
        } );

    }
    //hiddenFileInput = React.useRef(null);
    handleClick (){
        this.myInput.current.click();
      };
    render() {
        const { profile, profileErrors, successMessage, resetPasswordErrors} = this.state;
        return (
            <div>

                <Fade in={this.state.openprofile}>
                    <div className="paper">
                        <div className="profile-head">
                            <h2>
                                Profile
                            </h2>
                            <div>
                                <CloseIcon onClick={() => this.props.handlclick()} />
                            </div>
                        </div>
                        <div id="profile-page">
                        <div className="profile-txt">
                            <div className={this.props.profileImg ? "profileimageshow": "profileimageshow show"}  onClick={()=>this.handleClick()}  >
                                <div className="upload-onhouver">Upload</div>
                                <Avatar alt="Remy Sharp"  src={this.props.profileImg ? this.props.profileImg :  DefaultProfile}/>
                                <input accept="image/*" type="file" ref={this.myInput} onChange={(e)=>this.updateProfileimage(e)} style={{display:"none"}}  id="icon-button-file" />
                            </div>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={profile.firstName}
                                    onChange={( e ) => { this.updateProfileValue( 'firstName', e ) }}
                                />
                                {
                                    this.state.profileErrors.firstName &&
                                    <div className="validation-error">{this.state.profileErrors.firstName}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    value={profile.lastName}
                                    onChange={( e ) => { this.updateProfileValue( 'lastName', e ) }}
                                />
                                {
                                    this.state.profileErrors.lastName &&
                                    <div className="validation-error">{this.state.profileErrors.lastName}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={profile.email}
                                    onChange={( e ) => { this.updateProfileValue( 'email', e ) }}
                                />
                                {
                                    this.state.profileErrors.email &&
                                    <div className="validation-error">{this.state.profileErrors.email}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="mobile"
                                    label="Mobile"
                                    id="mobile"
                                    autoComplete="mobile"
                                    value={profile.mobile}
                                    onChange={( e ) => { this.updateProfileValue( 'mobile', e ) }}
                                />
                                {
                                    this.state.profileErrors.mobile &&
                                    <div className="validation-error">{this.state.profileErrors.mobile}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="address1"
                                    label="Address 1"
                                    id="address1"
                                    autoComplete="address1"
                                    value={profile.address?.address1}
                                        onChange={( e ) => { this.updateProfileValue( 'address1', e, 'address') }}
                                />
                                {
                                    this.state.profileErrors.address1 &&
                                    <div className="validation-error">{this.state.profileErrors.address1}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="address2"
                                    label="Address 2"
                                    id="Address2"
                                    autoComplete="address2"
                                    value={profile.address?.address2}
                                        onChange={( e ) => { this.updateProfileValue( 'address2', e, 'address' ) }}
                                />
                                {
                                    this.state.profileErrors.address2 &&
                                    <div className="validation-error">{this.state.profileErrors.address2}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="city"
                                    label="City"
                                    id="City"
                                    autoComplete="city"
                                    value={profile.address?.city}
                                        onChange={( e ) => { this.updateProfileValue( 'city', e, 'address' ) }}
                                />
                                {
                                    this.state.profileErrors.city &&
                                    <div className="validation-error">{this.state.profileErrors.city}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="state"
                                    label="State"
                                    id="state"
                                    autoComplete="state"
                                    value={profile.address?.subDivision}
                                        onChange={( e ) => { this.updateProfileValue( 'subDivision', e, 'address' ) }}
                                />
                                {
                                    this.state.profileErrors.subDivision &&
                                    <div className="validation-error">{this.state.profileErrors.subDivision}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="zip"
                                    label="Zip"
                                    id="zip"
                                    autoComplete="zip"
                                    value={profile.address?.zip}
                                        onChange={( e ) => { this.updateProfileValue( 'zip', e, 'address' ) }}
                                />
                                {
                                    this.state.profileErrors.zip &&
                                    <div className="validation-error">{this.state.profileErrors.zip}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="country"
                                    label="Country"
                                    id="country"
                                    autoComplete="country"
                                    value={profile.address?.country}
                                        onChange={( e ) => { this.updateProfileValue( 'country', e, 'address' ) }}
                                />
                                {
                                    this.state.profileErrors.country &&
                                    <div className="validation-error">{this.state.profileErrors.country}</div>
                                }
                            </Grid>
                            <div className="profile-margin"></div>
                             {/* <div>
                                Errors: { JSON.stringify( this.state.profileErrors)}
                            </div>  */}
                            <Button 
                                variant="contained" 
                                className={['profile-btn', profileErrors.exists ? 'btn-disabled' : '']}
                                disabled={profileErrors.exists} 
                                onClick={() => { this.updateProfile() }}>
                                Save
                            </Button>
                            <div className="profile-margin"></div>

                            <div className="profile-margin"></div>
                            <div className="forget-link" href=""
                                onClick={() => this.ResetPassword()}>
                                Reset Password
                            </div>
                            <div className="profile-margin"></div>

                            {
                                this.state.ResetPassword &&
                                <div>
                                    <Grid item xs={12}>

                                        <InputLabel htmlFor="standard-adornment-password" className="label-text">Password</InputLabel>
                                        <Input className="forget-txt"
                                            id="standard-adornment-password"
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            required
                                            name="password"
                                            label="password"                                            
                                            autoComplete="password"
                                            value={this.state.password}
                                            onChange={(e) => {this.updatePassword(e)}}

                                            endAdornment={
                                                <InputAdornment position="end">
                                                    
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={( e ) => this.toggleShowPassword( e )}

                                                    >
                                                        {this.state.showPassword ? <Visibility className="eye-icon" /> : <VisibilityOff className="eye-icon" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                            {
                                                this.state.resetPasswordErrors.password &&
                                                <div className="validation-error">{this.state.resetPasswordErrors.password}</div>
                                            }
                                    </Grid>
                                    <div className="profile-margin"></div>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="standard-adornment-password" className="label-text">Repeat Password</InputLabel>
                                        <Input className="forget-txt"
                                            id="standard-adornment-repeatPassword"
                                            type={this.state.repeatPassword ? 'text' : 'password'}
                                            value={this.state.repeatPasswordInput}
                                                onChange={( e ) => { this.updateRepeatPassword(  e) }}

                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={(e) => this.toggleShowRepeatPassword(e)}
                                                    >
                                                        
                                                        {this.state.repeatPassword ? <Visibility className="eye-icon" /> : <VisibilityOff className="eye-icon" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                            {
                                                this.state.resetPasswordErrors.repeatPasswordInput &&
                                                <div className="validation-error">{this.state.resetPasswordErrors.repeatPasswordInput}</div>
                                            }
                                    </Grid>
                                    <div className="profile-margin"></div>
                                    <div className="password-helpMsge">Password must be at least 8 characters long and contain a digit, an uppercase letter and a lowercase letter</div>
                                    <div className="reset-pwd-btns">
                                        <Button 
                                            variant="contained" 
                                            className={['reset-btn', resetPasswordErrors.exists ? 'btn-disabled' : '']}
                                            disabled={resetPasswordErrors.exists} 
                                            onClick={() => this.submitResetPassword()}>
                                            Reset
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="cancel-btn"
                                            onClick={() => this.CloseResetPassword()}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            }
                            
                        </div>
                        <div className="profile-success">
                            {
                                successMessage && successMessage.length > 0 &&
                                <Snackbar
                                    open={true}
                                    autoHideDuration={2000}
                                    onClose={( event, reason ) => { this.savedSuccessfully( event, reason ) }}>
                                    <Alert className="profile-success"
                                        onClose={( event, reason ) => { this.savedSuccessfully( event, reason ) }}

                                        severity="success">
                                        {successMessage}
                                    </Alert>
                                </Snackbar>
                            }


                        </div>
                        </div>
                    </div>
                    
                </Fade>
            </div>
        )
    }
}

const mapStateToProps = ( state ) => {
    console.log(state);
    return {
        profile: state.Profile.profileInfo,
        profileImg: state.Profile.profileImage
    };
};

const mapDispatchToProps = {
    updateUserProfile: updateUserProfile,
    updateUserProfileAddress: updateUserProfileAddress,
    resetUserPassword: resetUserPassword,
    getUserProfileImage: retrieveUserProfileImage
};

export default connect( mapStateToProps, mapDispatchToProps )( ProfileModel );

