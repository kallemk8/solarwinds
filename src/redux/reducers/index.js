/**
 * Import all the Reducers used in the App and add them to reducers object.
 */
import { combineReducers } from "redux";
import {DeviceList} from './device-list';
import {Customer} from './customer';
import { Dashboard } from './dashboard';
import { Ticket } from './ticket';
import { Profile } from './profile';
import { Login } from './login';

export default combineReducers({
    Login,
    DeviceList,
    Dashboard,
    Customer,
    Ticket,
    Profile
});
