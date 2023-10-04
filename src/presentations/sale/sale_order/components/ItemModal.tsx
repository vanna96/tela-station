import React, { useState } from "react";
import Modal from "@/components/modal/Modal";
import MUITextField from "@/components/input/MUITextField";
import VatGroupTextField from "@/components/input/VatGroupTextField";
import { calculateUOM, currencyFormat } from "@/utilies";
import UOMTextField from "@/components/input/UOMTextField";
import { getUOMGroupByCode } from "@/helpers";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import DistributionRuleText from "@/components/selectbox/DistributionRuleTextField";
import WareBinSelect from "@/components/selectbox/WareBinSelect";
import WareBinLocation from "@/components/selectbox/WareBinLocation";
import { useQuery } from "react-query";
import WareBinLocationRepository from "@/services/whBinLocationRepository";
import UOMSelect from "@/components/selectbox/UnitofMeasurment";
import { TextField } from "@mui/material";
import FormattedInputs from "@/components/input/NumberFormatField";

interface ItemModalProps {
  ref?: React.RefObject<ItemModal | undefined>;
  onSave?: (value: any) => void;
  columns: any[];
}

export class ItemModal extends React.Component<ItemModalProps, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: false,
    } as any;

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handChange = this.handChange.bind(this);
  }

  onOpen(data?: any) {
    this.setState({ open: true, ...data });
  }

  onClose() {
    this.setState({ open: false });
  }

  onSave() {
    if (this.props.onSave) {
      const temps: any = { ...this.state };
      delete temps.open;
      this.props.onSave(temps);
    }

    this.setState({ open: false });
  }

  handChange(event: any, field: string) {
    const temps = { ...this.state };
    temps[field] = event.target.value;

    if (field === "GrossPrice") {
      const value = event.target.value;
      temps["GrossPrice"] = value;
      const vatRate = temps["VatRate"] ?? 0.1; // Default to 10% if vatRate is not defined
      const unitPrice = parseFloat(value) / (1 + vatRate / 100);
      temps["GrossPrice"] = value;
      // console.log(value);
      temps["UnitPrice"] = unitPrice;
    }
    if (
      field.includes("Quantity") ||
      field.includes("UnitPrice") ||
      field.includes("GrossPrice") ||
      field.includes("DiscountPercent")
    ) {
      let total =
        parseFloat(temps["Quantity"] ?? 1) *
        (parseFloat(temps["UnitPrice"]) ?? 1);
      total = total - (total * parseFloat(temps["DiscountPercent"] ?? 0)) / 100;

      temps["LineTotal"] = total;

      let totalGross =
        parseInt(temps["Quantity"] ?? 1) *
        (parseFloat(temps["GrossPrice"]) ?? 1);
      totalGross =
        totalGross -
        (totalGross * parseFloat(temps["DiscountPercent"] ?? 0)) / 100;

      temps["TotalGross"] = totalGross;
    }

    if (field === "VatGroup") {
      temps["VatGroup"] = event.target.value.code;
      temps["VatRate"] = event.target.value.vatRate ?? 10;
    }
    if (field === "Quantity" || "UomAbsEntry") {
      const qty = temps["Quantity"];
      const Entry = temps["UomAbsEntry"];
      const CurrentUOM =
        this.state.UnitsOfMeasurements?.UoMGroupDefinitionCollection?.find(
          (e: any) => e.AlternateUoM === Entry
        );
      const baseQty = CurrentUOM?.BaseQuantity;
      const alternativeQty = CurrentUOM?.AlternateQuantity;
      const result = calculateUOM(baseQty, alternativeQty, qty);
      temps["UnitsOfMeasurement"] = result;
    }
    if (field === "Quantity" || "UomAbsEntry") {
      const qty = temps["Quantity"];
      const Entry = temps["UomAbsEntry"];
      const CurrentUOM =
        this.state.UnitsOfMeasurements?.UoMGroupDefinitionCollection?.find(
          (e: any) => e.AlternateUoM === Entry
        );
      const baseQty = CurrentUOM?.BaseQuantity;
      const alternativeQty = CurrentUOM?.AlternateQuantity;
      const result = calculateUOM(baseQty, alternativeQty, qty);
      temps["UnitsOfMeasurement"] = result;
    }

    this.setState({ ...temps });
  }

  render() {
    return (
      <Modal
        title={`Item - ${this.state?.ItemCode ?? ""}`}
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
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <MUITextField label="Item Code" value={this.state?.ItemCode} />
              <MUITextField label="Description" value={this.state?.ItemName} />
            </div>
            <div className=" border-b pb-2 mt-3 uppercase font-medium text-gray-600">
              Item Pricing
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <FormattedInputs
                label="Gross Price"
                onBlur={(event: any) => this.handChange(event, "GrossPrice")}
                name={"Gross Price"}
                value={this.state?.GrossPrice}
              />
              <MUITextField
                label="Quantity"
                defaultValue={this.state?.Quantity}
                onChange={(event) => this.handChange(event, "Quantity")}
              />
              <MUITextField
                label="Discount"
                startAdornment={"%"}
                value={this.state?.DiscountPercent}
                onChange={(event) => this.handChange(event, "DiscountPercent")}
              />
              <VatGroupTextField
                label="Tax Code"
                status={"tNO"}
                value={this.state?.VatGroup}
                onChange={(event) => this.handChange(event, "VatGroup")}
                type={"OutputTax"}
              />
              {/* <MUITextField
                label="Unit Price"
                disabled
                startAdornment={"USD"}
                value={currencyFormat(this.state?.UnitPrice)}
              /> */}
              <input hidden value={this.state?.UnitPrice} />
              <MUITextField
                label="Total"
                startAdornment={"USD"}
                value={currencyFormat(this.state?.TotalGross)}
              />
            </div>

            <div className="col-span-4 border-b pb-2 mt-3 uppercase font-medium text-gray-600">
              Additional Input
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <MUITextField
                label="UOM Code"
                disabled
                value={this.state?.UomGroupCode}
              />
              <UOMSelect
                label="UOM Code"
                value={this.state?.UomAbsEntry}
                filterAbsEntry={this.state.SaleUOMLists}
                onChange={(event) => this.handChange(event, "UomAbsEntry")}
              />
              <WarehouseSelect
                label="Warehouse Code"
                value={this.state?.WarehouseCode}
                onChange={(event) => this.handChange(event, "WarehouseCode")}
              />
              <WareBinLocation
                itemCode={this.state.ItemCode}
                Whse={this.state.WarehouseCode}
                value={this.state.BinAbsEntry}
                label="Bin Location"
                onChange={(event) => this.handChange(event, "BinAbsEntry")}
              />

              <DistributionRuleText
                label="Line Of Business"
                inWhichNum={1}
                aliasvalue="FactorCode"
                value={this.state.LineOfBussiness}
                onChange={(event) => this.handChange(event, "LineOfBussiness")}
              />

              <DistributionRuleText
                label="Revenue Line"
                inWhichNum={2}
                aliasvalue="FactorCode"
                value={this.state?.revenueLine ?? "202001"}
                onChange={(event) => this.handChange(event, "revenueLine")}
              />
              <DistributionRuleText
                label="Product Line"
                inWhichNum={3}
                aliasvalue="FactorCode"
                value={this.state?.REV}
                onChange={(event) => this.handChange(event, "REV")}
              />
            </div>
          </div>
        </>
      </Modal>
    );
  }
}
