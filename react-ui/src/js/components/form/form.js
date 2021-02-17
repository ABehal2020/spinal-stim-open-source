import React, { useReducer, useState, useEffect, useCallback } from 'react';
import formReducer from '../../reducers/formReducer';
import { Col, Form, Slider, Input, InputNumber, Button, Checkbox, Radio, Table} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import contactsPlacement from '../../images/contacts-placement.png';
import contactsDiagram from '../../images/contacts-diagram.png';
import muscleAbbreviations from '../../images/muscle-abbreviations.png';
import labelledBody from '../../images/labelled-body.png';
import leftBody from '../../images/left_body_labeled_2.svg';
import rightBody from '../../images/right_body_labeled_2.svg';
import wholeBody from '../../images/full_body_labeled_2.svg';
import MuscleTable from '../../components/muscleTable/MuscleTable';
import 'antd/dist/antd.css';
import './form.scss';

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

/*
const buttonStyle = {
    marginRight: '15px'
}
*/

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

const marks = {
    0: '0',
    1: '1.0',
    2: '2.0',
    3: '3.0',
    4: '4.0',
    5: '5.0',
    6: '6.0',
    7: '7.0',
    8: '8.0',
    9: '9.0',
    10: '10.0',
};

const columns = [
    {
        title: 'Muscle Groups',
        dataIndex: 'groups',
        key: 'groups',
    },
    {
        title: 'Abbreviations',
        dataIndex: 'abbreviations',
        key: 'abbreviations',
    },
];

const data = [
    {
        key: '1',
        groups: 'Left Adductor Hallucis',
        abbreviations: 'LAH',
    },
    {
        key: '2',
        groups: 'Left Adductor Magnus',
        abbreviations: 'LADD',
    },
    {
        key: '3',
        groups: 'Left Quadriceps',
        abbreviations: 'LQUAD',
    },
    {
        key: '4',
        groups: 'Left Gluteus Maximus',
        abbreviations: 'LGLUT',
    },
    {
        key: '5',
        groups: 'Left Biceps Femoris',
        abbreviations: 'LBF',
    },
    {
        key: '6',
        groups: 'Left Tibialis Anterior',
        abbreviations: 'LTA',
    },
    {
        key: '7',
        groups: 'Left Medial Gastrocnemius',
        abbreviations: 'LMG',
    },
    {
        key: '8',
        groups: 'Left Upper Abdomen',
        abbreviations: 'LUAB',
    },
    {
        key: '9',
        groups: 'Left Lower Abdomen',
        abbreviations: 'LLAB',
    },
    {
        key: '10',
        groups: 'Right Adductor Hallucis',
        abbreviations: 'RAH',
    },
    {
        key: '11',
        groups: 'Right Adductor Magnus',
        abbreviations: 'RADD',
    },
    {
        key: '12',
        groups: 'Right Quadriceps',
        abbreviations: 'RQUAD',
    },
    {
        key: '13',
        groups: 'Right Gluteus Maximus',
        abbreviations: 'RGLUT',
    },
    {
        key: '14',
        groups: 'Right Biceps Femoris',
        abbreviations: 'RBF',
    },
    {
        key: '15',
        groups: 'Right Tibialis Anterior',
        abbreviations: 'RTA',
    },
    {
        key: '16',
        groups: 'Right Medial Gastrocnemius',
        abbreviations: 'RMG',
    },
    {
        key: '17',
        groups: 'Right Upper Abdomen',
        abbreviations: 'RUAB',
    },
    {
        key: '18',
        groups: 'Right Lower Abdomen',
        abbreviations: 'RLAB',
    },
];

const jobID = uuidv4();

const FormInterface = (props) => {
    let initialState = {
        loading: false,
        error: false,
        server_message: "",
        submission_data: {
            "jobID": "",
            "caseNum": "",
            "contactNum": "",
            "currentVal": "",
            "bodySide": "",
            "contactSymmetry": "",
            "signalingProcMethod": "",
            // "normalization": "",
            "normalizationMethod": "",
            "colormapOption": "",
            "imageData": "",
        }
    }

    const [{loading, error, server_message, submission_data}, dispatch] = useReducer(formReducer, initialState);

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    const [caseNum, setCaseNum] = useState("");
    const [contactNum, setContactNum] = useState("");
    const [currentVal, setCurrentVal] = useState("");
    const [bodySide, setBodySide] = useState("");
    const [contactSymmetry, setContactSymmetry] = useState("");
    const [signalingProcMethod, setSignalingProcMethod] = useState("");
    // const [normalization, setNormalization] = useState("");
    const [normalizationMethod, setNormalizationMethod] = useState("");
    const [colormapOption, setColormapOption] = useState("");
    // const [disableNormalizationMethod, setDisableNormalizationMethod] = useState(true);
    const [toggleInformationButtonText, setToggleInformationButtonText] = useState("Click for More Information");
    const [imgContacts, setImgContacts] = useState("imgContacts-hide");
    const [dynamicLoading, setDynamicLoading] = useState(false);
    const [dynamicDisable, setDynamicDisable] = useState(false);
    const [dynamicNewDisable, setNewDynamicDisable] = useState(false);
    const [dynamicBodyImage, setDynamicBodyImage] = useState(labelledBody);

    const handleChangeCaseNumber = (event) => {
        setCaseNum(event.target.value);
        console.log(caseNum);
    }

    const handleChangeContactNumber = (event) => {
        setContactNum(event.target.value);
        console.log(contactNum);
    }

    const handleChangeCurrentValue = (event) => {
        let current = parseFloat(event);
        console.log(current);
        setCurrentVal(current);
    }

    const handleChangeBodySide = (event) => {
        /* if using check box:
        setBodySide(event); 
        */
        setBodySide(event.target.value);
        if (event.target.value == "left") {
            setDynamicBodyImage(leftBody);
        } else if (event.target.value == "right") {
            setDynamicBodyImage(rightBody);
        } else {
            setDynamicBodyImage(wholeBody);
        }
    }

    const handleChangeContactSymmetry = (event) => {
        setContactSymmetry(event.target.value);
    }

    const handleChangeSignalProcessingMethod = (event) => {
        setSignalingProcMethod(event.target.value);
    }

    /*
    const handleChangeNormalization = (event) => {
        setNormalization(event.target.value);
        console.log(event.target.value);
        if (event.target.value === "yes") {
            setDisableNormalizationMethod(false);
        } else {
            setDisableNormalizationMethod(true);
        }
    }
    */

    const handleChangeNormalizationMethod = (event) => {
        setNormalizationMethod(event.target.value);
    }

    const handleChangeColormapOption = (event) => {
        setColormapOption(event.target.value);
    }

    const toggleInformation = () => {
        if (toggleInformationButtonText === "Click for More Information") {
            setToggleInformationButtonText("Click to Collapse Information");
            setImgContacts("imgContacts-show");
        } else {
            setToggleInformationButtonText("Click for More Information");
            setImgContacts("imgContacts-hide");
        }
    }

    const callFetchImageData = (response) => {
        console.log("callFetchImageData called here");
        props.fetchImageData(response);
    }

    const submitData = () => {
        setDynamicLoading(true);
        setDynamicDisable(true);
        setNewDynamicDisable(true);
        let url = "http://127.0.0.1:8000/processlink/postdata";
        let ob = { "content-type": "application/json" };
        let data = {
            "jobID": jobID,
            "caseNum": caseNum,
            "contactNum": contactNum,
            "currentVal": currentVal,
            "bodySide": bodySide,
            "contactSymmetry": contactSymmetry,
            "signalingProcMethod": signalingProcMethod,
            "normalizationMethod": normalizationMethod,
            "colormapOption": colormapOption,
            "imageData": "",
        }
        console.log(data);
        axios.post(url, data, { headers: ob })
        .then((response) => {
            console.log("response");
            callFetchImageData(response);
            setDynamicLoading(false);
            setNewDynamicDisable(false);
        })
        .catch((error) => {
            console.log("error");
        });
    }

    const inputSave = () => {
        console.log(jobID);
        console.log(caseNum);
        console.log(contactNum);
        console.log(currentVal);
        console.log(bodySide);
        console.log(contactSymmetry);
        console.log(signalingProcMethod);
        // console.log(normalization);
        console.log(normalizationMethod);
        console.log(colormapOption);
        props.fetchFileName(jobID);
        submitData();
    }

    const refreshPage = () => {
        window.location.reload();
    }

    return (
        <div>
            <Col span={4} className="col-md-2"></Col>
            <Col span={20} className="col-md-10">
                <Form {...layout} form={form} onFinish={inputSave}>
                    {/* note that min and max parameters and onChange parameters for InputNumber component should be set in the final version */}
                    {/*
                    <Form.Item label="Select case number" name="caseNumber" rules={[
                        {
                            required: true,
                            message: 'Please select the case number.',
                        },
                    ]}>
                        <InputNumber min={2} max={9} value={Number.value}></InputNumber>
                    </Form.Item>
                    */}
                    <Form.Item label="Select case number" name="caseNumber" rules={[
                        {
                            required: true,
                            message: 'Please select the case number.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeCaseNumber} disabled={dynamicDisable}>
                            <Radio value="2">2</Radio>
                            <Radio value="4">4</Radio>
                            <Radio value="5">5</Radio>
                            <Radio value="9">9</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select contact number" name="contactNumber" rules={[
                        {
                            required: true,
                            message: 'Please select the contact number.',
                        },
                    ]}>
                        {/*
                        <InputNumber min={1} max={8} value={Number.value} onChange={handleChangeContactNumber}></InputNumber>
                        */}
                        <Radio.Group onChange={handleChangeContactNumber} disabled={dynamicDisable}>
                            <Radio value="1">1</Radio>
                            <Radio value="2">2</Radio>
                            <Radio value="3">3</Radio>
                            <Radio value="4">4</Radio>
                            <Radio value="5">5</Radio>
                            <Radio value="6">6</Radio>
                            <Radio value="7">7</Radio>
                            <Radio value="8">8</Radio>
                        </Radio.Group>
                        {/*
                        <div className="c-container">
                            <div className="c-box">
                                <span className="c-span">1</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">2</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">3</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">4</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">5</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">6</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">7</span>
                            </div>
                            <div className="c-box">
                                <span className="c-span">8</span>
                            </div>
                        </div>
                        */}
                        {/*
                        <Button value="2" style={buttonStyle} onClick={handleChangeContactNumber}>2</Button>
                        <Button value="3" style={buttonStyle} onClick={handleChangeContactNumber}>3</Button>
                        <Button value="4" style={buttonStyle} onClick={handleChangeContactNumber}>4</Button>
                        <Button value="5" style={buttonStyle} onClick={handleChangeContactNumber}>5</Button>
                        <Button value="6" style={buttonStyle} onClick={handleChangeContactNumber}>6</Button>
                        <Button value="7" style={buttonStyle} onClick={handleChangeContactNumber}>7</Button>
                        <Button value="8" style={buttonStyle} onClick={handleChangeContactNumber}>8</Button>
                        */}
                    </Form.Item>
                    <Form.Item label="Select body side" name="bodySide" rules={[
                        {
                            required: true,
                            message: 'Please select the body side.',
                        },
                    ]}>
                        {/*
                        <Checkbox.Group onChange={handleChangeBodySide} >
                            <Checkbox value="left">Left Side</Checkbox>
                            <Checkbox value="right">Right Side</Checkbox>
                        </Checkbox.Group>
                        */}
                        <Radio.Group onChange={handleChangeBodySide} disabled={dynamicDisable}>
                            <Radio value="left">Left Body</Radio>
                            <Radio value="right">Right Body</Radio>
                            <Radio value="full">Full Body</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Button onClick={toggleInformation} className="toggleButton">
                            {toggleInformationButtonText}
                    </Button>
                    <div className={imgContacts}>
                        <img src={contactsPlacement} alt="Placement of Contacts (P1-P8)" width="300" className="placement"></img>
                        <img src={contactsDiagram} alt="Diagram of Contacts (P1-P8)" className="diagram"></img> 
                        <img src={dynamicBodyImage} alt="Body Labelled with Muscles" className="bodyMuscles" height="575"></img>
                        {/* <Table columns={columns} dataSource={data} className="muscles"></Table> */}
                        <MuscleTable></MuscleTable>
                    </div>
                    <Form.Item label="Select stimulation current (mA)" name="currentValue" rules={[
                        {
                            required: true,
                            message: 'Please select the stimulation current value (mA).',
                        },
                    ]}>
                        <Slider 
                            min={0} 
                            max={10} 
                            step="0.1"
                            tooltipVisible="true"
                            style={{"margin-top": "50px"}}
                            onChange={handleChangeCurrentValue}
                            marks={marks}
                            disabled={dynamicDisable}
                        />
                    </Form.Item>
                    {/*
                    <Form.Item label="Do you want to compare symmetrical contacts?" name="symmetry" rules={[
                        {
                            required: true,
                            message: 'Please indicate whether you want to compare symmetric contacts or not.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeContactSymmetry} disabled={dynamicDisable}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </Radio.Group>
                    </Form.Item>
                    */}
                    <Form.Item label="Select EMG feature" name="signalProcessingMethod" rules={[
                        {
                            required: true,
                            message: 'Please select the EMG feature.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeSignalProcessingMethod} disabled={dynamicDisable}>
                            <Radio value="peak">Peak to Peak</Radio>
                            <Radio value="rms">Root Mean Square</Radio>
                            <Radio value="max">Maximum Value</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/*
                    <Form.Item label="Do you want to normalize your data?" name="normalization" rules={[
                        {
                            required: true,
                            message: 'Please indicate whether you want to normalize the data or not.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeNormalization}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Which normalization method do you want to use?" name="normalizationMethod" rules={[
                        {
                            required: !disableNormalizationMethod,
                            message: 'Please indicate which normalization method you want to use.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeNormalizationMethod} disabled={disableNormalizationMethod}>
                            <Radio value="standard" style={radioStyle}>Standard (0 to 1)</Radio>
                            <Radio value="baseline" style={radioStyle}>Baseline (using 0 mA as baseline)</Radio>
                            <Radio value="group" style={radioStyle}>Group normalization (when analyzing mulitple cases at once)</Radio>
                        </Radio.Group>
                    </Form.Item>
                    */}
                    <Form.Item label="Select normalization method" name="normalizationMethod" rules={[
                        {
                            required: true,
                            message: 'Please select the normalization method.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeNormalizationMethod} disabled={dynamicDisable}>
                            <Radio value="no" style={radioStyle}>No normalization</Radio>
                            <Radio value="dB" style={radioStyle}>Baseline (dB) normalization</Radio>
                            <Radio value="percentage" style={radioStyle}>Baseline (%) normalization</Radio>
                            <Radio value="min" style={radioStyle}>Min-max normalization</Radio>
                            <Radio value="group" style={radioStyle}>Group normalization</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select colormap option" name="colormap" rules={[
                        {
                            required: true,
                            message: 'Please select the colormap option.',
                        },
                    ]}>
                        <Radio.Group onChange={handleChangeColormapOption} disabled={dynamicDisable}>
                            {/* <Radio value="turbo" style={radioStyle}>Turbo</Radio> */}
                            <Radio value="jet" style={radioStyle}>Jet</Radio>
                            <Radio value="hot" style={radioStyle}>Hot</Radio>
                            {/* <Radio value="bluewhitered" style={radioStyle}>Bluewhitered</Radio> */}
                            <Radio value="gray" style={radioStyle}>Gray</Radio>
                            <Radio value="parula" style={radioStyle}>Parula</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" style={{"margin-right": "30px"}} loading={dynamicLoading} className="buttons">
                            Run
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{"margin-right": "30px"}} disabled={dynamicDisable} className="buttons">
                            Reset (keep same job ID)
                        </Button>
                        <Button htmlType="button" onClick={refreshPage} disabled={dynamicNewDisable} className="buttons">
                            New Job Submission (get new job ID)
                        </Button>
                        <p className="jobStyle">Please save your unique job ID for future reference: <b>{jobID}</b></p>
                    </Form.Item>
                    {/* <img src={heatmap}></img> */}
                    {/*
                    <img src={muscleAbbreviations} alt="Table of Muscle Abbreviations"></img>
                    */}
                </Form>
            </Col>
        </div >
    )
}

export const refreshPageLazy = () => {
    window.location.reload();
}

export default FormInterface;