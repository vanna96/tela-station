import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import shortid from 'shortid';
import MUITextField from '../input/MUITextField';
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

interface DataTableColumnVisibilityProps {
    title: JSX.Element,
    onClick: (value: any) => void;
    items: any[]
}

export default function DataTableColumnVisibility(props: DataTableColumnVisibilityProps) {
    const [columns, setColumns] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = (index: number, value: any) => {
        if (value === 'backdropClick') {
            setAnchorEl(null);
            return;
        }

        let cols: any = { ...columns };
        cols[value] = !cols[value];
        setColumns(cols);
    };

    const handlerConfirm = () => {
        setAnchorEl(null);
        props.onClick(columns);
    }


    React.useEffect(() => {
        const cols: any = {};
        props.items.forEach((e) => {
            cols[e.accessorKey] = e?.visible ?? false;
        });

        setColumns(cols);
    }, [])

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
                    <div className='px-0 py-2 mx-4 '>
                        <MUITextField placeholder='Search columns...' />
                    </div>
                    <hr />
                    {props.items ? props.items.filter((e) => e.header?.toLowerCase() !== 'action')
                        .map((e, index) => <MenuItem
                            key={shortid.generate()}
                            onClick={() => handleClose(index, e?.accessorKey)}
                        ><span className={`text-md mr-2 text-gray-700`}>{columns[e?.accessorKey] ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}</span>  {e?.header}</MenuItem>) : []}

                    <hr />
                    <div className='flex justify-end px-3'>
                        <div role='button' onClick={handlerConfirm} className='px-2 rounded bg-blue-400 text-white py-1 text-[13px]'>Confirm</div>
                    </div>
                </Menu>
            </div>
        </div>
    );
}
