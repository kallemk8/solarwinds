import React, { Component } from 'react';
import "./accordian-dropdown.scss";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

class AccordianDropdown extends Component {

    render() {
        const adminDimension = this.props.data
        console.log(adminDimension);
        return (
            <div>
                <div id="tree-view">
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        multiSelect
                    >
                        {adminDimension &&
                        adminDimension.length > 0 &&
                        adminDimension.map((dd, index) => (
                            <div>
                            <TreeItem nodeId={index} label={dd.customerName} >
                                
                                { dd.sites &&
                              dd.sites.map( ( site ) => (
                                <TreeItem nodeId={site.id} label={site.name} className="menu-text-color" onClick={() => this.props.handlclick(site)} />
                                
                              )) }

                            </TreeItem>
                          </div>
                        ))}
                    </TreeView>
                </div>
            </div>

        )
    }
}

export default AccordianDropdown;