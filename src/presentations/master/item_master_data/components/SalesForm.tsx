import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VatGroup from "@/components/selectbox/VatGroup";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface SalesFormProps {
    handlerChange: (key: string, value: any) => void;
    data: any;
    edit?: boolean;

}

export default function SalesForm({
    data, edit,
    handlerChange,
}: SalesFormProps) {
    return (
        <>
            <FormCard title="Sales">
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[13px]">
                                Sales Tax Group
                            </label>
                            <div className="mt-1">
                                <VatGroup category='OutputTax'
                                    name="salesVATGroup"
                                    value={data.salesVATGroup}
                                    onChange={(e) => handlerChange("salesVATGroup", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-1"><MUITextField label="Sales UOM Name" name="salesUnit" value={data?.salesUnit}
                            onChange={(e) => handlerChange("salesUnit", e.target.value)}
                        />
                        </div>

                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Items Per Sales Unit" name="salesItemsPerUnit" value={data?.salesItemsPerUnit}
                                onChange={(e) => handlerChange("salesItemsPerUnit", e.target.value)}
                            />
                            <MUITextField label="Packing UoM Name" name="salesPackagingUnit" value={data?.salesPackagingUnit}
                                onChange={(e) => handlerChange("salesPackagingUnit", e.target.value)}
                            />

                        </div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Quantity per Package" name="salesQtyPerPackUnit" value={data?.salesQtyPerPackUnit}
                                onChange={(e) => handlerChange("salesQtyPerPackUnit", e.target.value)}
                            />
                            <MUITextField label="Create QR Code From" name="createQRCodeFrom" value={data?.createQRCodeFrom}
                                onChange={(e) => handlerChange("createQRCodeFrom", e.target.value)}
                            />

                        </div>
                    </div>


                </div>

                <div className="flex flex-col gap-2">

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Length" name="salesUnitLength" value={data?.salesUnitLength}
                                onChange={(e) => handlerChange("salesUnitLength", e.target.value)}
                            />
                            <MUITextField label="Width" name="salesUnitWidth" value={data?.salesUnitWidth}
                                onChange={(e) => handlerChange("salesUnitWidth", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Height" name="salesUnitHeight" value={data?.salesUnitHeight}
                                onChange={(e) => handlerChange("salesUnitHeight", e.target.value)}
                            />
                            <MUITextField label="Volume" name="salesUnitVolume" value={data?.salesUnitVolume}
                                onChange={(e) => handlerChange("salesUnitVolume", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Weight" name="salesUnitWeight" value={data?.salesUnitWeight}
                                onChange={(e) => handlerChange("salesUnitWeight", e.target.value)}
                            />

                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Factor 1" name="salesFactor1" value={data?.salesFactor1}
                                onChange={(e) => handlerChange("salesFactor1", e.target.value)}
                            />
                            <MUITextField label="Factor 2" name="salesFactor2" value={data?.salesFactor2}
                                onChange={(e) => handlerChange("salesFactor2", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Factor 3" name="salesFactor3" value={data?.salesFactor3}
                                onChange={(e) => handlerChange("salesFactor3", e.target.value)}
                            />
                            <MUITextField label="Factor 4" name="salesFactor4" value={data?.salesFactor4}
                                onChange={(e) => handlerChange("salesFactor4", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </FormCard>
        </>
    );
}
