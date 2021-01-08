import axios from 'axios';

/*
const placeholderSubmission = () => {
    let url = "http://127.0.0.1:8000/processlink/postdata";
    let ob = { "content-type": "application/json" };
    let data = {
        "bodySide": "both",
        "colormapOption": "jet",
        "contactNum": "4",
        "contactSymmetry": "no",
        "currentVal": 3.5,
        "imageData": "",
        "jobID": "d7007dff-067b-4c7f-be84-11dea364439e",
        "normalizationMethod": "percentage",
        "signalingProcMethod": "max"
    }
    console.log(data);
    return axios.post(url, data, { headers: ob }); 
}
*/

/*
const postSubmission = (jobID, contactNum, currentVal, bodySide, contactSymmetry, signalingProcMethod, normalizationMethod, colormapOption) => {
    let url = "http://127.0.0.1:8000/processlink/postdata";
    let ob = { "content-type": "application/json" };
    let data = {
        "jobID": jobID,
        "contactNum": contactNum,
        "currentVal": currentVal,
        "bodySide": bodySide,
        "contactSymmetry": contactSymmetry,
        "signalingProcMethod": signalingProcMethod,
        "normalizationMethod": normalizationMethod,
        "colormapOption": colormapOption,
        "imageData": "",
    }
    console.log("proper way to submit post request");
    console.log(data);
    return axios.post(url, data, { headers: ob });
}
*/

/*
export const stopSpinner = (dispatch) => {
    let payload = {
        loading: false
    }
    return dispatch({
        type: "stop_spinner",
        payload: payload
    })
}

export const startSpinner = (dispatch) => {
    let payload = {
        loading: true
    }
    return dispatch({
        type: "start_spinner",
        payload: payload
    })
}
*/

/*
export const formAction = async (dispatch, jobID, contactNum, currentVal, bodySide, contactSymmetry, signalingProcMethod, normalizationMethod, colormapOption) => {
    const response = await postSubmission(jobID, contactNum, currentVal, bodySide, contactSymmetry, signalingProcMethod, normalizationMethod, colormapOption);
    if (response) {
        console.log("printing image response");
        console.log(response);
        let payload = {
            submission_data: response.data,
            loading: false
        }
        return dispatch({
            type: "submission_post",
            payload: payload
        });
    } else {
        console.log("Server error");
        let payload = {
            loading: false,
            server_message: "backend error"
        }
        return dispatch({
            type: "submission_server_error",
            payload: payload
        })
    }
}
*/

/*
export const placeholderAction = async (dispatch) => {
    const response = await placeholderSubmission();
    if (response) {
        console.log("printing image response");
        console.log(response);
        let payload = {
            submission_data: response.data,
            loading: false
        }
        return dispatch({
            type: "placeholder_post",
            payload: payload
        });
    } else {
        console.log("Server error");
        let payload = {
            loading: false,
            server_message: "backend error"
        }
        return dispatch({
            type: "placeholder_server_error",
            payload: payload
        })
    }
}
*/

export const getLookUpAction = (dispatch, lookUpData) => {
    console.log("get look up action called");
    console.log("imageData");
    let payload = {
        lookUpData: lookUpData,
    }
    return dispatch({
        type: "get_look_up_data",
        payload: payload
    })
}

export const getImageDataAction = (dispatch, modifyData) => {
    console.log("get image action called");
    console.log("imageData");
    let payload = {
        modifyData: modifyData,
    }
    return dispatch({
        type: "get_image_data",
        payload: payload
    })
}

export const getFileNameAction = (dispatch, fileName) => {
    let payload = {
        fileName: fileName,
    }
    return dispatch({
        type: "get_file_name",
        payload: payload
    })
}