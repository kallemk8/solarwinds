import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "../../assets/scss/common.scss";
import SelectOptions from './chartOptions/selectOptions';
import ChartLoader from './../loader/chart-loader';

export default class DoughnutChart extends Component {

    // chartColors = ["#2691C5", "#58B4E2", "#82E1FB", "#AEE9F9", "#DEEFF7"];
    

    constructor( props ) {
        super( props );
        this.chartColors = {
            New: '#f90008',
            Closed: '#cfef00',
            InProgress: 'green'
        }


        this.state = {
            isLoading: false,
            chartTitle: '',
            chartData: [],
            chartOptions: {
                cutoutPercentage: 80,
                rotation: 1 * Math.PI,/** This is where you need to work out where 89% is */
                circumference: 1 * Math.PI,
                responsive: true,
                legend: {
                    display: false,
                },
                plugins: {
                    datalabels: {
                        color: '#FFF',
                        font: {
                            weight: 500,
                        }
                    }
                }
            }
        };
    }


    componentDidMount() {
        this.setChartData(this.props);
    }
    componentWillReceiveProps( nextProps ) {
        this.setChartData( nextProps);

    }
 

    setChartData(props) {
        const { chartData} = props;
        const tempChartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: []
                }
            ]
        };
        if ( Array.isArray( chartData)){
            chartData.forEach( ( cd, index ) => {
                const label = cd.type.split( " " ).join( "" );
                tempChartData.labels.push( cd.type );
                tempChartData.datasets[0].data.push( cd.count );
                tempChartData.datasets[0].backgroundColor.push( this.chartColors[label] );
            } );

            this.setState( {
                chartData: tempChartData,
            } );

        }
       
           
    }
    
    getLastSixMonthLabels() {
        const currentDate = new Date();
        const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return [0, 1, 2, 3, 4, 5].reduce( ( months, number ) => {
            var monthNumber = currentDate.getMonth() - number;
            if(monthNumber < 1)
                monthNumber = monthNumber + 12;

            months.push( monthLabels[monthNumber] );
            return months;
        }, [] );
    }

    render() {
        const {  chartData, chartOptions } = this.state;
        const { options, title, isLoading, noData} = this.props;

        return (
            <div className="shadow-box square-chart">
                <h2 className="heading-colors">
                    {title}
                    <div className="drd-f-right drp-width">
                        {options ? <SelectOptions className="drp-width" options={this.getLastSixMonthLabels()} /> : ""}
                    </div>
                </h2>
                {
                    chartData &&
                    chartData.datasets &&
                    !isLoading &&
                    !noData &&
                    <div style={{display: "flex", justifyContent: 'space-between', flexDirection: 'column'}}>
                        <div className="legend-flex marginbottom70">
                            {
                                chartData.labels && chartData.labels.map( ( label, index ) => {
                                    return <div className="F-left" key={index}>
                                        <span className="circle-color-1" style={{ backgroundColor: this.chartColors[label.split( " " ).join( "" )] }} ></span>
                                        <span>{label}</span>
                                    </div>;
                                } )
                            }
                        </div>

                        <div className="chart-canvas">
                            <Doughnut data={chartData} options={chartOptions} plugins={[ChartDataLabels]} height={70} />
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
