import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2';
//import { connect } from "react-redux";

import "../../assets/scss/common.scss";

import {fetchApiPost } from '../../helpers/data-access/data-access-service';
import ChartLoader from "../loader/chart-loader";
//TODO Move it to Common Utils later
import Chart from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.plugins.unregister( ChartDataLabels );

export default class DeviceTypeChart extends Component {
    constructor( props ) {
        // For setting hieght and width for the chart
        super( props );
        // Initialize state
        this.state = {
            isLoading: false,
            error: null,
            labels: null,
            faultData: null,
            ticketData: null,
            noData: false
        };
        this.chartColors = {
            faults: '#B20401',
            tickets: '#EABD3B'
        }



        // setting chart options
        this.options =
        {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            offsetGridLines: true
                        },
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            offsetGridLines: false
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                        borderColor: "none",
                    },
                ],
            },
        }
    }

    componentDidMount() {
        if ( this.props.chartInput && Object.keys( this.props.chartInput ).length > 0 ) {
            this.getDeviceTypeData( this.props.chartInput );
        }else{
            this.setState({noData:true})
        }
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.chartInput && Object.keys( nextProps.chartInput ).length > 0 ) {
            // if ( this.props.chartInput.id !== this.props.chartInput.id){
            //     this.getDeviceTypeData( nextProps.chartInput );
            // }
            if ( this.props.chartInput.id !== nextProps.chartInput.id){
                this.getDeviceTypeData( nextProps.chartInput );
            }
        }
    }

    getDeviceTypeData( _input ) {
        this.setState( { isLoading: true } );
        const req = {
            id: _input.id,
            type: _input.type
        };
        fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICE_TYPE_STATUS, req ).then( data => {
            if ( data && data.deviceTypeStatus ) {
                this.deviceTypeStatus = data["deviceTypeStatus"];
                // start
                const ticketData = [];
                const faultData = [];
                const labels = [];
                const backgroundColors = [];
                if (this.deviceTypeStatus && Array.isArray( this.deviceTypeStatus ) && this.deviceTypeStatus.length > 0) {
                    this.deviceTypeStatus.map( dt => {
                        faultData.push( dt.faultCount );
                        ticketData.push( dt.ticketCount );
                        labels.push( dt.deviceClass );
                        backgroundColors.push( this.chartColors[dt.status] );
                        return dt;
                    } );
                    // end of data
                    // const labels = this.deviceTypeStatus.map( status => status.deviceClass );
                    // const faultData = this.deviceTypeStatus.map( status => status.faultCount );
                    // const ticketData = this.deviceTypeStatus.map( status => status.ticketCount );
                    this.setState( {
                        isLoading: false,
                        labels,
                        faultData,
                        ticketData,
                        noData: false
                    } );
                } else {
                    this.setState( {
                        isLoading: false,
                        labels: null,
                        faultData: null,
                        ticketData: null,
                        noData: true
                    } );
                }
            } else {
                this.setState( {
                    isLoading: false,
                    labels: null,
                    faultData: null,
                    ticketData: null,
                    noData: true
                } )
            }
        } );
    }

    render() {
        const { isLoading, labels, faultData, ticketData, noData } = this.state;
        const data = { "labels": labels, "datasets": [{ "label": "Faults", "data": faultData, "backgroundColor": [this.chartColors.faults, this.chartColors.faults, this.chartColors.faults, this.chartColors.faults, this.chartColors.faults], "borderWidth": 0 }, { "label": "Tickets", "data": ticketData, "backgroundColor": ["#CCD3A6", "#CCD3A6", "#CCD3A6", "#CCD3A6", "#CCD3A6"], "borderWidth": 0 }] };
        if ( isLoading ) {
            // Add Loader component
            return <ChartLoader />
        }

        return (
            <div style={{boxShadow: "-1px 1px 16px rgba(0,0,0,.2)", minHeight:"350px", maxHeight:"350px"}}>
                <h2 className="heading-colors">Status By Device Type</h2>
                {
                    !noData &&
                    <div className="legend-right">
                        <div className="F-left">
                            <span className="circle-color-2" style={{ backgroundColor: this.chartColors.faults }}></span>
                            <span>Faults</span>
                        </div>
                        <div className="F-left m-left10">
                            <span className="circle-color-5" style={{ backgroundColor: this.chartColors.tickets }} >  </span>
                            <span>Tickets</span>
                        </div>
                    </div>
                }
                {
                    !noData &&
                    <div className="chart-canvas">
                        <HorizontalBar data={data} options={this.options} height={100}/>
                    </div>
                }
                {
                    noData &&
                    <div className="no-data">
                        No Data Found
                    </div>
                }
            </div>
        )
    }
};
