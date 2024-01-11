import React from "react"
import Modal from "@/components/modal/Modal"
import MUITextField from "@/components/input/MUITextField"
import { currencyFormat } from "@/utilies"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import ShippingType from "@/components/selectbox/ShippingType"

interface ServiceModalProps {
  ref?: React.RefObject<ServiceModal | undefined>
  onSave?: (value: any) => void
}

export class ServiceModal extends React.Component<ServiceModalProps, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      open: false,
    } as any

    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onSave = this.onSave.bind(this)
    this.handChange = this.handChange.bind(this)
  }

  onOpen(data?: any) {
    this.setState({ open: true, ...data })
  }

  onClose() {
    this.setState({ open: false })
  }

  onSave() {
    if (this.props.onSave) {
      const temps: any = { ...this.state }
      delete temps.open
      this.props.onSave(temps)
    }

    this.setState({ open: false })
  }

  handChange(event: any, field: string) {
    const temps = { ...this.state }
    temps[field] = event.target.value

    this.setState({ ...temps })
  }

  render() {
    return (
      <Modal
        title={"Update Service"}
        titleClass="pt-3 px-4 font-bold w-full"
        open={this.state.open}
        widthClass="w-[70vw] sm:w-[90vw]"
        heightClass="h-[90vh]"
        onClose={this.onClose}
        onOk={this.onSave}
        okLabel="Save"
      >
        <>
          <div
            className="flex flex-col gap-3 px-4 py-6 text-xs"
            key={this.state.key}
          >
            <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <MUITextField
                label="Planned Amount (LC)"
                startAdornment={"USD"}
                defaultValue={currencyFormat(this.state?.UnitPrice)}
                onChange={(event) => this.handChange(event, "UnitPrice")}
              />
              <MUITextField
                label="Line Discount"
                defaultValue={this.state?.Discount}
                onChange={(event) => this.handChange(event, "Discount")}
              />
              <MUITextField
                label="Open Amount (LC)"
                startAdornment={"USD"}
                disabled
                value={this.state?.UnitPrice}
              />
              <MUITextField
                label="Cumulative Ordered Amount (LC)"
                startAdornment={"USD"}
                defaultValue={0.0}
                disabled
              />
              <MUITextField
                label="Cumulative Amount (LC"
                startAdornment={"USD"}
                defaultValue={0.0}
                disabled
              />
            </div>

            <div className="col-span-4 border-b pb-2 mt-3 uppercase font-medium text-gray-600">
              Additional Input
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <ShippingType label="Shipping Type" />
              <MUITextField
                label="Project"
                value={this.state?.Project}
                endAdornment
              />
              <MUITextField
                label="Free Text"
                endAdornment
                defaultValue={this.state?.PortionOfReturns}
                onBlur={(event) => this.handChange(event, "FreeText")}
              />
              <MUITextField
                label="Portion of Return"
                defaultValue={this.state?.PortionOfReturns}
                startAdornment={"%"}
                onBlur={(event) => this.handChange(event, "PortionOfReturns")}
              />
              <MUIDatePicker
                label="End of Warranty"
                value={this.state?.EndOfWarranty ?? null}
                onChange={(event) => this.handChange(event, "EndOfWarranty")}
              />
            </div>
          </div>
        </>
      </Modal>
    )
  }
}
