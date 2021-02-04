import React, { Component } from 'react'
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.scss";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import TicketsDashboard from "./pages/tickets/ticket-dashboard";
import { Provider } from 'react-redux';
import store from './redux/store';
import DeviceDashboard from './pages/devices/device-dashboard';
import ls from 'local-storage';
import {getCustomerId} from "./redux/actions/login-action";


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Switch>
                    <PrivateRoute path="/dashboard/overview">
                        <Dashboard />
                    </PrivateRoute>
                    <PrivateRoute path="/dashboard/tickets">
                        <TicketsDashboard />
                    </PrivateRoute>
                    <PrivateRoute path="/dashboard/devices">
                        <DeviceDashboard />
                    </PrivateRoute>
                    {/*<Route exact path="/dashboard/overview" component={Dashboard} />*/}
                    {/*<Route exact path="/dashboard/tickets" component={TicketsDashboard} />*/}
                    {/*<Route exact path="/dashboard/devices" component={DeviceDashboard} />*/}
                    <Route path="/Login" component={Login} />
                    <Redirect to="/Login" />
                </Switch>
            </Provider>
        );
    }
}

function PrivateRoute({ children, ...rest }) {
    let auth = false;
    let storeCustomerId = store.getState().Customer?.customerId;
    let lsCustomerId = ls.get( 'customerId' );
    let email = ls.get( 'email' );
    if (ls.get('accessToken')) {
        if ( !storeCustomerId && lsCustomerId ){
            // set customerId to store.
            // store.dispatch( getCustomerDimensions( lsCustomerId, email ) );
            store.dispatch( getCustomerId( email ) );
        }
        auth = true;
    }
    return (
        <Route
            {...rest}
            render={() =>
                auth ? (
                    children
                ) : (
                    <Redirect to="/Login"/>
                )
            }
        />
    );
}


