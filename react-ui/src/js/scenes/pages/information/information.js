import React from 'react';
import { Col } from 'antd';
import behal from '../../../images/behal.jpg';
import telkes from '../../../images/telkes.jpg';
import hadanny from '../../../images/hadanny.jpg';
import pilitsis from '../../../images/pilitsis.jpg';
import './information.scss';

const Overview = () => {
    return (
        <div>
            <Col span={6} className="col-md-3"></Col>
            <Col span={12} className="col-md-6">
                <div className="formatting">
                    <h2>Application Information</h2>

                    <h3>Background</h3>
                    <p>
                    Over 40 million American adults (20.4%) suffer from chronic pain that is often high-impact and debilitating [1]. Spinal cord stimulation (SCS) is an advanced, invasive pain therapy that is widely used for chronic pain syndromes such as medically refractory back and extremity pain [2]. The principle of SCS is to deliver electrical pulses through an implantable pulse generator (IPG) to a targeted spinal cord region. Clinically, SCS effectiveness or desired pain coverage depends on optimal electrode placement at the appropriate spine level (3).  
                    </p>
                    <p>
                    Intraoperative neurophysiological monitoring (IONM) under general anesthesia provides objective real-time mapping of dorsal column (DC) [4]. Monitoring of evoked electromyography (EMG) signals during SCS electrode placement has shown high rates of appropriate placement and equivocal or superior clinical outcomes in comparative studies [4-7]. IONM is performed by stimulating multiple contacts of the surgical lead using various current levels and assessment of the corresponding responses in muscles by a multidisciplinary team. IONM therefore requires dynamic communication between teams aided by visual assessment and continuous real-time annotations of the responses. An automated feature extraction and mapping approach is expected to aid in success of IONM leading to improved clinical outcomes.
                    </p>
                    <div className="references">
                        <p>
                        [1]	C.E. Zelaya, J. M. Dahlhamer, J.W. Lucas, and E.M. Connor, “Chronic pain and high-impact chronic pain among U.S. adults, 2019,” NCHS Data Brief, no 390, Hyattsville, MD: National Center for Health Statistics, 2020. 
                        </p>
                        <p>
                        [2]	K. Kumar, R.S. Taylor, L. Jacques, et al., “The effects of spinal cord stimulation in neuropathic pain are sustained: a 24-month follow-up of the prospective randomized controlled multicenter trial of the effectiveness of spinal cord stimulation,” Neurosurgery, 63(4), pp.762-770, 2008.
                        </p>
                        <p>
                        [3]	J. L. Shils and J. E. Arle, “Neuromonitoring for spinal cord stimulation lead placement under general anesthesia,” J. Clin. Neurol., vol.14, pp. 444-453, Oct. 2018.
                        </p>
                        <p>
                        [4]	S. G. Roth, S. Lange, J. Haller, et al., “A prospective study of the intra- and postoperative efficacy of intraoperative neuromonitoring in spinal cord stimulation,” Stereotact. Funct. Neurosurg., vol. 93, pp. 384-354, Oct. 2015.
                        </p>
                        <p>
                        [5]	E.L. Air, G.R. Toczyl, G.T. Mandybur, “Electrophysiologic monitoring for placement of laminectomy leads for spinal cord stimulation under general anesthesia.” Neuromodulation, 15:573–579, 2012.
                        </p>
                        <p>
                        [6]	S.M. Falowski, A. Celii, A.K. Sestokas, et al., “Awake vs. asleep placement of spinal cord stimulators: a cohort analysis of complications associated with placement.” Neuromodulation, 14:130–134, 2011.
                        </p>
                        <p>
                        [7]	R. Hwang., N. Field., V. Kumar, et al., “Intraoperative Neuromoni-toring in Percutaneous Spinal Cord Stimulator Placement.” Neuromodulation 2019; 22: 341–346, 2019.
                        </p>
                    </div>
                    <h3>Implementation</h3>
                    <p>
                    DCMap is initiated in MATLAB version 2019b (Mathworks, Natick, MA, USA) as a signal analysis and visualization tool. After all patient data are de-identified, data in ASCII, which is the original data format of the IONM system, are converted to .mat files and a common data structure, including EMGs, currents, patient/case number, and sampling rate, is automatically generated using custom MATLAB scripts. The functions for denoising, feature extraction, normalization, and heatmap generation are initially developed in MATLAB, then converted to Python with the purpose of providing a freely distributable, open-source platform.
                    </p>
                    <p>
                    The user fills out a form indicating various constraints to be enforced on the spinal column stimulation EMG dataset. The Javascript library Axios handles REST APIs for the front end and posts the link to the back end. The Python library Django handles REST APIs for the back end and gets the link. Python scripts are called to compute features and generate heatmaps under the user's submitted parameters. The parameters and the generated heatmaps in base64 format are stored in the Postgres database. Django posts the base64 SVG data to the front end to be rendered. Axios receives the image data, and the JavaScript library React renders the image.
                    </p>

                    <h3>Pilitsis Lab DCMap Development Team</h3>

                    <div className="author-container">
                        <h4>Aditya Behal</h4>
                        <img src={behal} height="140" className="behal"></img>
                        <p>Aditya is a freshman at Rensselaer Polytechnic Institute, planning to major in biology and minor in computer science. He is part of the BS/MD Physician Scientist Program and will matriculate to Albany Medical College after finishing his accelerated three-year undergraduate education. As part of the Pilitsis Lab, he programmed the front end (HTML/CSS/JavaScript) and back end (Python/Postgres) of this application.</p>
                    </div>

                    <div className="author-container">
                        <h4>Ilknur Telkes, Ph.D., M.Sc.</h4>
                        <img src={telkes} height="140" className="telkes"></img>
                        <p>Dr. Telkes is a postdoctoral fellow at Pilitsis Lab, Department of Neuroscience & Experimental Therapeutics, Albany Medical College. She designed the GUI study, collected the intraoperative motor and sensory signals, extracted the data from IONM platform to MATLAB, and developed the MATLAB and Python scripts.</p>
                    </div>

                    <div className="author-container">
                        <h4>Amir Hadanny, MD</h4>
                        <img src={hadanny} height="140" className="hadanny"></img>
                        <p>Dr. Hadanny is fellow neurosurgeon at Neurosurgery Department, Albany Medical College, and working with Dr. Pilitsis. He performed the surgical procedure under Dr. Pilitsis’s supervision, helped intraoperative data collection, and wrote the Python scripts. </p>
                    </div>

                    <div className="author-container">
                        <h4>Julie G. Pilitsis, M.D., Ph.D.</h4>
                        <img src={pilitsis} className="pilitsis"></img>
                        <p>Dr. Pilitsis is the chair of the Department of Neuroscience & Experimental Therapeutics and Professor of Neurosurgery and Neuroscience & Experimental Therapeutics, Albany Medical College. She is the principal investigator of the study and helped with intraoperative data collection, conceptualization, and methodology.</p>
                    </div>
                </div>
            </Col>
            <Col span={6} className="col-md-3"></Col>
        </div>
    )
}

export default Overview;