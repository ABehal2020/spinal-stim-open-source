import React, {createContext, useReducer} from 'react';
import {BaseReducer} from '../reducers/baseReducer';
import {BASE_OBJECT} from '../definitions/baseObject';

export const Store = createContext(BASE_OBJECT);

export const BaseProvider = (props) => {
    const [state, dispatch] = useReducer(BaseReducer, BASE_OBJECT);
    console.log('dsipatch');
    console.log(dispatch);
    console.log(state);
    const value = {state, dispatch};
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
};