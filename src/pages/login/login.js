import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import "./login.scss";
import companyLogo from './../../assets/img/EN-white.png';
import { LoginPage } from '@fe-sales/common-ui';
import {connect} from "react-redux";
import {signIn, updateLoginError, updateUserStoreData} from "../../redux/actions/login-action";
import Loader from "../../components/loader/loader";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

class Login extends Component {

    loginUser(userCred) {
        this.props.login(userCred, this.props.history)
    }
    logoutUser() {
        this.props.logOut({});
    }

    closeError() {
        this.props.updateLoginError('');
    }

    componentDidMount() {
        this.logoutUser();
    }
    render() {
        const {isLoading, errorMsg} = this.props;
        return (
            <div className="containerAuth">
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={10} sm={10} md={3} lg={3} className="login-container">
                        <LoginPage
                            title={'Network Operation Center'}
                            companyLogo={companyLogo}
                            onLogin={(cred) => {this.loginUser(cred)}}
                            />
                    </Grid>
                </Grid>
                {
                    isLoading &&
                    <Loader />
                }
                {
                    errorMsg && errorMsg.length > 0 &&
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
                        open={true}
                        autoHideDuration={6000}
                        onClose={() => {this.closeError()}}
                    >
                        <Alert variant="filled" severity="error" onClose={() => {this.closeError()}}>{errorMsg}</Alert>

                    </Snackbar>

                }
            </div>
    );
    }
}

const mapStateToProps = ( state ) => {
    return {
        isLoading: state.Login.isLoading,
        errorMsg: state.Login.loginError
    }
};

const mapDispatchToProps = {
    login: signIn,
    logOut: updateUserStoreData,
    updateLoginError: updateLoginError
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
