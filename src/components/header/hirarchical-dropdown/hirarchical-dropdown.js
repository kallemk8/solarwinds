import React, { Component } from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import { dimensionsChanged } from './../../../redux/actions/customer-actions';
import "../hirarchical-dropdown/hirarchical-dropdown.scss";
import ListSubheader from '@material-ui/core/ListSubheader';

class HirarchicalDropdown extends Component {
  // constructor( props ) {
  //   super( props );
  // }

  handleChange( dim ) {
    this.props.setCustomerSelectedDimension(dim);
  }
  
  render() {
    const {
      adminDimension,
      cusSelectedDimension,
    } = this.props;

    return (
      <div>
        {adminDimension && adminDimension.length > 0 && (
          <div className="select-drp">
            <FormControl className="formControl">
              <Select
                value={cusSelectedDimension}
                onChange={( event ) =>
                  this.handleChange( event.target.value )
                }>
                {
                  adminDimension.map( (adminDim) => {
                    let children = [];
                    children.push(<ListSubheader>{adminDim.customerName}</ListSubheader>);
                    adminDim.sites.map(site => {
                      return children.push(<MenuItem value={site}  key={site.id} className="menu-text-color">{site.name}</MenuItem>)
                    });
                    return children;
                  }
                )}
              </Select>
              
            </FormControl>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    cusSelectedDimension: state.Customer.selectedDimension,
    adminDimension: state.Customer.adminDimensions,
  };
};

const mapDispatchToProps = {
  setCustomerSelectedDimension: dimensionsChanged,
};

export default connect( mapStateToProps, mapDispatchToProps )( HirarchicalDropdown );
