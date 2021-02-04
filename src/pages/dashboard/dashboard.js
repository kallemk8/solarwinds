import React, { Component } from 'react';
import { connect } from "react-redux";
import PageLayout from "../../components/page-layout/page-layout";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import TotalIssues from "../../components/widgets/total-issues";
import DeviceTypeChart from "../../components/widgets/device-type-chart";
//import TicketFailureChart from "../../components/widgets/ticket-failure-chart";
import './dashboard.scss';
import Loader from "../../components/loader/loader";
import DeviceList from "../../components/device-list/device-list";
import { withRouter } from "react-router";
import { getFailureTimelineInfo } from './../../redux/actions/ticket-actions';
import TimelineChart from './../../components/charts/timeline';

class DashboardComponent extends Component {
    constructor( props ) {
        super( props );
        // Initialize state
        this.state = {
            isLoading: false,
        };
    }
   
    
    componentDidMount () {
        if(this.props.cusSelectedDimension && this.props.cusSelectedDimension.id){
            this.updateTimelineChart( this.props.cusSelectedDimension );
        }
        
    }

    updateTimelineChart(_dim ){
        this.props.getFailureTimelineInfo( _dim );

    }

    render() {
        const { isLoading } = this.state;
        const { showDeviceDialog, cusSelectedDimension, failureTimelineInfo, failureTimelineInfoIsLoading} = this.props;
        if ( isLoading ) {
            return <Loader width="10" height="20" />
        }

        return (
            <PageLayout>
                <div className="dashbaord-container">
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12} sm={12}>
                            <Paper>
                                {
                                    !failureTimelineInfoIsLoading &&
                                    <TimelineChart
                                        chartData={failureTimelineInfo.data}
                                        isLoading={failureTimelineInfoIsLoading}
                                        dim={cusSelectedDimension}
                                        title={failureTimelineInfo.title} />

                                }
                                
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6} justify="start">
                        <Grid item xs={12} sm={6} md={6}>
                            <Paper>
                                <TotalIssues chartInput={cusSelectedDimension}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Paper>
                                <DeviceTypeChart chartInput={cusSelectedDimension}/>
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
    console.log('dashboard state ---> ', state);
    return {
        showDeviceDialog: state.DeviceList.showDialog,
        cusSelectedDimension: state.Customer.selectedDimension,
        failureTimelineInfo: state.Ticket.failureTimelineInfo.items,
        failureTimelineInfoIsLoading: state.Ticket.failureTimelineInfo.isLoading,
    }
};

const mapDispatchToProps = {
    getFailureTimelineInfo: getFailureTimelineInfo
};

const DC =  withRouter(DashboardComponent)
export default connect( mapStateToProps, mapDispatchToProps )( DC );
