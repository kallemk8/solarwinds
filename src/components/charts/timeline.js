import React, { Component } from 'react'
import {Line} from 'react-chartjs-2';
import ChartLoader from './../loader/chart-loader';
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { fetchApiPost } from './../../helpers/data-access/data-access-service';
import "../device-list/device-list.scss";
export default class TimelineChart extends Component {


    chartColors = {
        open: '#f90008',
        closed: '#cfef00',
        faults: '#f90008',
        tickets: '#142459',
        inProgress: 'green'
    }

    constructor( props ) {
        super( props );
        this.chartReference = React.createRef();

        this.state = {
            isLoading: false,
            chartTitle: '',
            chartData: {},
            sortedData: [],
            tickets: {
                isLoading: false,
                noData: false,
                isError: false,
                items: [],

            },

            chartOptions: {

                responsive: true,
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: true,
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                            // OR //
                            beginAtZero: true,   // minimum value will be 0.
                            
                            stepsize :1
                        },
                        
                    }]
                }
            }
        };
        
    }

    

    componentDidMount() {
        this.setChartData();
    }

    sortByCurrentDate(weeklyData) {
        const result = [];

        weeklyData.forEach( ( item, i ) => {
            const count = new Date().getDay();
            let index = ( count - i ) >= 0 ? count - i : count + weeklyData.length - i;
            result.unshift( weeklyData[index] );
        } );
        return result;
    }

    setChartData() {
        const {chartData, title} = this.props;
        const tempChartData = {
            labels: [],
            datasets: []
        };
        let sortedData = [];
        if ( Array.isArray( chartData) ){
            sortedData = this.sortByCurrentDate(chartData);
            sortedData.forEach( ( cd, index ) => {
                tempChartData.labels.push( cd.On );
                cd.values.forEach( ( vl, i ) => {
                    if ( !tempChartData.datasets[i] ) {
                        tempChartData.datasets[i] = {
                            data: [],
                            label: '',
                            backgroundColor: '',
                            borderColor: '',
                            fill: false
                        }
                    }
                    const label = vl.type.split( " " ).join( "" );
                    tempChartData.datasets[i].data.push( vl.count );
                    tempChartData.datasets[i].label = vl.type;
                    tempChartData.datasets[i].backgroundColor = this.chartColors[label];
                    tempChartData.datasets[i].borderColor = this.chartColors[label];
                    tempChartData.datasets[i].pointRadius = 5;

                } )
            } );

        }

        this.setState({
            chartTitle: title,
            chartData: tempChartData,
            sortedData: sortedData,
        });
    }

    handleElementClick( _elems ) {
        if (!_elems || (_elems && _elems.length <= 0)) {
            return;
        }
        const elementIndex = _elems[0]._index;
        const _datasetIndex = _elems[0]._datasetIndex;
        const selectedElement = this.state.sortedData[elementIndex];
        const elementType = this.state.chartData.datasets[_datasetIndex].label;
        const { dim } = this.props;
        const req = {
            id: dim.id,
            type: dim.type,
            date: selectedElement.date,
        };

        if ( elementType === 'closed' ) {
            req.status = 'closed';
        }
        this.modelTicketOpen( req, elementType);

    }

    modelTicketClose() {
        this.setState( { openTicket: false } );
    }
    modelTicketOpen( req, elementType ) {
        this.getTicketsByDate(req, elementType);
    }
    ticketClose() {
        this.setState( { openTicket: false } );
    }

    getTicketsByDate( req, elementType ) {
        this.retrieveTicketsByDate( req, elementType );
    }

    getTicketsData(resp){
        return resp.map( ticket => {
            return {
                id: ticket.id,
                site: ticket.info?.site?.name || '-',
                status: ticket.info?.status || '-',
                device: ticket.info?.device?.name || '-',
                deviceClass: ticket.info?.device?.class || '-',
                description: ticket.details?.description || '-'
            }
        } );

    }

    retrieveTicketsByDate( req, elementType ) {

        let url = process.env.REACT_APP_RETRIEVE_TICKETS_BY_DATE;
        if ( elementType === 'faults'){
            url = process.env.REACT_APP_RETRIEVE_ISSUES_BY_DATE;
        }

        fetchApiPost( url, req )
            .then( resp => {
                if ( resp  ) {
                    this.updateTicketsState({
                        items: this.getTicketsData( resp )
                    });
                }
            } );
    }

    updateTicketsState( { isLoading, noData, isError, items  } ) {

        this.setState( { 
            tickets: {
                isLoading: isLoading,
                noData: noData,
                isError: isError,
                items: items
            }
         },  
            () => {
                this.setState( { openTicket: true } );

        } );


    }


    render() {
        const { chartTitle, chartData, chartOptions, isLoading, noData, tickets } = this.state;

        return (
            <div className="shadow-box">
                <h2 className="heading-colors">
                    {chartTitle}
                </h2>
                <div className="legend-right">
                    {
                        chartData.datasets && chartData.datasets.map( ( ds, index ) => {
                            return <div className="F-left" key={index}>
                                <span className="circle-color-1" style={{ backgroundColor: this.chartColors[ds.label.split( " " ).join( "" )]}} ></span>
                                <span className="first-capital">{ds.label}</span>
                            </div>;
                        })
                    }
                </div>
                <div className="chart-canvas maxheight500" >
                    {
                        !isLoading &&
                        !noData &&
                        <Line data={chartData} options={chartOptions} height={60} getElementAtEvent={( elems ) => { this.handleElementClick( elems ) }} />

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
                {
                    tickets.items && tickets.items.length > 0 && 
                <Modal
                    style={{ background: "#fff" }}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className="modal"
                    open={this.state.openTicket}
                    onClose={() => this.modelTicketClose()}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >

                        <Fade in={this.state.openTicket}>
                            <div className={tickets.items.length === 1 ? "One-Graph-Ticket-model Graph-Ticket-model" :( tickets.items.length > 10) ? "Graph-Ticket-model" : "Multiple-Graph-Ticket-model"}>
                                <div className="model-head">
                                    Tickets
            <div className={tickets.items.length === 1 ? "one-model-ticket-close model-ticket-close" :( tickets.items.length > 10) ? "model-ticket-close" : "small-model-ticket-close"}>
                                        <CloseIcon onClick={() => this.modelTicketClose()} />
                                    </div>
                                </div>
                                <div className="description-status">
                                    <div className="description">List of all tickets.</div>
                                    
                                </div>


                                <div className="table-main" id="tickets-list">
                                    <TableContainer className="table-wid ticket-container-scrolling" component={Paper}>
                                        <Table size="small" stickyHeader aria-label="table">
                                            <TableHead className="table-header">
                                                <TableRow>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell>Site</TableCell>
                                                    <TableCell>Device</TableCell>
                                                    <TableCell>Device Class</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    tickets.items.map( ticket => <TableRow >
                                                        <TableCell
                                                            component="td"
                                                            scope="row"
                                                            key={ticket['id']}
                                                        >
                                                            {ticket['id']}
                                                        </TableCell>
                                                        <TableCell> {ticket['site']}</TableCell>
                                                        <TableCell> {ticket['device']}</TableCell>
                                                        <TableCell> {ticket['deviceClass']}</TableCell>
                                                        <TableCell className="data-label-color">
                                                            {ticket['description']}
                                                        </TableCell>
                                                    </TableRow>
                                                        
                                                        
                                                        )
                                                }

                                                    
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                            </div>
                        </Fade>
                    </Modal>
                }


            </div>
        )
    }
}
