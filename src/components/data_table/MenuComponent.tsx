import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import shortid from 'shortid';


interface MenuComponentProps {
    title: JSX.Element,
    onClick?: (value: any) => void;
    items?: any[]
}

export default function MenuComponent(props: MenuComponentProps) {
    const [active, setActive] = React.useState<any>(null);
    const [type, setType] = React.useState('asc');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = (index: number, value: any) => {
        setActive(index);
        setAnchorEl(null);

        if (props.onClick && value !== undefined && value !== null && value !== 'backdropClick' && value !== 'escapeKeyDown') {
            const temp = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
            props.onClick(`${temp} ${type}`);
        }
    };

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
                    <div role='button' onClick={() => setType('asc')} className='capitalize px-5 items-center py-[6px] flex gap-2 hover:text-white hover:bg-blue-400'>{type === 'asc' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />} ascending </div>
                    <div role='button' onClick={() => setType('desc')} className='capitalize px-5 items-center py-[6px] flex gap-2 hover:text-white hover:bg-blue-400'>{type === 'desc' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}  descending </div>
                    <hr />
                    {props.items ? props.items.filter((e) => e.header?.toLowerCase() !== 'action').map((e, index) => <MenuItem key={shortid.generate()} onClick={() => handleClose(index, e?.accessorKey)}><span className={`text-lg mr-2 `}>{active === index ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}</span>  {e?.header}</MenuItem>) : []}
                </Menu>
            </div>
        </div>
    );
}
