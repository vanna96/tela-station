import React, { RefObject } from "react";
import { Checkbox } from "@mui/material";
import Modal from "../modal/Modal";
import shortid from "shortid";



export interface ColumnVisibliltyProps {
    onOk: (columns: any) => void,
    ref?: RefObject<ColumnVisiblilty>,
}


export default class ColumnVisiblilty extends React.Component<ColumnVisibliltyProps> {

    state = {
        open: false,
        columns: [
            {
                visible: true,
                accessorKey: 'docNum',
                lable: 'Doc Num'
            },
            {
                visible: true,
                accessorKey: 'cardCode',
                lable: 'Vendor Code'
            },
            {
                visible: true,
                accessorKey: 'cardName',
                lable: 'Vendor Name'
            }, {
                visible: false,
                accessorKey: 'currency',
                lable: 'Currency'
            },
            {
                visible: true,
                accessorKey: 'startDate',
                lable: 'Start Date'
            },
            {
                visible: true,
                accessorKey: 'endDate',
                lable: 'End Date'
            },
            {
                visible: false,
                accessorKey: 'signingDate',
                lable: 'Signing Date'
            },
            {
                visible: false,
                accessorKey: 'terminationDate',
                lable: 'Termination Date'
            },

        ],
    }

    handlerChange(event: any, field: any) {
        let data = [...this.state.columns];
        const index = data.findIndex((e) => e.accessorKey === field);

        if (index < 0) return;
        data[index]['visible'] = event.target.checked;
        this.setState({ ...this.state, columns: data });
    }


    handlerOpen() {
        this.setState({ ...this.state, open: true });
    }

    handlerClose() {
        this.setState({ ...this.state, open: false });
    }

    handlerOk() {
        let dataColums: any = {};
        this.state.columns.forEach((e: any) => dataColums[e.accessorKey] = e.visible);
        this.props.onOk(dataColums);
        this.setState({ ...this.state, open: false });
    }


    render() {
        return <>
            <Modal title="Column Setting" titleClass="font-bold text-md" widthClass="w-[40rem]" heightClass="h-[80vh]" open={this.state.open} onClose={() => this.handlerClose()} onOk={() => this.handlerOk()}>
                <div className="w-full">
                    <hr />
                    <div className="w-full grid grid-cols-2 gap-2">
                        {this.state.columns.map((e) =>
                            <div
                                key={shortid.generate()}
                                className="flex gap-1 items-center">
                                <Checkbox
                                    size="small"
                                    checked={e.visible}
                                    onChange={(event) => this.handlerChange(event, e.accessorKey)} />
                                <span className="text-[14px]">{e.lable}</span>
                            </div>)}
                    </div>
                </div>
            </Modal>
        </>
    }
}

