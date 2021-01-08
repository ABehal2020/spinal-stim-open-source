import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { Col, Form, Slider, Input, InputNumber, Button, Checkbox, Radio, Table } from 'antd';
import axios from 'axios';
import {save} from 'save-file';
import 'antd/dist/antd.css';
import './lookUp.scss';
import getFileNameAction from '../../actions/formAction';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const LookUp = (props) => {
    const [jobLookUp, setJobLookUp] = useState("");
    const [toggleError, setToggleError] = useState("error-hide");
    const [toggleSaveImage, setToggleImageSave] = useState(true);
    const [image_lookup, setImageLookUp] = useState("");

    const inputLookup = () => {
        console.log(jobLookUp);
        props.fetchFileName(jobLookUp);
        let sourceJobID = jobLookUp;
        let urlPrefix = "http://127.0.0.1:8000/values/stim/?jobID=";
        let urlComplete = urlPrefix.concat(sourceJobID);
        // let urlComplete = "http://127.0.0.1:8000/values/stim/?jobID=88911b5b-9611-4387-81e3-60225211257d";
        let ob = { "content-type": "application/json" };
        axios.get(urlComplete, { headers: ob }).
        then((response) => {
            setToggleError("error-hide");
            if (response.data[0].imageData == null) {
                console.log(response);
                console.log("must access cache");
                console.log("accessing cache");
                console.log("source job ID");
                console.log(response.data[0].sourceJobID);
                let sourceJobID = response.data[0].sourceJobID;
                let urlPrefix = "http://127.0.0.1:8000/values/stim/?jobID=";
                let urlComplete = urlPrefix.concat(sourceJobID);
                console.log(urlComplete);
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

                    console.log("trying to get image data");
                    console.log(imageCacheData);

                    axios.post(newUrl, newData, {headers: ob }).
                    then((response) => {
                        console.log("response");
                        console.log(response);
                        console.log(response.data.imageData);
                        let type = "cache";
                        props.fetchLookUp(response, type);
                        setImageLookUp(response.data.imageData);
                        setToggleImageSave(false);
                    }).catch((error) => {
                        console.log("inner error");
                        console.log("error");
                    })
                })
                .catch((error) => {
                    console.log("outer error");
                    console.log("error");
                })
            } else { 
                props.fetchLookUp(response);
                setImageLookUp(response.data[0].imageData);
                setToggleImageSave(false);
            }
        })
        .catch((error) => {
            console.log("error");
            setToggleError("error-show");
        })
    }

    const handleChangeJobLookUp = (event) => {
        setJobLookUp(event.target.value);
    }

    const saveImage = async () => {
        const fileName = jobLookUp.concat('.svg');
        await save(image_lookup.substring(26), fileName);
    }

    return (
        <div>
            <Col span={4} className="col-md-2"></Col>
            <Col span={20} className="col-md-10">
                <Form {...layout} onFinish={inputLookup}>
                    <Form.Item label="Job ID Look Up" name="lookupJobID" rules={[
                        {
                            required: true,
                            message: 'Please submit a job ID to look up.',
                        },
                    ]}>
                        <Input onChange={handleChangeJobLookUp}></Input>
                    </Form.Item>
                    <p className={toggleError}>No such job ID exists.</p>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" className="buttonStyle">
                            Search
                        </Button>
                        {/* <Button onClick={saveImage} disabled={toggleSaveImage}>Save Image</Button> */}
                    </Form.Item>
                </Form >
            </Col>
        </div>
    )
}

export default LookUp;