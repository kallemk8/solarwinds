import React, { Component } from "react";
import { connect } from 'react-redux';
import './device-dashboard.scss';
import PageLayout from "../../components/page-layout/page-layout";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Loader from "../../components/loader/loader";
import DeviceList from "../../components/device-list/device-list";
//import { getFailureTimelineInfo, getTicketTimelineInfo } from './../../redux/actions/ticket-actions';
import DeviceCategoryChart from './../../components/device-charts/device-category-chart';
import OverallDeviceStatus from './../../components/device-charts/overall-device-status';
import DeviceCategoryStatusChart from './../../components/device-charts/device-category-status-chart';
import DeviceMap from './../../components/maps/google-map';

class DeviceDashboard extends Component {
  constructor( props ) {
    super( props );
    // Initialize state
    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { isLoading } = this.state;
    const { showDeviceDialog, cusSelectedDimension, bounds } = this.props;
    if ( isLoading ) {
      return <Loader width="10" height="20" />
    }
    // temporary fix
    if ( cusSelectedDimension && !cusSelectedDimension.type){
      cusSelectedDimension['type']='customer';
    }

    return (
      <PageLayout>
        <div className="dashbaord-container">
          <DeviceMap chartInput={cusSelectedDimension} />
          <Grid container spacing={3} justify="center">
            <Grid item xs={12} sm={12}>
              <Paper>
                <DeviceCategoryStatusChart chartInput={cusSelectedDimension} bounds={bounds} />
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={6} justify="start">
            <Grid item xs={12} sm={6} md={6}>
              <Paper>
                <OverallDeviceStatus chartInput={cusSelectedDimension} bounds={bounds}/>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Paper>
                <DeviceCategoryChart chartInput={cusSelectedDimension} bounds={bounds}/>
              </Paper>
            </Grid>
          </Grid>
        </div>
        {
          showDeviceDialog &&
          <DeviceList />
        }
      </PageLayout>
    );
  }
}
const mapStateToProps = ( state ) => {
  return {
    showDeviceDialog: state.DeviceList.showDialog,
    cusSelectedDimension: state.Customer.selectedDimension,
    bounds:state.DeviceList.bounds.bounds
  }
};

const mapDispatchToProps = {
};


export default connect( mapStateToProps, mapDispatchToProps )( DeviceDashboard );

