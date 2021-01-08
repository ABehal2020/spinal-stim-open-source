import React, { useReducer, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import formReducer from '../reducers/formReducer';
import FormInterface from '../components/form/form';
import LookUp from '../components/lookUp/lookUp';
import { formAction, startSpinner, placeholderAction, getImageDataAction, getLookUpAction, getFileNameAction } from '../actions/formAction';
import {save} from 'save-file';
import {Button} from 'antd';
import './formContainer.scss';

const b64 = require('base64-js');

export const FormContainer = (props) => {
    let initialState = {
        loading: false,
        error: false,
        image_complete: "",
        image_lookup: "",
        file_name: ""
    }

    const [{ loading, error, server_message, image_complete, image_lookup, file_name}, dispatch] = useReducer(formReducer, initialState);

    const [toggleSaveImage, setToggleImageSave] = useState("hide-toggle");

    const fetchFileName = (f_name) => {
        console.log(f_name);
        getFileNameAction(dispatch, f_name)
    }

    const fetchLookUp = (response, type = "default") => {
        let imageNewData;
        if (type == "cache") {
            imageNewData = response.data.imageData;
            getLookUpAction(dispatch, response.data.imageData);
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
                setToggleImageSave("show-toggle");
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
                    setToggleImageSave("show-toggle");
                }).catch((error) => {
                    console.log("error");
                })
                setToggleImageSave("show-toggle");
            })
            .catch((error) => {
                console.log("error");
            })
        } else {
            getImageDataAction(dispatch, response.data.imageData);
            setToggleImageSave("show-toggle");
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
        await save(image_complete.substring(26), fileName);
    }

    return (
        <div>
            <FormInterface fetchImageData={fetchImageData} fetchLookUp={fetchLookUp} fetchFileName={fetchFileName}></FormInterface>
            {/* <LookUp fetchLookUp={fetchLookUp}></LookUp> */}
            <div className="result">
                <img src={image_complete} className="bodyHeatMap"></img>
                <Button onClick={saveImage} className={toggleSaveImage}>Save Image</Button>
            </div>
            {/* <img src={image_lookup} className="bodyHeatMap"></img> */}
            {/*
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTI2cHgiIGhlaWdodD0iMTI2cHgiIHZpZXdCb3g9IjAgMCAxMjYgMTI2IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMjYgMTI2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxyZWN0IHg9IjEuMDk1IiB5PSI5OC4yMjQiIHdpZHRoPSIxMjMuODEiIGhlaWdodD0iMTkuMjc1Ii8+DQoJPHJlY3QgeD0iMS4wOTUiIHk9Ijg1Ljc0IiB3aWR0aD0iMTIzLjgxIiBoZWlnaHQ9IjUuMjA1Ii8+DQoJPHBhdGggZD0iTTE4LjQwNCw5NS43MjFjMC43NjcsMCwxLjM4OS0wLjYyMywxLjM4OS0xLjM5cy0wLjYyMi0xLjM4OC0xLjM4OS0xLjM4OEgzLjQ4MWMtMC43NjcsMC0xLjM4OCwwLjYyMS0xLjM4OCwxLjM4OA0KCQlzMC42MjIsMS4zOSwxLjM4OCwxLjM5SDE4LjQwNHoiLz4NCgk8cGF0aCBkPSJNNDQuNDMzLDk1LjcyMWMwLjc2NywwLDEuMzg4LTAuNjIzLDEuMzg4LTEuMzlzLTAuNjIyLTEuMzg4LTEuMzg4LTEuMzg4SDI5LjUxYy0wLjc2NywwLTEuMzg5LDAuNjIxLTEuMzg5LDEuMzg4DQoJCXMwLjYyMiwxLjM5LDEuMzg5LDEuMzlINDQuNDMzeiIvPg0KCTxwYXRoIGQ9Ik03MC40NjEsOTUuNzIxYzAuNzY3LDAsMS4zODgtMC42MjMsMS4zODgtMS4zOXMtMC42MjItMS4zODgtMS4zODgtMS4zODhINTUuNTM5Yy0wLjc2NywwLTEuMzg4LDAuNjIxLTEuMzg4LDEuMzg4DQoJCXMwLjYyMiwxLjM5LDEuMzg4LDEuMzlINzAuNDYxeiIvPg0KCTxwYXRoIGQ9Ik05Ni40OSw5NS43MjFjMC43NjcsMCwxLjM4OS0wLjYyMywxLjM4OS0xLjM5cy0wLjYyMi0xLjM4OC0xLjM4OS0xLjM4OEg4MS41NjdjLTAuNzY3LDAtMS4zODgsMC42MjEtMS4zODgsMS4zODgNCgkJczAuNjIyLDEuMzksMS4zODgsMS4zOUg5Ni40OXoiLz4NCgk8cGF0aCBkPSJNMTIyLjUxOSw5NS43MjFjMC43NjcsMCwxLjM4OS0wLjYyMywxLjM4OS0xLjM5cy0wLjYyMi0xLjM4OC0xLjM4OS0xLjM4OGgtMTQuOTIzYy0wLjc2NywwLTEuMzg4LDAuNjIxLTEuMzg4LDEuMzg4DQoJCXMwLjYyMiwxLjM5LDEuMzg4LDEuMzlIMTIyLjUxOXoiLz4NCgk8cGF0aCBkPSJNNy40MSw4MC45aDUzLjQ0MmMwLjg2MywwLDEuNTYyLTAuNjk5LDEuNTYyLTEuNTYyVjM5LjU0M2MwLTAuODYyLTAuNjk5LTEuNTYzLTEuNTYyLTEuNTYzSDQ1LjMxNHYtNi41MzkNCgkJYzAtMC44NjEtMC42OTgtMS41NjItMS41NjEtMS41NjJIMjMuNDI4Yy0wLjg2MywwLTEuNTYyLDAuNy0xLjU2MiwxLjU2MnY2LjU0SDcuNDFjLTAuODYyLDAtMS41NjIsMC43LTEuNTYyLDEuNTYzdjM5Ljc5NQ0KCQlDNS44NDgsODAuMjAxLDYuNTQ3LDgwLjksNy40MSw4MC45eiBNMzQuNDkyLDU3Ljg3NGgtMS43OTZ2LTYuNzY4aDEuNzk2VjU3Ljg3NHogTTI2LjU2MywzNC41NzRoMTQuMDU1djMuNDA2SDI2LjU2M1YzNC41NzR6DQoJCSBNMTAuNTQ0LDQyLjY3OGg0Ny4xNzN2MTEuOThIMzYuOTQydi00LjAwNmMwLTAuODYzLTAuNjk5LTEuNTYzLTEuNTYyLTEuNTYzaC0zLjU4MmMtMC44NjMsMC0xLjU2MiwwLjY5OS0xLjU2MiwxLjU2M3Y0LjAwNg0KCQlIMTAuNTQ0VjQyLjY3OHoiLz4NCgk8cGF0aCBkPSJNNjguNzM0LDgwLjloNDkuOTU4YzAuODA3LDAsMS40Ni0wLjY1MywxLjQ2LTEuNDZWMTcuNTM0YzAtMC44MDYtMC42NTMtMS40NTktMS40Ni0xLjQ1OWgtMTQuNTI0VjkuOTYxDQoJCWMwLTAuODA3LTAuNjUzLTEuNDYtMS40Ni0xLjQ2aC0xOWMtMC44MDcsMC0xLjQ2LDAuNjUzLTEuNDYsMS40NnY2LjExNUg2OC43MzRjLTAuODA3LDAtMS40NiwwLjY1My0xLjQ2LDEuNDU5Vjc5LjQ0DQoJCUM2Ny4yNzQsODAuMjQ3LDY3LjkyNyw4MC45LDY4LjczNCw4MC45eiBNODYuNjM4LDEyLjg5aDEzLjEzOXYzLjE4Nkg4Ni42MzhWMTIuODl6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="/>
            */}
        </div>
    )
}

export default FormContainer;