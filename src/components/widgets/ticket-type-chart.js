import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2';

import "../../assets/scss/common.scss";
import { fetchApiGet } from '../../helpers/data-access/data-access-service';
import ChartLoader from './../loader/chart-loader';

export default class TicketTypeChart extends Component {

    constructor( props ) {
        super( props );
        const serviceTypeTickets = [{ "type": "Memory", "count": 45 }, { "type": "CPU", "count": 35 }, { "type": "Disk", "count": 22 }, { "type": "Patch Status V2", "count": 55 }];

        const labels = serviceTypeTickets.map( count => count.type );
        const counts = serviceTypeTickets.map( count => count.count );
        this.data = { "labels": labels, "datasets": [{}, { "label": "Service Type", "data": counts, "backgroundColor": ["#76DDFB", "#53A8E2", "#DBECF8", "#2C82BE", "#7FE1FE"], "borderWidth": 0 }, {}] };
        this.state = {
            isLoading: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        "label": "Service Type",
                        data: [],
                        "backgroundColor": ["#76DDFB", "#53A8E2", "#DBECF8", "#2C82BE", "#7FE1FE"],
                        "borderWidth": 0
                    }
                ]
            },
            chartOptions: {
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


    }
    componentDidMount() {
        this.getTicketTypes();
    }

    getTicketTypes() {
        this.setState( {
            isLoading: true
        } );

        fetchApiGet( process.env.REACT_APP_RETRIEVE_SERVICE_TYPE_TICKETS )
            .then( resp => {
                const filteredData = resp.serviceTypeTickets.filter( status => ['CPU', 'Disk', 'Memory', 'Patch Status v2'].indexOf( status.type ) !== -1 );

                const data = filteredData.map( status => status.count );
                const labels = filteredData.map( obj => obj.type );
                this.setState( {
                    chartLabels: labels,
                    chartData: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Device Status",
                                data: data,
                                backgroundColor: ["#2691C5", "#39A1D2", "#58B4E2", "#68B4F0", "#82E1FB", "#AEE9F9", "#DEEFF7"]
                            }
                        ]
                    },
                    isLoading: false
                } );
            } );
    }
    dynamicColors() {
        const r = Math.floor( Math.random() * 255 );
        const g = Math.floor( Math.random() * 255 );
        const b = Math.floor( Math.random() * 255 );
        return "rgb(" + r + "," + g + "," + b + ")";
    }


    render() {
        const { isLoading, chartData, chartOptions } = this.state;
        const labelColors = {};


        if ( chartData.labels ) {
            console.log( "chartData.labels ========", chartData.labels );
            chartData.labels.reduce( ( a, l ) => {
                a[l] = this.dynamicColors();
                return a;
            }, labelColors );
            console.log( "labels ========", Object.values( labelColors ), labelColors );
            chartData.datasets[0]["backgroundColor"] = Object.values( labelColors );


        }

        if ( isLoading ) {
            return <ChartLoader />
        }

        return (
            <div>
                <h2 className="heading-colors">Type Count<div className="circle"></div><div className="circle"></div><div className="circle"></div></h2>
                <div className="legend-flex">
                    {
                        chartData.labels.map( ( label, index ) => {
                            if ( index < 5 ) {
                                return <div className="F-left" key={index}>
                                    <span className={`circle-color-${index + 1}`} ></span>
                                    <span>{label}</span>
                                </div>;
                            } else {
                                return null;
                            }
                        }

                        )
                    }

                    {/* 
                    <div className="F-left">
                        <span className="circle-color-4"></span>
                        <span>Memory</span>
                    </div>
                    <div className="F-left">
                        <span className="circle-color-3"></span>
                        <span>CPU</span>
                    </div>
                    <div className="F-left">
                        <span className="circle-color-1"></span>
                        <span>Disk</span>
                    </div>
                    <div className="F-left">
                        <span className="circle-color-2"></span>
                        <span>Patch Status V2</span>
                    </div> */}
                </div>
                <div className="chart-canvas">
                    <HorizontalBar data={chartData} options={chartOptions} />
                </div>
            </div>
        )
    }
};
