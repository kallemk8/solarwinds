import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "../loader/loader";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  getTicketDetails,
  hideDeviceList,
} from "../../redux/actions/device-list-actions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import "./device-list.scss";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import moment from 'moment'

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTicket: false,
    };
  }

  componentDidMount() { }

  handleClose() {
    this.props.closeDeviceDialog();
  }

  modelTicketOpen(evt) {
    this.setState({ openTicket: true });
    // cusSelectedDimension
    this.getTicketDetails(evt.target.innerText)
  }

  getTicketDetails(id) {
    this.props.getTicketDetails(id);
  }

  modelTicketClose() {
    this.setState({ openTicket: false });
  }
  ticketClose() {
    this.setState({ openTicket: false });
  }
  render() {
    const { isLoading, list, status, ticketDetails, ticketDetailsLoading, ticketDetailsErrorMsg } = this.props;
    console.log(this.props);
    // console.log( 'ticket details props ticketDetailsErrorMsg ----> ', list, ticketDetails, ticketDetailsLoading, ticketDetailsErrorMsg);

    if (isLoading) {
      return <Loader />;
    }
    return (
      <div>
        <Dialog
          fullWidth={false}
          open={true}
          onClose={() => this.handleClose()}
          className={list.length === 1 ? "oneitemsdisplay" :( list.length > 10) ? "" : "lowitemsdisplay" }
        >
          <div className="model-head">
            Devices
            <div className="cancel-dialog">
              <CloseIcon onClick={() => this.handleClose()} />
            </div>
          </div>
          <div className="description-status">
            <div className="description">{status}</div>
            <div className="f-right">
              Status :
              {status === "Normal" && (
                <CheckCircleIcon className="normal-color" />
              )}
              {(status === "Failed" || status === "Faults" )&& <CancelIcon className="failed-color" />}
              {status}
            </div>
          </div>

          <div className="table-main">
            <TableContainer className="table-wid" component={Paper}>
              <Table size="small">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Network Address</TableCell>
                    <TableCell>Device Class</TableCell>
                    <TableCell>Tickets</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {row.description}
                      </TableCell>
                      <TableCell>{row.networkAddress}</TableCell>
                      <TableCell>{row.deviceClass}</TableCell>
                      <TableCell className="data-label-color">
                        <div className="link-pointer">
                          {row.ticket && row.ticket.length !== 0 &&
                            row.ticket.map((ticket, i) => {
                              return i < 2 ?
                                //  <span onClick={(e) => this.modelTicketOpen(e)} > {ticket} {i=== row.ticket.length-1 ?  "":","} </span>
                                <span key={i} onClick={(e) => this.modelTicketOpen(e)} > {ticket === "undefined" ? "-" : ticket} {i === row.ticket.length - 1 ? "" : ","} </span>
                                : <span><div className="show-more">show More</div></span>
                            })
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="modal model-bg-white"
            open={this.state.openTicket}
            onClose={() => this.modelTicketClose()}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            {
              (ticketDetailsErrorMsg || ticketDetails )&&
              <Fade in={this.state.openTicket}>
                <div className="Ticket-model">
                  <div className="ticket-head">
                    <h5 className="f-size">
                      {ticketDetailsErrorMsg ? 'Error' : ticketDetails?.ticketId ? ticketDetails.ticketId : 'Ticket Number'}
                      <div className="Ticket-cancel">
                        <CloseIcon className="model-close-FS"
                          onClick={() => this.ticketClose()}
                        />
                      </div>
                    </h5>
                  </div>
                  {
                    ticketDetailsErrorMsg &&
                    <div className="ticketModel-Error">{ticketDetailsErrorMsg}</div>

                  }
                  {!ticketDetailsLoading && !ticketDetailsErrorMsg &&
                    ticketDetails ?
                    <div className="ticket-table">
                      <table>
                        <tbody>
                          <tr>
                            <td>Description</td>
                            <td>{ticketDetails.description}</td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>{ticketDetails.status}</td>
                          </tr>
                          <tr>
                            <td>Created On</td>
                            <td>{(ticketDetails.createdOn !== '-' )? moment( ticketDetails.createdOn ).format( 'DD MMMM, YYYY hh:mm A' ): '-'}</td>
                          </tr>
                          <tr>
                            <td>Last Updated On</td>
                            <td>{(ticketDetails.lastUpdatedOn !== '-') ? moment( ticketDetails.lastUpdatedOn ).format( 'DD MMMM, YYYY hh:mm A' ): '-'}</td>
                          </tr>

                          <tr>
                            <td>Closed On</td>
                            <td>{(ticketDetails.closedOn !== '-') ? moment( ticketDetails.lastUpdatedOn ).format( 'DD MMMM, YYYY hh:mm A' ) : ticketDetails.closedOn  }</td>
                          </tr>
                          <tr>
                            <td>Close Notes</td>
                            <td>{ticketDetails.close_notes}</td>
                          </tr>
                          <tr>
                            <td>Service</td>
                            <td>{ticketDetails.service}</td>
                          </tr>
                          <tr>
                            <td>Device</td>
                            <td>{ticketDetails.device}</td>
                          </tr>
                          <tr>
                            <td>Device Class</td>
                            <td>{ticketDetails.deviceClass}</td>
                          </tr>
                          <tr>
                            <td>Site</td>
                            <td>{ticketDetails.site}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    : ""}
                </div>
              </Fade>
            }
            

          </Modal>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cusSelectedDimension: state.Customer.selectedDimension,
    status: state.DeviceList.status,
    list: state.DeviceList.items,
    ticketDetails: state.DeviceList.ticketDetails.items,
    ticketDetailsLoading: state.DeviceList.ticketDetails.isLoading,
    ticketDetailsErrorMsg: state.DeviceList.ticketDetails.errMsg,
    isLoading: state.DeviceList.isLoading,
  };
};

const mapDispatchToProps = {
  closeDeviceDialog: hideDeviceList,
  getTicketDetails: getTicketDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList);
