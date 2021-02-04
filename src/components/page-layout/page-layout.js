import "./page-layout.scss";
import Header from "../header/header";
import LeftNavigation from "./../left-navigation/left-navigation";
import "../../assets/scss/common.scss";

import React, { Component } from 'react'

export default class PageLayout extends Component {
    render() {
        return (
            <div>
                <div>
                    <Header />
                    <LeftNavigation />
                    <div className="page-container">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}


