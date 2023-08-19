import React from "react";


export default class SupplierForm extends React.Component<any, any>{
    constructor(props: any) {
        super(props)

        this.state = {

        }
    }


    componentDidMount(): void {

    }


    render() {
        return <div>{this.props.type === 'C' ? 'Customer' : 'Suppier'}</div>
    }
}