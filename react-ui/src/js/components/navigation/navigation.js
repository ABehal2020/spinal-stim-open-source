import React from 'react';
import { Layout, Menu, } from 'antd';
import { refreshPageLazy } from '../form/form';
import './navigation.scss';

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSelection: null,
        }
    }

    getNavItems = () => {
        return this.props.menuItems.map((o, idx) => {
            if (o.navKey == this.props.currentPage) {
                return (<div onClick={() => { this.props.showPage(o.path, o.navKey) }} className="farm-bar-item is-slctd">
                    <div className="side-nav-slctn "></div>

                    <div className={o.iconSelector}></div>
                    <div className="side-nav-label">{o.navDisplay}</div>
                </div>)
            } else {
                return (<div onClick={() => { this.props.showPage(o.path, o.navKey) }} className="farm-bar-item ">
                    <div className="side-nav-slctn "></div>
                    <div className={o.iconSelector}></div>
                    <div className="side-nav-label">{o.navDisplay}</div>
                </div>)
            }
        })
    }

    handleChangeClick = (event) => {
        console.log("clicked");
        this.state.currentSelection = event.key;
        console.log(this.state.currentSelection);

        let o = {
                navKey :  event.key,
                path:event.key,
        };
        console.log(o);
        if (o.navKey == "Generate") {
            refreshPageLazy();
        }
        this.props.showPage(o.path, o.navKey)
    }

    render() {
        return (
            <Layout>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Generate']} className="menuStyle"  onClick={this.handleChangeClick}>
                    <Menu.Item key="Information" className="option1">Application Information</Menu.Item>
                    <Menu.Item key="Examples" className="option2">Search Past Jobs and Examples</Menu.Item>
                    <Menu.Item key="Generate" className="option3">New Job Submissions</Menu.Item>
                </Menu>
            </Layout>
        )
    }
}
