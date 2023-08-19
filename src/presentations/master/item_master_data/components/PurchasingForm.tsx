import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import CustomGroupSelect from "@/components/selectbox/CustomGroup";
import MUISelect from "@/components/selectbox/MUISelect";
import VatGroup from "@/components/selectbox/VatGroup";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface PurchasingFormProps {
    handlerOpenVendor: () => void;
    handlerChange: (key: string, value: any) => void;
    data: any;
    edit?: boolean;
}

export default function PurchasingForm({
    handlerOpenVendor,
    data,
    edit,
    handlerChange,
}: PurchasingFormProps) {

  

    return (
        <>
            <FormCard title="Purchasing">
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-3">
                        <MUITextField
                            label="Prefered Vendor"
                            value={ data?.cardCode}
                            name="BPCode"
                            onClick={handlerOpenVendor}
                            endAdornment={true}
                        />
                        <MUITextField
                            label="Mfr Catalog No"
                            value={data?.supplierCatalogNo}
                            name="supplierCatalogNo"
                            onChange={(e) => handlerChange("supplierCatalogNo", e.target.value)}
                        />

                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <MUITextField label="Purchasing UOM Name" name="purchaseUnit" value={data?.purchaseUnit}
                                onChange={(e) => handlerChange("purchaseUnit", e.target.value)}
                            />
                            <MUITextField label="Purchase Items Per Unit" name="purchaseItemsPerUnit" value={data?.purchaseItemsPerUnit}
                                onChange={(e) => handlerChange("purchaseItemsPerUnit", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Packaging UOM Name" name="purchasePackagingUnit" value={data?.purchasePackagingUnit}
                                onChange={(e) => handlerChange("purchasePackagingUnit", e.target.value)}
                            />
                            <MUITextField label="Quantity Per Package" name="quantityPerPackage" value={data?.quantityPerPackage}
                                onChange={(e) => handlerChange("quantityPerPackage", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 text-sm ">
                                <label htmlFor="Code" className="text-gray-500 text-[13px]">
                                    Customs Group</label>
                                <div className="mt-1">
                                    <CustomGroupSelect
                                        name="customsGroupCode" value={data?.customsGroupCode}
                                        onChange={(e) => handlerChange("customsGroupCode", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 text-sm ">
                                <label htmlFor="Code" className="text-gray-500 text-[13px]">
                                    Purchase VAT Group </label>
                                <div className="mt-1">
                                    <VatGroup category='InputTax'
                                        name="purchaseVATGroup"
                                        value={data.purchaseVATGroup}
                                        onChange={(e) => handlerChange("purchaseVATGroup", e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Length" name="purchaseUnitLength" value={data?.purchaseUnitLength}
                                onChange={(e) => handlerChange("purchaseUnitLength", e.target.value)}
                            />
                            <MUITextField label="Width" name="purchaseUnitWidth" value={data?.purchaseUnitWidth}
                                onChange={(e) => handlerChange("purchaseUnitWidth", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Height" name="purchaseUnitHeight" value={data?.purchaseUnitHeight}
                                onChange={(e) => handlerChange("purchaseUnitHeight", e.target.value)}
                            />
                            <MUITextField label="Volume" name="purchaseUnitVolume" value={data?.purchaseUnitVolume}
                                onChange={(e) => handlerChange("purchaseUnitVolume", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Weight" name="purchaseUnitWeight" value={data?.purchaseUnitWeight}
                                onChange={(e) => handlerChange("purchaseUnitWeight", e.target.value)}
                            />

                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Factor 1" name="purchaseFactor1" value={data?.purchaseFactor1}
                                onChange={(e) => handlerChange("purchaseFactor1", e.target.value)}
                            />
                            <MUITextField label="Factor 2" name="purchaseFactor2" value={data?.purchaseFactor2}
                                onChange={(e) => handlerChange("purchaseFactor2", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">

                            <MUITextField label="Factor 3" name="purchaseFactor3" value={data?.purchaseFactor3}
                                onChange={(e) => handlerChange("purchaseFactor3", e.target.value)}
                            />
                            <MUITextField label="Factor 4" name="purchaseFactor4" value={data?.purchaseFactor4}
                                onChange={(e) => handlerChange("purchaseFactor4", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </FormCard>
        </>
    );
}
