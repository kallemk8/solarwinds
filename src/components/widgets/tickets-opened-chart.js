import React, { Component } from 'react'
import { Doughnut, Chart } from 'react-chartjs-2';
import "../../assets/scss/common.scss";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchApiGet } from "../../helpers/data-access/data-access-service";
import ChartLoader from "../loader/chart-loader";
Chart.plugins.unregister( ChartDataLabels );

export default class TicketsOpenedChart extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            isLoading: true,
            chartLabels: [],
            chartData: [],
            chartOptions: {
                responsive: true,
                legend: {
                    display: false,
                },
                animation: {
                    duration: 0,
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                },
                cutoutPercentage: 90,
                plugins: {
                    datalabels: {
                        align: 'start'
                    }
                }
            }
        };
    }

    componentDidMount() {
        this.getOpenTickets();
    }

    getOpenTickets() {
        this.setState( {
            isLoading: true
        } );

        fetchApiGet( process.env.REACT_APP_RETRIEVE_OPEN_TICKETS )
            .then( resp => {
                const labels = Object.keys( resp.ticketsOpenOfFault ).filter( key => key !== 'overallIssues' );
                const data = labels.map( key => resp.ticketsOpenOfFault[key] );
                this.setState( {
                    chartLabels: labels,
                    chartData: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Device Status",
                                data: data,
                                backgroundColor: ["#2691C5", "#DBECF8"]
                            }
                        ]
                    },
                    isLoading: false
                } );
            } );
    }

    render() {
        const { isLoading, chartData, chartOptions } = this.state;

        const myChartJSPlugin = {
            beforeDraw: this.drawCenterText
        }

        if ( isLoading ) {
            // Add Loader component
            return <ChartLoader />
        }

        return (
            <div>
                <h2 className="heading-colors">Tickets Opened On a Fault<div className="circle"></div><div className="circle"></div><div className="circle"></div></h2>
                <div className="legend-right">
                    <div className="F-left">
                        <span className="circle-color-2"></span>
                        <span>Active Ticket</span>
                    </div>
                    <div className="F-left m-left10">
                        <span className="circle-color-1"></span>
                        <span>No Tickets</span>
                    </div>
                </div>
                <div className="chart-canvas">
                    <Doughnut data={chartData} options={chartOptions} plugins={[myChartJSPlugin]} />
                </div>
            </div>
        )
    }


    drawCenterText( chart ) {
        const width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx,
            type = chart.config.type;

        if ( type === 'doughnut' ) {
            const percent = Math.round( ( chart.config.data.datasets[0].data[0] * 100 ) /
                ( chart.config.data.datasets[0].data[0] +
                    chart.config.data.datasets[0].data[1] ) );
            const oldFill = ctx.fillStyle;
            const fontSize = ( ( height - chart.chartArea.top ) / 90 ).toFixed( 2 );

            ctx.restore();
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle"

            const text = percent + "%",
                textX = Math.round( ( width - ctx.measureText( text ).width ) / 2 ),
                textY = ( height + chart.chartArea.top ) / 2;

            ctx.fillStyle = chart.config.data.datasets[0].backgroundColor[0];
            ctx.fillText( text, textX, textY );
            ctx.fillStyle = oldFill;
            ctx.save();
        }
    }

}
