import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import BranchSelect from "../../../../components/selectbox/Branch";
import Checkbox from "@mui/material/Checkbox";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import ManufacturerSelect from "@/components/selectbox/Manufacturer";
import ShippingType from "@/components/selectbox/ShippingType";
import { useState } from "react";

export interface GeneralFormProps {
    handlerChange: (key: string, value: any) => void;
    edit?: boolean;
    data: any;
}

export default function GeneralForm({
    handlerChange,
    data, edit
}: GeneralFormProps) {
    console.log(data);
    const [isCheckedTaxLiable, setIsCheckedTaxLiable] = useState<boolean>(false);
    const [isCheckedDiscount, setIsCheckedDiscount] = useState<boolean>(false);

    return (
        <>
            <FormCard title="General">
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Manufacturers
                            </label>
                            <div className="">
                                <ManufacturerSelect
                                    name="Manufacturers"
                                    value={data.manufacturer}
                                    onChange={(e) => handlerChange("manufacturer", e.target.value)}
                                />
                            </div>
                        </div>


                        <MUITextField
                            label="   Additional Identifier:"
                            name="sWW"
                            value={data.sWW}
                            onChange={(e) => handlerChange("sWW", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Shipping Type
                            </label>
                            <div className="">
                                <ShippingType
                                    name="shipType"
                                    value={data.shipType}
                                    onChange={(e) => handlerChange("shipType", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Manage Item By
                            </label>
                            <div className="">
                                <MUISelect
                                    items={[
                                        { name: "None", value: "I" },
                                        { name: "Serial Numbers", value: "L" },
                                        { name: "Batches", value: "T" },
                                    ]}
                                    onChange={(e) => handlerChange("manageItemByDrop", e.target.value)}
                                    name="manageItemBy"
                                    value={data.manageItemByDrop}
                                    aliasvalue="id"
                                    aliaslabel="name"
                                />
                                <TextField type="hidden" name="manageSerialNumbers" value={data.manageItemByDrop === "L" ? "tYES" : ""}

                                />
                                <TextField type="hidden" name="manageBatchNumbers" value={data.manageItemByDrop === "T" ? "tYES" : ""}

                                />
                            </div>
                        </div>
                        {data?.manageItemByDrop !== "I" && (
                            <div className="flex flex-col gap-1 text-sm">
                                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                    Manage Item By
                                </label>
                                <div className="">
                                    <MUISelect
                                        items={[
                                            { name: "On Every Transaction", value: "bomm_OnEveryTransaction" },
                                            { name: "On Release Only", value: "bomm_OnReleaseOnly" },

                                        ]}
                                        onChange={(e) => handlerChange("sriAndBatchManageMethod", e.target.value)}
                                        name="manageItemBy"
                                        value={data.sriAndBatchManageMethod}
                                        aliasvalue="id"
                                        aliaslabel="name"
                                    />
                                </div>
                            </div>
                        )}

                        {/* {data?.manageItemByDrop !== "I" && (
                                    <div>
                                        <MUISelect
                                            items={[
                                                { name: "None", value: "I" },
                                                { name: "Serial Numbers", value: "L" },
                                                { name: "Batches", value: "T" },
                                            ]}
                                            onChange={(e) => handlerChange("manageItemByDrop", e.target.value)}
                                            name="manageItemBy"
                                            value={data.manageItemByDrop}
                                            aliasvalue="id"
                                            aliaslabel="name"
                                        />
                                    </div>
                                )} */}
                    </div>

                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Active</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="active"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="active" control={<Radio />} label="Active" />
                            <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                            <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
                        </RadioGroup>
                    </FormControl>

                </div>
                <div className="flex flex-col gap-2">

                    <div className="grid grid-cols- gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1 text-sm">
                                <input type="checkbox" name='wtLiable'
                                    checked={edit ? data?.wtLiable : isCheckedTaxLiable}
                                    onChange={(e) => {
                                        const { checked } = e.target;
                                        const value = checked ? true : false;
                                        setIsCheckedTaxLiable(value);
                                        handlerChange("wtLiable", value);
                                    }} />
                                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                    Withholding Tax Liable
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols- gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1 text-sm">
                                <input type="checkbox" name='noDiscounts'
                                    checked={edit ? data?.noDiscounts : isCheckedDiscount}
                                    onChange={(e) => {
                                        const { checked } = e.target;
                                        const value = checked ? true : false;
                                        setIsCheckedDiscount(value);
                                        handlerChange("noDiscounts", value);
                                    }} />
                                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                    Do Not Apply Discount Groups

                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <label htmlFor="Code" className="text-gray-500 text-[14px]">
                            Remarks
                        </label>
                        <div className="">
                            <TextField
                                size="small"
                                multiline
                                rows={2}
                                fullWidth
                                name="user_Text"
                                className="w-full "
                                value={data?.user_Text}
                                onChange={(e) => handlerChange("user_Text", e.target.value)}
                            /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                        <MUITextField
                            label="Standard Item Identification"
                            name="stdItemIdentification"
                            value={data.stdItemIdentification}
                            onChange={(e) => handlerChange("stdItemIdentification", e.target.value)}
                        />

                        <MUITextField
                            label=" Commodity Classification:"
                            name="commodityClassification"
                            value={data.commodityClassification}
                            onChange={(e) => handlerChange("commodityClassification", e.target.value)}
                        />
                    </div>



                </div>
            </FormCard >
        </>
    );
}
