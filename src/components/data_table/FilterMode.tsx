import React from 'react'
import MUISelect from '../selectbox/MUISelect'

interface FilterModeProps {
    type: 'number' | 'date' | 'string',
    value: any,
    onChange: (value: any) => void
}



function FilterMode(props: FilterModeProps) {

    return (
        <MUISelect
            items={getFilterCondition(props.type)}
            onChange={props.onChange}
            value={props.value}
            aliaslabel='label'
            aliasvalue='value'
            className='mt-1' />
    );
}


export default React.memo(FilterMode);


const getFilterCondition = (type: any) => {
    let typeString = [
        { label: 'Contains', value: 'contains(value)', type: 'number|string' },
        { label: 'Start With', value: 'startswith(value)', type: 'string|number' },
        { label: 'End With', value: 'endswith(value)', type: 'string|number' },
        { label: 'Equal', value: 'eq', type: 'string|number|date' },
        { label: 'Not Equal', value: 'ne', type: 'number|string|date' },
        { label: 'Less Than', value: 'lt', type: 'number|date' },
        { label: 'Less Than or Equal To', value: 'le', type: 'number|date' },
        { label: 'Greater Than', value: 'gt', type: 'number|date' },
        { label: 'Greater Than or Equal To', value: 'ge', type: 'number|date' },
    ];
    return typeString.filter((e) => e.type.includes(type));
}