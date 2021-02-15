import React, { useReducer, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import formReducer from '../../../reducers/formReducer';
import FormInterface from '../../../components/form/form';
import LookUp from '../../../components/lookUp/lookUp';
import { formAction, startSpinner, placeholderAction, getImageDataAction, getLookUpAction, getFileNameAction } from '../../../actions/formAction';
import gray from '../../../images/gray.svg';
import hot from '../../../images/hot.svg';
import jet from '../../../images/jet.svg';
import parula from '../../../images/parula.svg';
import './examples.scss';
import {save} from 'save-file';
import {Button} from 'antd';

const b64 = require('base64-js');

export const Examples = (props) => {
    let initialState = {
        loading: false,
        error: false,
        image_complete: "",
        image_lookup: "",
        file_name: ""
    }

    const [{ loading, error, server_message, image_complete, image_lookup, file_name}, dispatch] = useReducer(formReducer, initialState);
    
    const [toggleSaveImage, setToggleImageSave] = useState(true);
    const [saveStyle, setSaveStyle] = useState("saveStyleHide");

    const fetchFileName = (f_name) => {
        console.log(f_name);
        getFileNameAction(dispatch, f_name)
    }

    const fetchLookUp = (response, type = "default") => {
        let imageNewData;
        if (type == "cache") {
            imageNewData = response.data.imageData;
            getLookUpAction(dispatch, response.data.imageData);
            setToggleImageSave(false);
            setSaveStyle("saveStyleShow");
        } else {
            imageNewData = response.data[0].imageData;
        
            let newUrl = "http://127.0.0.1:8000/processlink/postimage";

            let newData = {
                "jobID": "",
                "imageData": imageNewData
            }

            let ob = { "content-type": "application/json" };

            axios.post(newUrl, newData, {headers: ob }).
            then((response) => {
                console.log("response");
                console.log(response.data.imageData);
                if (response.data.imageData == null) {
                    console.log("must access cache");
                }
                getLookUpAction(dispatch, response.data.imageData);
                setToggleImageSave(false);
                setSaveStyle("saveStyleShow");
            }).catch((error) => {
                console.log("error");
            })
        }
    }

    const fetchImageData = (response) => {
        console.log("I have been called by my child form.js");
        console.log("Child is passing me argument response which has image data");
        console.log(response);
        if (response.data.imageData == null) {
            console.log("accessing cache");
            let sourceJobID = response.data.sourceJobID[0].jobID;
            let urlPrefix = "http://127.0.0.1:8000/values/stim/?jobID=";
            let urlComplete = urlPrefix.concat(sourceJobID);
            // let urlComplete = "http://127.0.0.1:8000/values/stim/?jobID=88911b5b-9611-4387-81e3-60225211257d";
            let ob = { "content-type": "application/json" };
            axios.get(urlComplete, { headers: ob }).
            then((response) => {
                console.log(response);
                let imageCacheData = response.data[0].imageData;
                let newUrl = "http://127.0.0.1:8000/processlink/postimage";

                let newData = {
                    "jobID": "",
                    "imageData": imageCacheData
                }

                /*
                console.log('******************************************conversion********************');
                let imageCacheData = "EQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWRYUm1MVGdpUHo0TkNqd2hMUzBnUjJWdVpYSmhkRzl5T2lCQlpHOWlaU0JKYkd4MWMzUnlZWFJ2Y2lBeE5pNHdMakFzSUZOV1J5QkZlSEJ2Y25RZ1VHeDFaeTFKYmlBdUlGTldSeUJXWlhKemFXOXVPaUEyTGpBd0lFSjFhV3hrSURBcElDQXRMVDROQ2p3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krRFFvOGMzWm5JSFpsY25OcGIyNDlJakV1TVNJZ2FXUTlJa3hoZVdWeVh6RWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIZzlJakJ3ZUNJZ2VUMGlNSEI0SWcwS0NTQjNhV1IwYUQwaU1USTJjSGdpSUdobGFXZG9kRDBpTVRJMmNIZ2lJSFpwWlhkQ2IzZzlJakFnTUNBeE1qWWdNVEkySWlCbGJtRmliR1V0WW1GamEyZHliM1Z1WkQwaWJtVjNJREFnTUNBeE1qWWdNVEkySWlCNGJXdzZjM0JoWTJVOUluQnlaWE5sY25abElqNE5DanhuUGcwS0NUeHlaV04wSUhnOUlqRXVNRGsxSWlCNVBTSTVPQzR5TWpRaUlIZHBaSFJvUFNJeE1qTXVPREVpSUdobGFXZG9kRDBpTVRrdU1qYzFJaTgrRFFvSlBISmxZM1FnZUQwaU1TNHdPVFVpSUhrOUlqZzFMamMwSWlCM2FXUjBhRDBpTVRJekxqZ3hJaUJvWldsbmFIUTlJalV1TWpBMUlpOCtEUW9KUEhCaGRHZ2daRDBpVFRFNExqUXdOQ3c1TlM0M01qRmpNQzQzTmpjc01Dd3hMak00T1Mwd0xqWXlNeXd4TGpNNE9TMHhMak01Y3kwd0xqWXlNaTB4TGpNNE9DMHhMak00T1MweExqTTRPRWd6TGpRNE1XTXRNQzQzTmpjc01DMHhMak00T0N3d0xqWXlNUzB4TGpNNE9Dd3hMak00T0EwS0NRbHpNQzQyTWpJc01TNHpPU3d4TGpNNE9Dd3hMak01U0RFNExqUXdOSG9pTHo0TkNnazhjR0YwYUNCa1BTSk5ORFF1TkRNekxEazFMamN5TVdNd0xqYzJOeXd3TERFdU16ZzRMVEF1TmpJekxERXVNemc0TFRFdU16bHpMVEF1TmpJeUxURXVNemc0TFRFdU16ZzRMVEV1TXpnNFNESTVMalV4WXkwd0xqYzJOeXd3TFRFdU16ZzVMREF1TmpJeExURXVNemc1TERFdU16ZzREUW9KQ1hNd0xqWXlNaXd4TGpNNUxERXVNemc1TERFdU16bElORFF1TkRNemVpSXZQZzBLQ1R4d1lYUm9JR1E5SWswM01DNDBOakVzT1RVdU56SXhZekF1TnpZM0xEQXNNUzR6T0RndE1DNDJNak1zTVM0ek9EZ3RNUzR6T1hNdE1DNDJNakl0TVM0ek9EZ3RNUzR6T0RndE1TNHpPRGhJTlRVdU5UTTVZeTB3TGpjMk55d3dMVEV1TXpnNExEQXVOakl4TFRFdU16ZzRMREV1TXpnNERRb0pDWE13TGpZeU1pd3hMak01TERFdU16ZzRMREV1TXpsSU56QXVORFl4ZWlJdlBnMEtDVHh3WVhSb0lHUTlJazA1Tmk0ME9TdzVOUzQzTWpGak1DNDNOamNzTUN3eExqTTRPUzB3TGpZeU15d3hMak00T1MweExqTTVjeTB3TGpZeU1pMHhMak00T0MweExqTTRPUzB4TGpNNE9FZzRNUzQxTmpkakxUQXVOelkzTERBdE1TNHpPRGdzTUM0Mk1qRXRNUzR6T0Rnc01TNHpPRGdOQ2drSmN6QXVOakl5TERFdU16a3NNUzR6T0Rnc01TNHpPVWc1Tmk0ME9Yb2lMejROQ2drOGNHRjBhQ0JrUFNKTk1USXlMalV4T1N3NU5TNDNNakZqTUM0M05qY3NNQ3d4TGpNNE9TMHdMall5TXl3eExqTTRPUzB4TGpNNWN5MHdMall5TWkweExqTTRPQzB4TGpNNE9TMHhMak00T0dndE1UUXVPVEl6WXkwd0xqYzJOeXd3TFRFdU16ZzRMREF1TmpJeExURXVNemc0TERFdU16ZzREUW9KQ1hNd0xqWXlNaXd4TGpNNUxERXVNemc0TERFdU16bElNVEl5TGpVeE9Yb2lMejROQ2drOGNHRjBhQ0JrUFNKTk55NDBNU3c0TUM0NWFEVXpMalEwTW1Nd0xqZzJNeXd3TERFdU5UWXlMVEF1TmprNUxERXVOVFl5TFRFdU5UWXlWak01TGpVME0yTXdMVEF1T0RZeUxUQXVOams1TFRFdU5UWXpMVEV1TlRZeUxURXVOVFl6U0RRMUxqTXhOSFl0Tmk0MU16a05DZ2tKWXpBdE1DNDROakV0TUM0Mk9UZ3RNUzQxTmpJdE1TNDFOakV0TVM0MU5qSklNak11TkRJNFl5MHdMamcyTXl3d0xURXVOVFl5TERBdU55MHhMalUyTWl3eExqVTJNblkyTGpVMFNEY3VOREZqTFRBdU9EWXlMREF0TVM0MU5qSXNNQzQzTFRFdU5UWXlMREV1TlRZemRqTTVMamM1TlEwS0NRbEROUzQ0TkRnc09EQXVNakF4TERZdU5UUTNMRGd3TGprc055NDBNU3c0TUM0NWVpQk5NelF1TkRreUxEVTNMamczTkdndE1TNDNPVFoyTFRZdU56WTRhREV1TnprMlZqVTNMamczTkhvZ1RUSTJMalUyTXl3ek5DNDFOelJvTVRRdU1EVTFkak11TkRBMlNESTJMalUyTTFZek5DNDFOelI2RFFvSkNTQk5NVEF1TlRRMExEUXlMalkzT0dnME55NHhOek4yTVRFdU9UaElNell1T1RReWRpMDBMakF3Tm1Nd0xUQXVPRFl6TFRBdU5qazVMVEV1TlRZekxURXVOVFl5TFRFdU5UWXphQzB6TGpVNE1tTXRNQzQ0TmpNc01DMHhMalUyTWl3d0xqWTVPUzB4TGpVMk1pd3hMalUyTTNZMExqQXdOZzBLQ1FsSU1UQXVOVFEwVmpReUxqWTNPSG9pTHo0TkNnazhjR0YwYUNCa1BTSk5Oamd1TnpNMExEZ3dMamxvTkRrdU9UVTRZekF1T0RBM0xEQXNNUzQwTmkwd0xqWTFNeXd4TGpRMkxURXVORFpXTVRjdU5UTTBZekF0TUM0NE1EWXRNQzQyTlRNdE1TNDBOVGt0TVM0ME5pMHhMalExT1dndE1UUXVOVEkwVmprdU9UWXhEUW9KQ1dNd0xUQXVPREEzTFRBdU5qVXpMVEV1TkRZdE1TNDBOaTB4TGpRMmFDMHhPV010TUM0NE1EY3NNQzB4TGpRMkxEQXVOalV6TFRFdU5EWXNNUzQwTm5ZMkxqRXhOVWcyT0M0M016UmpMVEF1T0RBM0xEQXRNUzQwTml3d0xqWTFNeTB4TGpRMkxERXVORFU1VmpjNUxqUTBEUW9KQ1VNMk55NHlOelFzT0RBdU1qUTNMRFkzTGpreU55dzRNQzQ1TERZNExqY3pOQ3c0TUM0NWVpQk5PRFl1TmpNNExERXlMamc1YURFekxqRXpPWFl6TGpFNE5rZzROaTQyTXpoV01USXVPRGw2SWk4K0RRbzhMMmMrRFFvOEwzTjJaejROQ2c9PQ==";

                let newData = {
                    "jobID": "88911b5b-9611-4387-81e3-60225211257d",
                    "imageData": "UEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWRYUm1MVGdpUHo0TkNqd2hMUzBnUjJWdVpYSmhkRzl5T2lCQlpHOWlaU0JKYkd4MWMzUnlZWFJ2Y2lBeE5pNHdMakFzSUZOV1J5QkZlSEJ2Y25RZ1VHeDFaeTFKYmlBdUlGTldSeUJXWlhKemFXOXVPaUEyTGpBd0lFSjFhV3hrSURBcElDQXRMVDROQ2p3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krRFFvOGMzWm5JSFpsY25OcGIyNDlJakV1TVNJZ2FXUTlJa3hoZVdWeVh6RWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIZzlJakJ3ZUNJZ2VUMGlNSEI0SWcwS0NTQjNhV1IwYUQwaU1USTJjSGdpSUdobGFXZG9kRDBpTVRJMmNIZ2lJSFpwWlhkQ2IzZzlJakFnTUNBeE1qWWdNVEkySWlCbGJtRmliR1V0WW1GamEyZHliM1Z1WkQwaWJtVjNJREFnTUNBeE1qWWdNVEkySWlCNGJXdzZjM0JoWTJVOUluQnlaWE5sY25abElqNE5DanhuUGcwS0NUeHlaV04wSUhnOUlqRXVNRGsxSWlCNVBTSTVPQzR5TWpRaUlIZHBaSFJvUFNJeE1qTXVPREVpSUdobGFXZG9kRDBpTVRrdU1qYzFJaTgrRFFvSlBISmxZM1FnZUQwaU1TNHdPVFVpSUhrOUlqZzFMamMwSWlCM2FXUjBhRDBpTVRJekxqZ3hJaUJvWldsbmFIUTlJalV1TWpBMUlpOCtEUW9KUEhCaGRHZ2daRDBpVFRFNExqUXdOQ3c1TlM0M01qRmpNQzQzTmpjc01Dd3hMak00T1Mwd0xqWXlNeXd4TGpNNE9TMHhMak01Y3kwd0xqWXlNaTB4TGpNNE9DMHhMak00T1MweExqTTRPRWd6TGpRNE1XTXRNQzQzTmpjc01DMHhMak00T0N3d0xqWXlNUzB4TGpNNE9Dd3hMak00T0EwS0NRbHpNQzQyTWpJc01TNHpPU3d4TGpNNE9Dd3hMak01U0RFNExqUXdOSG9pTHo0TkNnazhjR0YwYUNCa1BTSk5ORFF1TkRNekxEazFMamN5TVdNd0xqYzJOeXd3TERFdU16ZzRMVEF1TmpJekxERXVNemc0TFRFdU16bHpMVEF1TmpJeUxURXVNemc0TFRFdU16ZzRMVEV1TXpnNFNESTVMalV4WXkwd0xqYzJOeXd3TFRFdU16ZzVMREF1TmpJeExURXVNemc1TERFdU16ZzREUW9KQ1hNd0xqWXlNaXd4TGpNNUxERXVNemc1TERFdU16bElORFF1TkRNemVpSXZQZzBLQ1R4d1lYUm9JR1E5SWswM01DNDBOakVzT1RVdU56SXhZekF1TnpZM0xEQXNNUzR6T0RndE1DNDJNak1zTVM0ek9EZ3RNUzR6T1hNdE1DNDJNakl0TVM0ek9EZ3RNUzR6T0RndE1TNHpPRGhJTlRVdU5UTTVZeTB3TGpjMk55d3dMVEV1TXpnNExEQXVOakl4TFRFdU16ZzRMREV1TXpnNERRb0pDWE13TGpZeU1pd3hMak01TERFdU16ZzRMREV1TXpsSU56QXVORFl4ZWlJdlBnMEtDVHh3WVhSb0lHUTlJazA1Tmk0ME9TdzVOUzQzTWpGak1DNDNOamNzTUN3eExqTTRPUzB3TGpZeU15d3hMak00T1MweExqTTVjeTB3TGpZeU1pMHhMak00T0MweExqTTRPUzB4TGpNNE9FZzRNUzQxTmpkakxUQXVOelkzTERBdE1TNHpPRGdzTUM0Mk1qRXRNUzR6T0Rnc01TNHpPRGdOQ2drSmN6QXVOakl5TERFdU16a3NNUzR6T0Rnc01TNHpPVWc1Tmk0ME9Yb2lMejROQ2drOGNHRjBhQ0JrUFNKTk1USXlMalV4T1N3NU5TNDNNakZqTUM0M05qY3NNQ3d4TGpNNE9TMHdMall5TXl3eExqTTRPUzB4TGpNNWN5MHdMall5TWkweExqTTRPQzB4TGpNNE9TMHhMak00T0dndE1UUXVPVEl6WXkwd0xqYzJOeXd3TFRFdU16ZzRMREF1TmpJeExURXVNemc0TERFdU16ZzREUW9KQ1hNd0xqWXlNaXd4TGpNNUxERXVNemc0TERFdU16bElNVEl5TGpVeE9Yb2lMejROQ2drOGNHRjBhQ0JrUFNKTk55NDBNU3c0TUM0NWFEVXpMalEwTW1Nd0xqZzJNeXd3TERFdU5UWXlMVEF1TmprNUxERXVOVFl5TFRFdU5UWXlWak01TGpVME0yTXdMVEF1T0RZeUxUQXVOams1TFRFdU5UWXpMVEV1TlRZeUxURXVOVFl6U0RRMUxqTXhOSFl0Tmk0MU16a05DZ2tKWXpBdE1DNDROakV0TUM0Mk9UZ3RNUzQxTmpJdE1TNDFOakV0TVM0MU5qSklNak11TkRJNFl5MHdMamcyTXl3d0xURXVOVFl5TERBdU55MHhMalUyTWl3eExqVTJNblkyTGpVMFNEY3VOREZqTFRBdU9EWXlMREF0TVM0MU5qSXNNQzQzTFRFdU5UWXlMREV1TlRZemRqTTVMamM1TlEwS0NRbEROUzQ0TkRnc09EQXVNakF4TERZdU5UUTNMRGd3TGprc055NDBNU3c0TUM0NWVpQk5NelF1TkRreUxEVTNMamczTkdndE1TNDNPVFoyTFRZdU56WTRhREV1TnprMlZqVTNMamczTkhvZ1RUSTJMalUyTXl3ek5DNDFOelJvTVRRdU1EVTFkak11TkRBMlNESTJMalUyTTFZek5DNDFOelI2RFFvSkNTQk5NVEF1TlRRMExEUXlMalkzT0dnME55NHhOek4yTVRFdU9UaElNell1T1RReWRpMDBMakF3Tm1Nd0xUQXVPRFl6TFRBdU5qazVMVEV1TlRZekxURXVOVFl5TFRFdU5UWXphQzB6TGpVNE1tTXRNQzQ0TmpNc01DMHhMalUyTWl3d0xqWTVPUzB4TGpVMk1pd3hMalUyTTNZMExqQXdOZzBLQ1FsSU1UQXVOVFEwVmpReUxqWTNPSG9pTHo0TkNnazhjR0YwYUNCa1BTSk5Oamd1TnpNMExEZ3dMamxvTkRrdU9UVTRZekF1T0RBM0xEQXNNUzQwTmkwd0xqWTFNeXd4TGpRMkxURXVORFpXTVRjdU5UTTBZekF0TUM0NE1EWXRNQzQyTlRNdE1TNDBOVGt0TVM0ME5pMHhMalExT1dndE1UUXVOVEkwVmprdU9UWXhEUW9KQ1dNd0xUQXVPREEzTFRBdU5qVXpMVEV1TkRZdE1TNDBOaTB4TGpRMmFDMHhPV010TUM0NE1EY3NNQzB4TGpRMkxEQXVOalV6TFRFdU5EWXNNUzQwTm5ZMkxqRXhOVWcyT0M0M016UmpMVEF1T0RBM0xEQXRNUzQwTml3d0xqWTFNeTB4TGpRMkxERXVORFU1VmpjNUxqUTBEUW9KQ1VNMk55NHlOelFzT0RBdU1qUTNMRFkzTGpreU55dzRNQzQ1TERZNExqY3pOQ3c0TUM0NWVpQk5PRFl1TmpNNExERXlMamc1YURFekxqRXpPWFl6TGpFNE5rZzROaTQyTXpoV01USXVPRGw2SWk4K0RRbzhMMmMrRFFvOEwzTjJaejROQ2c9PQ=="
                }
                */

                axios.post(newUrl, newData, {headers: ob }).
                then((response) => {
                    console.log("response");
                    console.log(response.data.imageData);
                    getImageDataAction(dispatch, response.data.imageData);
                }).catch((error) => {
                    console.log("error");
                })
            })
            .catch((error) => {
                console.log("error");
            })
        } else {
            getImageDataAction(dispatch, response.data.imageData);
        }
    }

    const formCB = useCallback(() => {
        console.log('Step 2 - react call back fired');
        // placeholderAction(dispatch);
    }, [dispatch])

    useEffect(() => {
        console.log('Step 1 - react use effect executed');
        formCB();
    }, [formCB]);

    const saveImage = async () => {
        const fileName = file_name.concat('.svg');
        await save(image_lookup.substring(26), fileName);
    }

    return (
        <div className="general">
            <div className="lookingUp">
                <LookUp fetchLookUp={fetchLookUp} fetchFileName={fetchFileName}></LookUp>
                <img src={image_lookup} className="bodyHeatMap"></img>
                <Button onClick={saveImage} disabled={toggleSaveImage} className={saveStyle}>Save Image</Button>
            </div>
            <div class="flex-container">
                {/*
                <div className="turbo">
                     <h1>Turbo Colormap</h1> 
                    <img src={turbo}></img>
                </div>
                */}
                <div className="parula">
                    <h1>Parula Colormap</h1>
                    <img src={parula} width="800"></img>
                </div>
                <div className="hot">
                    <h1>Hot Colormap</h1>
                    <img src={hot} width="800"></img>
                </div>
                {/*
                <div className="bluewhitered">
                    <h1>Bluewhitered Colormap</h1>
                    <img src={bluewhitered}></img>
                </div>
                */}
                <div className="jet">
                    <h1>Jet Colormap</h1>
                    <img src={jet} width="800"></img>
                </div>
                <div className="gray">
                    <h1>Gray Colormap</h1>
                    <img src={gray} width="800"></img>
                </div>
            </div>
        </div>
    )
}

export default Examples;