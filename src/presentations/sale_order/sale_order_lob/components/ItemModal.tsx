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
import { NumericFormat } from "react-number-format";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";

interface ItemModalProps {
  ref?: React.RefObject<ItemModal | undefined>;
  onSave?: (value: any) => void;
  columns: any[];
  wh: any;
  lineofbusiness: any;
  priceList: any;
  bin: any;
}

export class ItemModal extends React.Component<ItemModalProps, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: false,
      priceList: props.priceList,
      lineofbusiness: props.lineofbusiness,
      wh: props.wh,
      WarehouseCode: props.wh,
      BinAbsEntry: this.props.bin,
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
  handlerChange(event: any, field: string) {
    const temps = { ...this.state };
    temps[field] = event;
    this.setState({ ...temps });
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
        parseInt(temps["Quantity"] ?? 1) * (temps["GrossPrice"] ?? 1);
      totalGross =
        totalGross -
        (totalGross * parseFloat(temps["DiscountPercent"] ?? 0)) / 100;

      temps["LineTotal"] = totalGross;
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
        // heightClass="h-[90vh]"
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
              <MUITextField
                label="Item Code"
                value={this.state?.ItemCode}
                disabled
              />
              <MUITextField
                label="Description"
                value={this.state?.ItemName}
                disabled
              />
            </div>
            <div className=" border-b pb-2 mt-3 uppercase font-medium text-gray-600">
              Item Pricing
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <NumericFormat
                disabled
                onChange={(event) => {
                  const newValue = parseFloat(
                    event.target.value.replace(/,/g, "")
                  );
                  this.handChange(
                    { target: { value: newValue } },
                    "GrossPrice"
                  );
                }}
                label="Unit Price"
                value={this.state?.GrossPrice}
                startAdornment={this.state.Currency}
                type="text"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                customInput={MUITextField}
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

              {/* <input hidden value={this.state?.UnitPrice} /> */}
              <NumericFormat
                label="Total"
                placeholder="0.00"
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                customInput={MUITextField}
                startAdornment={this.state.Currency}
                value={this.state?.LineTotal}
              />
            </div>

            <div className="col-span-4 border-b pb-2 mt-3 uppercase font-medium text-gray-600">
              Additional Input
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
              <MUITextField
                label="UOM Code"
                disabled
                value={
                  new UnitOfMeasurementRepository().find(
                    this.state?.UomAbsEntry
                  )?.Code
                }
              />
              <MUISelect
                label="UOM Name"
                value={this.state?.UomAbsEntry}
                items={this.state.UomLists?.map((e: any) => ({
                  label: e.Name,
                  value: e.AbsEntry,
                }))}
                onChange={(event) => {
                  this.handChange(event, "UomAbsEntry");

                  const selectedUomAbsEntry = event.target.value;
                  const priceList = this.props.priceList;
                  let itemPrices = this.state.ItemPrices?.find(
                    (e: any) => e.PriceList === parseInt(priceList)
                  )?.UoMPrices;

                  let uomPrice = itemPrices?.find(
                    (e: any) => e.PriceList === parseInt(priceList)
                  );

                  if (uomPrice && selectedUomAbsEntry === uomPrice.UoMEntry) {
                    const grossPrice = uomPrice.Price;
                    const quantity = this.state.Quantity ?? 1;
                    const totalGross =
                      grossPrice * quantity -
                      grossPrice *
                        quantity *
                        (this.state.DiscountPercent / 100);

                    this.setState({
                      GrossPrice: grossPrice,
                      LineTotal: totalGross,
                    });
                  } else {
                    const grossPrice = this.state.UnitPrice ?? 0;
                    const quantity = this.state.Quantity ?? 1;
                    const totalGross =
                      grossPrice * quantity -
                      grossPrice *
                        quantity *
                        (this.state.DiscountPercent / 100);

                    this.setState({
                      GrossPrice: grossPrice,
                      LineTotal: totalGross,
                    });
                  }
                }}
              />

              <div className="flex flex-col">
                <div className="text-sm">Warehouse</div>
                <div className="mb-1"></div>
                <WarehouseAutoComplete
                  disabled
                  Branch={this.state?.BPL_IDAssignedToInvoice ?? 1}
                  value={this.state.WarehouseCode}
                  onChange={(event) =>
                    this.handlerChange(event, "WarehouseCode")
                  }
                />
              </div>
              <div className="flex flex-col">
                <div className="text-sm">Bin Location</div>
                <div className="mb-1"></div>
                <BinLocationToAsEntry
                  value={this.props.bin}
                  disabled
                  Warehouse={this.state?.WarehouseCode ?? "WH01"}
                />
              </div>

              <DistributionRuleText
                label="Line Of Business"
                disabled
                inWhichNum={1}
                aliasvalue="FactorCode"
                value={this.state.COGSCostingCode}
                onChange={(event) => this.handChange(event, "COGSCostingCode")}
              />

              <DistributionRuleText
                label="Revenue Line"
                inWhichNum={2}
                aliasvalue="FactorCode"
                value={this.state?.COGSCostingCode2}
                onChange={(event) => this.handChange(event, "COGSCostingCode2")}
              />
              <DistributionRuleText
                label="Product Line"
                inWhichNum={3}
                aliasvalue="FactorCode"
                value={this.state?.COGSCostingCode3}
                onChange={(event) => this.handChange(event, "COGSCostingCode3")}
              />
            </div>
          </div>
        </>
      </Modal>
    );
  }
}
