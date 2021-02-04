import React, { Component } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  backdrop: {
    color: '#fff',
    zIndex: 999
  },
});

class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true
    }
  }

  render() {
    const { classes } = this.props;
    const {open} = this.state;    
    return (
      <div>
        <Backdrop className={classes.backdrop} open={open} >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}
export default withStyles(styles)(Loader);
