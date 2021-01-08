import React, { useEffect, useCallback, useContext } from 'react';
import { Layout, Menu, } from 'antd';
import { NAV_MENU_OBJECT } from '../definitions/navMenuObject';
import { Store } from '../store/Store';
import { usePrevious } from '../utils/usePrevious';
import { showPageAction } from '../actions/navAction';
import Navigation from '../components/navigation/navigation';

const { Content } = Layout;

const BaseContainer = (props) => {
    const showPage = (navKey) => {
        console.log(navKey);
        showPageAction(dispatch, navKey);
    }

    const {
        state: {
            navigation: { shutterflyOpen, page, env, schema }
        },
        dispatch
    } = useContext(Store);

    const prev = usePrevious({  env });

    const updatefilteredDepartments = useCallback(() => {
        console.log('updatefilters called')
    }, [prev,  env, dispatch]);


    useEffect(() => {
        console.log('use effect');
        updatefilteredDepartments();
    }, [updatefilteredDepartments]);

    return (
        <Layout className="chip-details-wrapper">
            <div className="chip-details-sidenav-wrapper">
                <Navigation showPage={showPage} currentPage={page} menuItems={NAV_MENU_OBJECT}></Navigation>
            </div>
             
            <Content className="chip-details-content-wrapper" style={{ backgroundColor: "#fff" }}>{props.children}</Content>
        </Layout>
    )
}

export default BaseContainer;

/*
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} className="menuStyle">
        <Menu.Item key="1" className="option1">Application Information</Menu.Item>
        <Menu.Item key="2" className="option2">Search Past Jobs and Examples</Menu.Item>
        <Menu.Item key="3" className="option3">New Job Submissions</Menu.Item>
    </Menu>
*/