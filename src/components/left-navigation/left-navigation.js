import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import HomeInactive from "../../assets/img/Home-Img.png";
import HomeActive from "../../assets/img/HomeNew.png";
import DeviceInactive from "../../assets/img/Device-Img.png";
import DeviceActive from "../../assets/img/DeviceNew.png";
import TicketInactive from "../../assets/img/Ticket-Img.png";
import TicketActive from "../../assets/img/TicketNew.png";
import SignOut from "../../assets/img/Sign-Out.png";
import "./left-navigation.scss";
import { connect } from 'react-redux';
import {updateSelectedMenu} from "../../redux/actions/customer-actions";
import PersonIcon from '@material-ui/icons/Person';
import {hideProfileDialog, showProfileDialog} from "../../redux/actions/profile-action";
import companyLogoImg from './../../assets/img/Exter-logo.png';
import {updateUserStoreData} from "../../redux/actions/login-action";


class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            show: [true, false, false],
            openprofile: false
         };
    }

    showHide = (num) => {
        this.setState((prevState) => {
            const newItems = [...prevState.show];
            newItems[num] = !newItems[num];
            return { show: newItems };
        });
    };

    profileOpen() {
        this.props.showProfileDialog();
    }
    selectedsingoutpage(){
        this.props.updateUserStoreData({});
    }
    render() {
        const {selectedMenu, setSelectedMenu} = this.props;
        const pathname = window.location.pathname;
        return (
            <section id="content">
                <div className="side-menu">
                    <div className="logo-div">
                        <img src={companyLogoImg} alt="Logo"  />
                    </div>
                    <ul className="main-ul">
                        <div className="menu-div" onClick={() => setSelectedMenu('home')}>
                                <NavLink className="nav-link" to={"/dashboard/overview"}>
                                <img src={pathname === "/dashboard/overview" ? HomeActive : HomeInactive} className="menu-image" alt="" />
                                    <span className="menu-heading">Home</span>
                                </NavLink>
                        </div>

                        <div className="menu-div" onClick={() => setSelectedMenu('device')}>
                                <NavLink className="nav-link" to={"/dashboard/devices" }>
                                <img src={pathname === "/dashboard/devices" ? DeviceActive : DeviceInactive} className="menu-image" alt="" />
                                    <span className="menu-heading">Devices</span>
                                </NavLink>
                        </div>

                        <div className="menu-div" onClick={() => setSelectedMenu('ticket')}>
                            <NavLink className="nav-link" to={"/dashboard/tickets" }>
                                <img src={pathname === "/dashboard/tickets" ? TicketActive : TicketInactive} className="menu-image" alt="" />
                                <span className="menu-heading">Tickets</span>
                            </NavLink>
                        </div>

                        <div className="menu-div sign-out" onClick={() => {setSelectedMenu( 'signout' ); this.selectedsingoutpage()}}>
                            <NavLink className="nav-link" to={"/login"}>
                                <img src={selectedMenu === 'signout' ? SignOut : SignOut} className="menu-image" alt="" />
                                <span className="menu-heading">Sign Out</span>
                            </NavLink>
                        </div>
                        <div className="menu-div Profile" onClick={() => {setSelectedMenu( 'personicon' );this.profileOpen()}}>
                            <div className="nav-link">
                                <PersonIcon className="profile-icon"/>
                                <span className="menu-heading">Profile</span>
                            </div>
                        </div>
                    </ul>
                </div>
            </section>
        );
    }
    
}


const mapStateToProps = ( state ) => {
    return {
        customerId: state.Customer.customerId,
        selectedMenu: state.Customer.selectedMenu
    }
}

const mapDispatchToProps = {
    setSelectedMenu: updateSelectedMenu,
    showProfileDialog: showProfileDialog,
    updateUserStoreData: updateUserStoreData,
    hideProfileDialog: hideProfileDialog
}

export default connect(mapStateToProps, mapDispatchToProps) (Sidebar);
