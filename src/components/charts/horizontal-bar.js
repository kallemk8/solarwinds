import React, { Component } from 'react'
import { HorizontalBar} from 'react-chartjs-2';

import "../../assets/scss/common.scss";
import ChartLoader from './../loader/chart-loader';

export default class HorizontalBarChart extends Component {


    chartColors = ["#89ffb2", "#cfef00", "#f90008", "green", "#bbbbbd"];

    constructor( props ) {
        super( props );

        this.state = {
            isLoading: false,
            chartTitle: '',
            chartData: {},
            chartOptions: {
                responsive: true,
                legend: {
                    display: false,
                }
            }
        };
    }

    componentDidMount() {
        this.setChartData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setChartData( nextProps);
    }

    setChartData(props) {
        const {chartData, title} = props;
        const tempChartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: []
                }
            ]
        };
        if ( chartData){
            chartData.forEach( ( cd, index ) => {
                tempChartData.labels.push( cd.type );
                tempChartData.datasets[0].data.push( cd.count );
                tempChartData.datasets[0].backgroundColor.push( this.chartColors[index] );
            } );
        }

     
        this.setState({
            chartTitle: title,
            chartData: tempChartData,
        });
    }

    render() {
        const { chartTitle, chartData, chartOptions } = this.state;
        const { isLoading, noData } = this.props;


        return (
            <div className="shadow-box square-chart">
                <h2 className="heading-colors">
                    {chartTitle}
                </h2>
                {
                    chartData &&
                    chartData.labels && 
                    chartData.labels.length > 0 &&
                    <div>
                        <div className="legend-flex">
                            {
                                chartData.labels.map( ( label, index ) => {
                                    return <div className="F-left" key={index}>
                                        <span className="circle-color-1" style={{ backgroundColor: this.chartColors[index] }} ></span>
                                        <span>{label}</span>
                                    </div>;
                                } )
                            }
                        </div>
                        <div className="chart-canvas">
                            <HorizontalBar data={chartData} options={chartOptions} height={100} />
                        </div>
                    </div>
                }
                {
                    isLoading &&
                    <ChartLoader />
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
