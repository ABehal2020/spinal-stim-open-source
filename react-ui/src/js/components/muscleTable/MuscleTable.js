import React from 'react';
import { Col, Form, Slider, Input, InputNumber, Button, Checkbox, Radio, Table} from 'antd';

const columns = [
    {
        title: 'Left and Right Muscle Groups',
        dataIndex: 'groups',
        key: 'groups',
    },
];

const data = [
    {
        key: '1',
        groups: 'Upper Abdomen',
    },
    {
        key: '2',
        groups: 'Lower Abdomen',
    },
    {
        key: '3',
        groups: 'Adductor Magnus',
    },
    {
        key: '4',
        groups: 'Quadriceps',
    },
    {
        key: '5',
        groups: 'Tibialis Anterior',
    },
    {
        key: '6',
        groups: 'Adductor Hallucis',
    },
    {
        key: '7',
        groups: 'Gluteus Maximus',
    },
    {
        key: '8',
        groups: 'Biceps Femoris',
    },
    {
        key: '9',
        groups: 'Medial Gastrocnemius',
    },
];

const MuscleTable = () => {
    return (
        <div>
            <Table columns={columns} dataSource={data} className="muscles"></Table> 
        </div>
    )
}

export default MuscleTable;

/*
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

const MuscleTable = () => {
    return (
        <div>
            <Table columns={columns} dataSource={data} className="muscles"></Table> 
        </div>
    )
}

export default MuscleTable;
*/
