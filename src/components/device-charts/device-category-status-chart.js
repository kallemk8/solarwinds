import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import "../../assets/scss/common.scss";
import {  fetchApiPost } from '../../helpers/data-access/data-access-service';
import ChartLoader from "../loader/chart-loader";
//TODO Move it to Common Utils later
import Chart from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.plugins.unregister( ChartDataLabels );

export default class DeviceCategoryStatusChart extends Component {
    constructor( props ) {
        // For setting hieght and width for the chart
        super( props );
        // Initialize state
        this.state = {
            isLoading: false,
            error: null,
            labels: null,
            noData: true,
            chartData: {
                "title": "Device Category Status"
            },
            chartOptions: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
                scales: {
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
        };

        this.chartColors = {
            'failed': '#820401',
            'misconfigured': '#EE9A3A',
            'noData': '#1DE48D'
        };
           
        this.chartData = {};
    }

    componentDidMount() {
        if ( this.props.chartInput && this.props.chartInput.id ) {
            this.getDeviceCategoryStatusData( this.props.chartInput, this.props.bounds );

        }
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.chartInput && nextProps.chartInput.id ) {
            this.getDeviceCategoryStatusData( nextProps.chartInput, nextProps.bounds );
        }
    }

    updateChartState( { isLoading, noData, error, data} ) {

        this.setState( {
            isLoading, 
            noData,
            error,
            chartData: data } 
            );

    }

    getDeviceCategoryStatusData( _input, _bounds ) {
        this.setState( { isLoading: true } );
        var req = {}
        if(_bounds){
            req = {
                id: _input.id,
                type: _input.type,
                "bottomLeftLong": _bounds.sw.lng(),
                "bottomLeftLat": _bounds.sw.lat(),
                "topRightLong": _bounds.ne.lng(),
                "topRightLat": _bounds.ne.lat()
            };
        }else{
            req = {
                id: _input.id,
                type: _input.type,
                
            };
        }
        this.retrieveDeviceCategoryStatusData(req);
        
    }
    getDatasets(data){
        if(data.length>0){
            data.map((remove)=>{
                delete remove.datacheck;
                return remove;
            })
        }
        const labels = Object.keys( data[0] ).filter( label => label !== 'type' );
        return labels.map( key => ( {
            "label": key,
            categoryPercentage: 0.1,
            barPercentage: 0.7,
            // barThickness: 10,
            backgroundColor: this.chartColors[key],
            "data": data.map((label, index) => {
                return data[index][key]
            }) 
        } ) );
    }

    retrieveDeviceCategoryStatusData( req ) {
        console.log( 'path', process.env.REACT_APP_RETRIEVE_DEVICE_CATEGORY_STATUS, req );
        const chartData = {
            "type": "deviceCategoryStatus",
            "title": "Category Status",
            "chartType": "groupBarChart",
            "labels": [],
            "datasets": [
            ]
        };

        // dispatch(showLoginLoader());
        fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICE_CATEGORY_STATUS, req )
            .then( resp => {
                if ( resp && resp.deviceCategoryStatus && resp.deviceCategoryStatus.length > 0 ) {
                    var datacheck = false;
                    chartData.labels = resp.deviceCategoryStatus.map( (obj)=> {
                        return obj.type
                    });
                    const storeloacl = resp.deviceCategoryStatus;
                    const devicecategory = storeloacl.map( (obj1)=> {
                        if(obj1.misconfigured!==0 || obj1.failed !== 0){
                            obj1.datacheck = true;
                        }else{
                            obj1.datacheck = false;
                        }
                        return obj1; 
                    });
                    devicecategory.map((check)=>{
                        if(check.datacheck === true){
                            datacheck = true;
                            return true;
                        }else{
                            return false;
                        }
                    });
                    chartData.datasets = this.getDatasets(resp.deviceCategoryStatus);
                    if(datacheck){
                        this.updateChartState( { data:chartData } );
                    }else{
                        this.updateChartState( { data:chartData, noData: true } );
                    }
                    
                } else {
                    if ( resp.error ) {
                        this.updateChartState( { data: chartData, error: true } );
                    }
                    this.updateChartState( { data:chartData, noData: true } );
                }
            } );
    }

    render() {
        const { isLoading, noData, error, chartData, chartOptions  } = this.state;

        if ( isLoading ) {
            // Add Loader component
            return <ChartLoader />
        }

        return (
            <div style={{boxShadow: "-1px 1px 16px rgba(0,0,0,.2)", minHeight:"350px", maxHeight:"350px"}}>
                <h2 className="heading-colors">{chartData.title}</h2>
                {
                    !noData && 
                    chartData.labels &&
                    <div className="legend-right">
                        {
                            Object.keys(this.chartColors).map( ( label, index ) => {
                                return <div className="F-left" key={index}>
                                    <span className="circle-color-2" style={{ backgroundColor: this.chartColors[label] }}></span>
                                    <span>{label}</span>
                                </div>;
                            } )
                        }
                    </div>
                }
                {
                    !noData &&
                    <div className="chart-canvas">
                        <Bar
                            data={chartData}
                            options={chartOptions}
                            height={50}
                        />
                    </div>
                }
                {
                    noData &&
                    <div className="no-data">
                        No Data Found
                    </div>
                }
                {
                    error &&
                    <div className="no-data">
                        Error Occured
                    </div>
                }

            </div>
        )
    }
};
