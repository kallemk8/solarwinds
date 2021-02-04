import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "../../assets/scss/common.scss";
import {  fetchApiPost } from '../../helpers/data-access/data-access-service';
import ChartLoader from '../loader/chart-loader';
import { connect } from "react-redux";
import {getDeviceList} from "../../redux/actions/device-list-actions";

class OverallDeviceStatus extends Component {


    constructor( props ) {
        super( props );
        this.chartColors = {
            Disconnected: '#142459',
            Misconfigured: '#19AADE',
            Failed: '#820401',
            Faults: '#820401',
            Warning: '#EE9A3A',
            Normal: '#1DE48D'
        };

        this.state = {
            isLoading: false,
            isError: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: "Device Status",
                        data: [],
                        backgroundColor: []
                    }
                ]
            },
            chartOptions: {
                responsive: false,
                cutoutPercentage: 75,
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                },
                plugins: {
                    datalabels: {
                        color: '#FFF',
                        font: {
                            weight: 500
                        }
                    }
                }
            },
            noData: false
        };
    }

    componentDidMount() {
        if ( this.props.chartInput && this.props.chartInput.id ) {
            this.getTotalIssues( this.props.chartInput, this.props.bounds );
        }
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.chartInput && nextProps.chartInput.id ) {
            this.getTotalIssues( nextProps.chartInput, nextProps.bounds );
        }
    }

    getTotalIssues( _input, _bounds ) {
        this.setState( {
            isLoading: true,
            isError: false
        });
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

        
        fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICE_STATUS, req )
            .then( resp => {
                
                if ( resp.deviceStatus && Object.keys( resp.deviceStatus ).length > 0 ) {
                    const filteredData = resp.deviceStatus.filter( ds => ['Disconnected', 'Misconfigured', 'Failed', 'Warning', 'Normal'].indexOf( ds.status ) !== -1 );
                    const data = [];
                    const labels = [];
                    const backgroundColors = [];

                    filteredData.forEach( dt => {
                        data.push( dt.count );
                        labels.push( dt.status === 'Failed' ? 'Faults' : dt.status );
                        backgroundColors.push( this.chartColors[dt.status] );
                    } );

                    this.setState( {
                        chartLabels: labels,
                        chartData: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "Device Status",
                                    data: data,
                                    backgroundColor: backgroundColors
                                }
                            ]
                        },
                        isLoading: false,
                        noData: false
                    } );
                } else {
                    this.setState( {
                        isLoading: false,
                        noData: true,
                        chartData: {
                            labels: [],
                            datasets: [
                                {
                                    data: [],
                                }
                            ]
                        },

                    } );
                }

            } );
    }

    handleElementClick( _elems ) {
        if (!_elems || (_elems && _elems.length <= 0)) {
            return;
        }
        const elementIndex = _elems[0]._index;
        const {id, type} = this.props.chartInput;
        const deviceReq = {
            id: id,
            type: type,
            status : this.state.chartLabels[elementIndex]
        };

        this.props.retrieveDevice(deviceReq)
    }

    render() {
        const { isLoading, chartData, chartOptions, isError, noData } = this.state;
        
        if ( isLoading || isError ) {
            return <ChartLoader />
        }

        return (
            <div style={{boxShadow: "-1px 1px 16px rgba(0,0,0,.2)", minHeight:"350px", maxHeight:"350px"}}>
                <h2 className="heading-colors">Overall Status</h2>
                {
                    !noData &&
                        <div className="doughnut-flex-chart">
                            <div className="chart-canvas">
                                <Doughnut height={250} width={300} data={chartData} options={chartOptions} plugins={[ChartDataLabels]} onElementsClick={( elems ) => { this.handleElementClick( elems ) }}  />
                            </div>
                            <div className="doughnut-legend-col">
                                {
                                    chartData.labels.map( ( label, index ) => {
                                            if ( index < 5 ) {
                                                return <div className="F-left" key={index}>
                                                    <span className="circle-color-1" style={{ backgroundColor: this.chartColors[label] }} ></span>
                                                    <span className="capitalize">{label}</span>
                                                </div>;
                                            } else {
                                                return null;
                                            }
                                        }
                                    )
                                }
                            </div>

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
}
const mapStateToProps = ( state ) => {
    return {
        bounds:state.DeviceList.bounds.bounds
    }
};

const mapDispatchToProps = {
    retrieveDevice: getDeviceList
}

export default connect( mapStateToProps, mapDispatchToProps )( OverallDeviceStatus );
