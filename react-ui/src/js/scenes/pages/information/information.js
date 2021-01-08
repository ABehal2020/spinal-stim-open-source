import React from 'react';
import { Col } from 'antd';
import behal from '../../../images/behal.jpg';
import telkes from '../../../images/telkes.jpg';
import pilitsis from '../../../images/pilitsis.jpg';
import './information.scss';

const Overview = () => {
    return (
        <div>
            <Col span={6} className="col-md-3"></Col>
            <Col span={12} className="col-md-6">
                <div className="formatting">
                    <h2>Application Information</h2>

                    <h3>Purpose</h3>
                    <p>
                        This graphical user interface enables people to visualize spinal column stimulation EMG data with body heatmaps according to parameters chosen by the user. Check out the examples tab for more information on how to use this application.
                    </p>

                    <h3>How Body Heatmaps Are Rendered</h3>
                    <p>
                        The user fills out a form indicating various constraints to be enforced on the spinal column stimulation EMG dataset.
                        The Javascript library Axios handles REST APIs for the front end and posts the link to the back end.
                        The Python library Django handles REST APIs for the back end and gets the link.
                        Matlab scripts are called to calculate and generate body heatmaps under the user's submitted parameters.
                        The parameters and the generated heatmaps in base64 format are stored in the postgres database.
                        Django posts the base64 SVG data to the front end to be rendered.
                        Axios receives the image data, and the JavaScript library React renders the image.
                    </p>

                    <h3>Pilitsis Lab Development Team</h3>

                    <div className="author-container">
                        <h4>Aditya Behal</h4>
                        <img src={behal} height="140" className="behal"></img>
                        <p>Aditya is a freshman at Rensselaer Polytechnic Institute, planning to major in biology and minor in computer science.
                        He is part of the BS/MD Physician Scientist Program and will matriculate to Albany Medical College after finishing his accelerated three year undergraduate education.
                        As part of the Pilitis Lab, he programmed the front end (HTML/CSS/JavaScript) and back end (Python/Postgres) of this application along with assisting Dr. Telkes in the generation of the heatmaps in MATLAB.
                        </p>
                    </div>

                    <div className="author-container">
                        <h4>Ilknur Telkes, Ph.D.</h4>
                        <img src={telkes} height="140" className="telkes"></img>
                        <p>
                            Dr. Telkes is a postdoctoral fellow at the Pilitsis Lab.
                            She was involved in the data collection and processing of the spinal column stimulation EMG data. She also worked on the MATLAB scripts to generate the body heatmaps.
                        </p>
                    </div>

                    <div className="author-container">
                        <h4>Julie G. Pilitis, M.D., Ph.D.</h4>
                        <img src={pilitsis} className="pilitsis"></img>
                        <p>
                            Neurosurgeon Dr. Pilitis is the chair of the Department of Neuroscience and Experimental Therapeutics at Albany Medical College.
                            She is also the principal investigator of the Pilitsis Lab.
                        </p>
                    </div>
                </div>
            </Col>
            <Col span={6} className="col-md-3"></Col>
        </div>
    )
}

export default Overview;