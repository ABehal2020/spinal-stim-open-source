let initStore = {
    loading: false,
    error: false,
    server_message: "",
    image_complete: "",
    image_lookup: "",
    file_name: "heatmap",
    submission_data: {
        "jobID": "",
        "caseNum": "",
        "contactNum": "",
        "currentVal": "",
        "bodySide": "",
        "contactSymmetry": "",
        "signalingProcMethod": "",
        "normalizationMethod": "",
        "colormapOption": "",
        "imageData": "",
    }
}

export default (state = initStore, action) => {
    switch (action.type) {
        case "submission_post":
            console.log('got data from server - modifying state');
            console.log(action);
            const o =  { ...state, submission_data: action.payload.submission_data, loading: action.payload.loading};
            console.log(o);
            return o;
            //return { ...state, submission_data: action.payload.submission_data, loading: action.payload.loading}
        case "get_image_data":
            console.log("got image data from server - modifying state");
            console.log(action);
            const local_data2 = action.payload.modifyData;
            const imagePrefix2 = "data:image/svg+xml;base64,";
            const image_complete2 = imagePrefix2.concat(local_data2);
            const object = { ...state, image_complete: image_complete2}
            console.log(object);
            return object;
        case "get_look_up_data":
            console.log("got image data from server - modifying state");
            console.log(action);
            const local_data3 = action.payload.lookUpData;
            const imagePrefix3 = "data:image/svg+xml;base64,";
            const image_complete3 = imagePrefix3.concat(local_data3);
            const object2 = { ...state, image_lookup: image_complete3}
            console.log(object2);
            return object2;
        case "get_file_name":
            console.log("file name changing");
            console.log(action);
            const object3 = { ...state, file_name: action.payload.fileName};
            console.log(state);
            return object3;
        /*
        case "placeholder_post":
            console.log('got data from server - modifying state');
            console.log(action);
            const local_data = action.payload.submission_data.imageData;
            const imagePrefix = "data:image/svg+xml;base64,";
            const image_complete = imagePrefix.concat(local_data);
            const obj =  { ...state, image_complete: image_complete, loading: action.payload.loading};
            console.log(obj);
            return obj;
            //return { ...state, submission_data: action.payload.submission_data, loading: action.payload.loading}
        */
        case "submissions_begin":
            return { ...state, loading: true }
        case "submissions_error":
            return { ...state, error: true }
        case "server_message":
            return { ...state, server_message: action.payload.server_message }
        /*
        case "start_spinner":
            return { ...state, loading: action.payload.loading }
        case "stop_spinner":
            return { ...state, loading: action.payload.loading }
        case "submissions_server_error":
            return {...state, loading: action.payload.loading, server_message: action.payload.server_message}
        case "placeholder_server_error":
            return {...state, loading: action.payload.loading, server_message: action.payload.server_message}
        */
    }
}