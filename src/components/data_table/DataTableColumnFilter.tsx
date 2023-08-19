import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MUITextField from '../input/MUITextField';
import MUISelect from '../selectbox/MUISelect';
import FilterMode from './FilterMode';
import { IconButton } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import shortid from 'shortid';
import MUIDatePicker from '../input/MUIDatePicker';

interface DataTableColumnFilterProps {
    title: JSX.Element,
    onClick: (value: any) => void;
    items: any[],
    handlerClearFilter: () => void
}

export default function DataTableColumnFilter(props: DataTableColumnFilterProps) {
    const [filterList, setFilterList] = React.useState<any[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlerClear = () => {
        setAnchorEl(null);
        setFilterList([]);
        props.handlerClearFilter();
    }

    const handlerConfirm = () => {
        setAnchorEl(null);
        let query = '';
        filterList.forEach((row) => {
            if (row.filter.includes('with') || row.filter.includes('contains')) {
                query += `${row.filter.replace('value', `${row.column.charAt(0).toUpperCase()}${row.column.slice(1)}, '${row.value}'`)} and `;
            } else {
                query += `${row.column.charAt(0).toUpperCase()}${row.column.slice(1)} ${row.filter} ${row.type === 'string' || row.type === 'date' ? "'" + row.value + "'" : row.value} and `;
            }
        });

        query = query.slice(0, query.length - 4);
        props.onClick(query);
    }

    const handlerAdd = (e: any) => {
        const exist = filterList.find((record) => record.column === e.target.value);
        if (exist) return;
        //
        const record = props.items.find((row: any) => row?.accessorKey === e.target.value);
        setFilterList([...filterList, { column: e.target.value, filter: 'eq', value: null, type: record?.type, }]);
    }

    const handlerChange = (record: any, field: string, event: any) => {
        let filters = [...filterList];
        const index = filters.findIndex((row: any) => row?.column === record?.column);
        if (index < 0) return;

        if (field === 'column') {
            const row = props.items.find((r) => r.accessorKey === event.target?.value);
            filters[index]['type'] = row.type;
        }

        filters[index][field] = event?.target?.value ?? event;
        setFilterList(filters);
    }

    const handerRemove = (e: any) => {
        const newFilterList = filterList.filter((row: any) => row?.column !== e);
        setFilterList(newFilterList);
    }


    return (
        <div>
            <Button
                id="basic-button" className='asdas'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.title}
            </Button>
            <div className='drop-down-menu'>
                <Menu
                    className=''
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <div className='w-[35rem] p-4'>
                        <div className='flex gap-2'>
                            <label className='w-4/12'>Column</label>
                            <label className='w-3/12'>Type</label>
                            <label className='w-5/12'>Value</label>
                        </div>
                        {filterList.map((e: any) => (
                            <div key={shortid.generate()} className='flex gap-2'>
                                <div className='w-4/12'>
                                    <MUISelect
                                        items={props.items}
                                        value={e?.column}
                                        aliaslabel='header'
                                        aliasvalue='accessorKey'
                                        className='mt-1'
                                        onChange={(event) => handlerChange(e, 'column', event)}
                                    />
                                </div>
                                <div className='w-3/12'>
                                    <FilterMode
                                        value={e?.filter}
                                        type={e?.type}
                                        onChange={(event) => handlerChange(e, 'filter', event)}
                                    />
                                </div>
                                <div className='w-5/12 flex gap-2'>
                                    {/* {e?.type === 'date' ? <div className='mt-1'><MUIDatePicker value={e?.value ?? null} onChange={(event) => handlerChange(e, 'value', event)} /></div> : <MUITextField
                                        defaultValue={e?.value}
                                        onBlur={(event) => handlerChange(e, 'value', event)}
                                        type={e?.type}
                                    />} */}

                                    <FilterValue column={e?.column} type={e?.type} value={e?.value} onChange={(event: any) => handlerChange(e, 'value', event)} />

                                    <IconButton
                                        onClick={() => handerRemove(e?.column)}
                                    >
                                        <span><AiFillDelete className='text-lg text-red-500' size={''} /></span>
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                        <div className='flex gap-2'>
                            <div className='w-4/12 '><MUISelect items={props.items} onChange={handlerAdd} aliaslabel='header' aliasvalue='accessorKey' className='mt-1' /></div>
                            <div className='w-3/12'><FilterMode value={''} type='string' onChange={(e) => { }} /></div>
                            <div className='w-5/12 flex gap-2'>
                                <MUITextField />
                                <div className='w-[2.7rem]'></div>
                            </div>
                        </div>
                        <hr className='mt-6' />
                        <div className='my-3'></div>
                        <div className='flex justify-end px-3 gap-3'>
                            <div role='button' onClick={handlerClear} className='px-3 rounded py-1 text-[13px] border hover:bg-gray-100'>Clear Filters</div>
                            <div role='button' onClick={handlerConfirm} className='px-3 rounded py-1 bg-blue-400 text-white text-[13px]'>Apply</div>
                        </div>
                    </div>
                </Menu>
            </div>
        </div>
    );
}



const FilterValue = (props: any) => {
    if (props.column === 'DocumentStatus')
        return <MUISelect
            items={[{ value: 'bost_Close', label: 'Close' }, { value: 'bost_Open', label: 'Open' }]}
            value={props?.value}
            aliaslabel='label'
            aliasvalue='value'
            className='mt-1'
            onChange={props.onChange}
        />

    if (props.column === 'DocType')
        return <MUISelect
            items={[{ value: 'dDocument_Items', label: 'Item' }, { value: 'dDocument_Service', label: 'Service' }]}
            value={props?.value}
            aliaslabel='label'
            aliasvalue='value'
            className='mt-1'
            onChange={props.onChange}
        />

    if (props?.type === 'date')
        return <div className='mt-1'><MUIDatePicker value={props?.value ?? null} onChange={props.onChange} /></div>;


    return <MUITextField
        defaultValue={props?.value}
        onBlur={props.onChange}
        type={props?.type}
    />;
}
