import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import { selectedMonthChanged } from '../../../redux/actions/dashboard-actions';
class SelectOptions extends Component {
    handleChange(event) {
        event.preventDefault();
        const _req = {
            id: this.props.cusSelectedDimension.id,
            type: this.props.cusSelectedDimension.type,
            month: event.target.value
        }
        this.props.selectedMonthChanged( _req );
    }
    render() {
        const { selectedMonth} = this.props;

        return(
            <FormControl>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    value={selectedMonth}
                    onChange={(e)=> {this.handleChange(e);}}
                >
                    {this.props.options.map((option,i)=>{
                        return (
                            <MenuItem key={i} value={i} className="menu-text-color"> {option} </MenuItem>
                        )
                    })}
                    
                </Select>
            </FormControl>
        )

    }

}
const mapStateToProps = ( state ) => {
    return {
        selectedMonth: state.Dashboard.selectedMonth,
        cusSelectedDimension: state.Customer.selectedDimension,

    }
};

const mapDispatchToProps = {
    selectedMonthChanged: selectedMonthChanged,

};

export default connect( mapStateToProps, mapDispatchToProps )( SelectOptions );
