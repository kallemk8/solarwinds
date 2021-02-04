import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

import "../../assets/scss/common.scss";

const data = { "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
"datasets": [{ "label": "Open Tickets", "backgroundColor": "#1DE4BD", "borderColor": "#1DE4BD", "fill": false, "data": [10, 20, 30, 40, 100, 50, 150] }, 
{ "label": "Open Faults", "backgroundColor": "#176BA0", "borderColor": "#176BA0", "fill": false, "data": [50, 300, 100, 450, 150, 200, 300] }] };

const options = {
    responsive: true,
    legend: {
        display: false,
        labels: {
            usePointStyle: true,
            fontColor: '#000',
        }

    },
    title: {
        display: false,
        text: 'Tickets/Faults'
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Date'
            },

        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Count'
            },
            ticks: {
                min: 0,
                max: 500,
                // forces step size to be 5 units
                stepSize: 100
            }
        }]
    }
};

export default class TicketFailureChart extends Component {
    constructor( props ) {
        super( props );
        this.chartColors = {
            openFailures: '#176BA0',
            openTickets: '#1DE4BD'
        }
        data.datasets[0].backgroundColor = this.chartColors.openTickets;
        data.datasets[1].backgroundColor = this.chartColors.openFailures;
    }

    componentDidMount() {
        console.log( this.chartReference ); // returns a Chart.js instance reference
    }
    render() {
        return (
            <div style={{boxShadow: "-1px 1px 16px rgba(0,0,0,.2)", maxHeight:"500px"}}>
                <h2 className="heading-colors">Tickets / Faults</h2>
                <div className="legend-right">
                    <div className="F-left">
                        <span className="circle-color-5" style={{ backgroundColor: this.chartColors.openTickets }}></span>
                        <span>Open Tickets</span>
                    </div>
                    <div className="F-left m-left10">
                        <span className="circle-color-2" style={{ backgroundColor: this.chartColors.openFailures }}></span>
                        <span>Open Faults</span>
                    </div>
                </div>

                <div className="chart-canvas" style={{maxHeight:"500px"}}>
                    <Line data={data} options={options} height={75}/>
                </div>
            </div>
        )
    }
}
