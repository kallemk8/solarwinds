import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageLayout from '../../components/page-layout/page-layout';
import './ticket-dashboard.scss';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import DoughnutChart from './../../components/charts/doughnut';
import HorizontalBarChart from '../../components/charts/horizontal-bar';
import TimelineChart from "../../components/charts/timeline";
import { getTicketTypes, overallTicketStatus } from '../../redux/actions/dashboard-actions';
import ChartLoader from './../../components/loader/chart-loader';
import { getTicketTimelineInfo } from './../../redux/actions/ticket-actions';


class TicketDashboard extends Component {


    componentDidMount() {
        
        if(this.props.cusSelectedDimension && this.props.cusSelectedDimension.id){
            this.getTicketsData();
            this.getOverallTicketStatus( this.props.cusSelectedDimension);
            this.props.getTicketTimelineInfo( this.props.cusSelectedDimension);
        }
    }

    getTicketsData() {

        this.props.retrieveTicketsData( this.props.cusSelectedDimension );
    }

    getOverallTicketStatus(_dim) {
        const req = {
            id: _dim.id,
            type: _dim.type,
            month: this.props.selectedMonth
        }
        this.props.retrieveOverallTicketStatus( req );
    }

    render() {
        const { cusSelectedDimension, ticketTypes, isLoading, noData, overallTicketStatus, overallTicketStatusIsLoading, overallTicketStatusNoData, timelineInfo, timelineInfoIsLoading  } = this.props;
        
        return (
            <PageLayout>
                <div className="ticket-container">
                    <Grid container spacing={3} justify="center">
                        
                                <Grid item xs={12} sm={12}>
                                        <Paper>
                                        { !timelineInfoIsLoading ?
                                        <TimelineChart 
                                            chartData={timelineInfo.data}
                                            isLoading={timelineInfoIsLoading}
                                            dim={cusSelectedDimension}
                                            title={timelineInfo.title} />
                                            : <ChartLoader/>}
                                        </Paper>
                                </Grid>
                        
                    </Grid>
                    <Grid container spacing={6} justify="center" >
                        <Grid item xs={12} sm={6} md={6} >
                            <Paper>
                                {
                                    overallTicketStatus ? 
                                    <DoughnutChart 
                                        chartData={overallTicketStatus.data} 
                                        options={true} 
                                        isLoading={overallTicketStatusIsLoading}
                                        noData={overallTicketStatusNoData}
                                        title={overallTicketStatus.title}/>
                                        : <ChartLoader/>
                                }
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={6} >
                            <Paper>

                            {
                                ticketTypes &&
                                !isLoading ?
                                <HorizontalBarChart 
                                    chartData={ticketTypes.data} 
                                    title={ticketTypes.title}
                                    isLoading={isLoading}
                                    noData = {noData} 
                                    chartInput={cusSelectedDimension} />
                                    : <ChartLoader/>
                            }
                            
                        </Paper>
                    </Grid>
                    </Grid>
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cusSelectedDimension: state.Customer.selectedDimension,
        ticketTypes: state.Dashboard.ticketTypes,
        isLoading: state.Dashboard.isLoading,
        noData: state.Dashboard.noData,
        isError: state.Dashboard.isError,

        selectedMonth: state.Dashboard.selectedMonth,
        overallTicketStatus: state.Dashboard.overallTicketStatus.overallTicketStatus,
        overallTicketStatusIsLoading: state.Dashboard.overallTicketStatus.isLoading,
        overallTicketStatusNoData: state.Dashboard.overallTicketStatus.noData,
        overallTicketStatusIsError: state.Dashboard.overallTicketStatus.isError,
        timelineInfo: state.Ticket.timelineInfo,
        timelineInfoIsLoading: state.Ticket.isLoading,
    };
}

const mapDispatchToProps = {
        retrieveTicketsData: getTicketTypes,
        retrieveOverallTicketStatus: overallTicketStatus,
        getTicketTimelineInfo: getTicketTimelineInfo
}


export default connect(mapStateToProps, mapDispatchToProps)(TicketDashboard);
