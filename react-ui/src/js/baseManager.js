import React, { useContext, useEffect, useCallback, lazy, Suspense } from 'react';
import FormContainer from './containers/formContainer';
import BaseContainer from './containers/baseContainer';
import Banner from './scenes/banner/banner';
import { Layout, Menu, } from 'antd';
import { Store } from './store/Store';
import { usePrevious } from './utils/usePrevious';
import LoadingPage from './scenes/loadingPage/loadingPage';
import './baseManager.scss';

const LazyInformationPage = lazy(() => import('./scenes/pages/information/information'));
const LazyExamplesPage = lazy(() => import('./scenes/pages/examples/examples'));
const LazyGeneratePage = lazy(() => import('./scenes/pages/generate/generate'));

const BaseManager = () => {
  const {
    state: {

      cherryUser,
      departments,
      navigation: { page, env }
    },
    dispatch
  } = useContext(Store);

  const prev = usePrevious({ env });

  const updatefilteredDepartments = useCallback(() => {
    console.log('updatefilters called ');
  }, [prev, env, dispatch]);

  const januCB = useCallback(() => {
    console.log("call back");
    console.log(cherryUser);
    console.log(departments);
    console.log(dispatch);

  }, [cherryUser, dispatch, departments, env]);

  useEffect(() => {
    console.log("step 1");
    januCB();
  }, [januCB]);


  useEffect(() => {
    console.log("step 2");
    updatefilteredDepartments();
  }, [updatefilteredDepartments]);

  const getLazyMenu = (menuName) => {
    switch (menuName) {
      case "Information":
        return (<LazyInformationPage></LazyInformationPage>);
      case "Examples":
        return (<LazyExamplesPage></LazyExamplesPage>);
      case "Generate":
        return (<LazyGeneratePage></LazyGeneratePage>);
      default:
        return (<LazyGeneratePage></LazyGeneratePage>);
    }
  }

  return (
    <Layout>
      <Banner></Banner>
      <BaseContainer>
        <Suspense fallback={<LoadingPage></LoadingPage>}>
          {getLazyMenu(page)}
        </Suspense>
      </BaseContainer>
      {/*
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} className="menuStyle">
        <Menu.Item key="1" className="option1">Application Information</Menu.Item>
        <Menu.Item key="2" className="option2">Search Past Jobs and Examples</Menu.Item>
        <Menu.Item key="3" className="option3">New Job Submissions</Menu.Item>
      </Menu>
      */}
    </Layout>
  )
}

export default BaseManager;