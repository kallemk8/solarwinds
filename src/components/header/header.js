import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./header.scss";
import Logo from "../../assets/img/Profile-1.png";
import ExterLogo from "../../assets/img/en.png";
import QBLogo from "../../assets/img/qb.png";
import { connect } from "react-redux";
import { dimensionsChanged } from "../../redux/actions/customer-actions";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import ProfileModel from "../profile-model/profilemodel";
import {hideProfileDialog, showProfileDialog} from "../../redux/actions/profile-action";
//import HirarchicalDropdown from './hirarchical-dropdown/hirarchical-dropdown';
import AccordianModel from "./accordian-dropdown/accordian-dropdown";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ResetPassword: false,
      showPassword: true,
      repeatPassword: true,
      accordianModel: false
    };
  }

  handleChange(data) {
    this.setState({ cusSelectedDimension: data });
    this.props.setCustomerSelectedDimension(data);
    this.setState({accordianModel: false})
  }

  accordianOpen() {
    this.setState({ accordianModel: true })
  }

  accordianClose() {
    this.setState({ accordianModel: false })
  }

  profileOpen() {
    this.props.showProfileDialog();
  }

  profileClose() {
    this.props.hideProfileDialog();
  }

  ResetPassword() {
    this.setState({ ResetPassword: true });
  }

  CloseResetPassword() {
    this.setState({ ResetPassword: false });
  }

  render() {
    const {
      cusDimension,
      cusSelectedDimension,
      cusDetails,
      showProfile,
      adminDimension,
      profileImg
    } = this.props;
    const accordianModel = this.state.accordianModel

    return (
      <div className="root">
        <AppBar className="header-fixed">
          <Toolbar>
            {
              cusDetails &&
                  <div className="left-header">
                    <img src={cusDetails && cusDetails.custId && cusDetails.custId === '113' ? QBLogo : ExterLogo} alt="Logo" className="cust-logo"/>
                    <Typography variant="h4" className="title">
                      <div className="logo-head"> {cusDetails.custName}</div>
                      <div className="logo-sub-head">{cusDetails.details?.state ? cusDetails.details?.state : 'New York'}, {cusDetails.details?.country ? cusDetails.details?.country : ' US'}</div>
                    </Typography>
                  </div>

            }
            <div className="avatar-icon rounded Header-right">
              <div className="sitename">Site Name</div>
              {cusDimension && cusDimension.length > 0 && (
                  <div className="select-drp">
                    <FormControl className="formControl">
                      <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          value={cusSelectedDimension}
                          onChange={(event) =>
                              this.handleChange(event.target.value)
                          }
                      >
                        {/*<MenuItem value={0}>*/}
                        {/*    All*/}
                        {/*</MenuItem>*/}
                        {cusDimension &&
                        cusDimension.length > 0 &&
                        cusDimension.map((dd) => (
                            <MenuItem value={dd} key={dd.id} className="menu-text-color">
                              {dd.name}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
              )}

              {
                adminDimension && adminDimension.length > 0 && (
                  <div className="select-acc-drp">
                      {/* <HirarchicalDropdown /> */}
                      <div onClick={() => this.accordianOpen()} className="accordian-drp">
                      {cusSelectedDimension.name}
                      <ArrowDropDownIcon className="acc-drp-arrow" />
                      </div> 
                  </div>
                )
              }
              <IconButton
                className="head-img-position"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <img
                  src={profileImg ? profileImg : Logo}
                  alt="Logo"
                  className="head-image"
                  onClick={() => this.profileOpen()}
                />
              </IconButton>
            </div>
            <Modal
              className="modal header-model"
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={showProfile}
              onClose={() => this.profileClose()}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <ProfileModel showModel={showProfile} handlclick={() => this.profileClose()} />
            </Modal>

<div id="accordian-tree">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className="modal acc-tree-view"
              open={accordianModel}
              onClose={() => this.accordianClose()}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <AccordianModel data={adminDimension} handlclick={(data) => this.handleChange(data)} />
            </Modal>

            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cusDetails: state.Customer.details,
    cusDimension: state.Customer.dimensions,
    adminDimension: state.Customer.adminDimensions,
    cusSelectedDimension: state.Customer.selectedDimension,
    showProfile: state.Profile.showUserProfileDialog,
    profileImg: state.Profile.profileImage
  };
};

const mapDispatchToProps = {
  setCustomerSelectedDimension: dimensionsChanged,
  showProfileDialog: showProfileDialog,
  hideProfileDialog: hideProfileDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);