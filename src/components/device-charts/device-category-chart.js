import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import "../../assets/scss/common.scss";
import ChartLoader from "../loader/chart-loader";
//TODO Move it to Common Utils later
import Chart from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchApiPost } from './../../helpers/data-access/data-access-service';

Chart.plugins.unregister( ChartDataLabels );

export default class DeviceCategoryChart extends Component {
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
                "title": "Device Category"
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
                    xAxes: [
                        {
                            gridLines: {
                                offsetGridLines: true
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
            'Servers - Windows': '#3e95cd',
            'Switch/Router': '#8e5ea2',
            'Laptop - Windows': '#3cba9f',
            'Storage': '#e8c3b9',
            'Workstations - Windows': '#c45850'
        };
        this.pistachioPallateColors = ['#c45850', '#e8c3b9', '#8e5ea2', '#9d978b', '#d9ccb7', '#3cba9f', '#d1cfa1', '#b9b551', '#5e6d01', '#9bcf53', '#dad1a6', '#e25050', '#a92d11', '#636469', '#092435', '#4a92a8', '#60ccd9', '#bbf0e8', '#61908a'];
        
    }

    componentDidMount() {

        if ( this.props.chartInput && this.props.chartInput.id ) {
            this.getDeviceTypeData( this.props.chartInput, this.props.bounds );

        }
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.chartInput && nextProps.chartInput.id ) {
            this.getDeviceTypeData( nextProps.chartInput, nextProps.bounds );
        }
    }

    updateChartState( { isLoading, noData, error, data } ) {
        this.setState( {
            isLoading,
            noData,
            error,
            chartData: data
        }
        );

    }

    getDeviceTypeData( _input, _bounds ) {
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
        this.getDeviceCategory(req);
    }

    getDatasets( data ) {
        // const labels = data.map( obj => obj.type );
        // const countObj = {};
        // data.forEach( item => { countObj[item.type] = item.count } );
        const result = {
            barThickness: 10,
            backgroundColor: [],
            data:[]
        };
        data.forEach( ( item, index ) => {
            result.backgroundColor.push( this.pistachioPallateColors[index] );
                result.data.push( item.count );
         } );
        return [result];
    }

    getDeviceCategory( req ) {
        const chartData = {
            "type": "deviceCategory",
            "title": "Category Count",
            "chartType": "BarChart",
            "labels": [],
            "datasets": [ ]
        };

            fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICE_CATEGORY, req )
                .then( resp => {
                    if ( resp && resp.deviceCategory && resp.deviceCategory.length > 0 ) {
                    chartData.labels = resp.deviceCategory.map( obj => obj.type );
                        chartData.datasets = this.getDatasets( resp.deviceCategory );
                        this.updateChartState( { data: chartData } );
                    } else {
                        if ( resp.error ) {
                            this.updateChartState( { data: chartData, error: true } );
                        }
                        this.updateChartState( { data: chartData, noData: true } );
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
                <h2 className="heading-colors">{chartData.title}  </h2>
                {
                    !isLoading && 
                    !noData &&
                    !error &&
                    chartData.labels &&
                    <div>
                        <div className="legend-flex">
                            {
                                chartData.labels.map( ( label, index ) => {
                                    return <div className={index>6? "F-left": "CatCount-F-left"} key={index}>
                                        <span className="circle-color-2" style={{ backgroundColor: this.pistachioPallateColors[index] }}></span>
                                        <span>{label}</span>
                                    </div>;
                                } )
                            }
                        </div>

                        <div className="chart-canvas">
                            <Bar
                                data={chartData}
                                options={chartOptions}
                                height={100}
                            />
                        </div>
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
