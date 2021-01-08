import React from 'react';
import {Layout, Row, Col} from 'antd';
import Clock from '../../components/clock/clock';
import './banner.scss';

const Header = () => {
    const mystyle = {
        color: "#fff",
        height: "55px",
        lineHeight: "55px",
        padding: "0 1.5em",
        backgroundColor: "#1a4372",
        // backgroundColor: "rgb(191, 63, 63)",
    }

    return (
        <Layout.Header className="top-navbar" style={mystyle}>
            <Row>
                <Col span={8} className="top-navbar-biz-n-app">
                    <span>Welcome!</span>
                </Col>
                <Col span={8} className="top-navbar-env-select">
                <span>GUI for Spinal Cord Stimulation EMG Data Visualization</span>
                </Col>
                <Col span={8} className="top-navbar-migrate">
                    <Clock></Clock>
                </Col>
            </Row>
        </Layout.Header>
    )
}

export default Header;