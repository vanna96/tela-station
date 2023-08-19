import { numberWithCommas } from "@/helper/helper";
import { MenuItem, Select } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import { ModalItemTable } from "./ModalItemTable";

type ItemTableProps = {
  Edit?: any;
};

export const ItemTable = ({ Edit }: ItemTableProps) => {
  const {
    form,
    setForm,
    TaxCode,
    UnitOfMeasurementGroups,
    UnitOfMeasurements,
  }: any = useContext(FormOrderContext);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const qtyRef: any = useRef([]);
  const disRef: any = useRef([]);
  const unitPriceRef: any = useRef([]);
  const items = form?.items;

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleOpenModal = (obj?: any) => {
    if (!form?.cardCode) return;
    setEditData(obj);
    handleOpen();
  };

  const handleRemoveRow = (ItemCode: string) =>
    setForm({
      ...form,
      items: items?.filter((e: any) => e.ItemCode !== ItemCode),
    });

  const handleUpdateRow = (idx: number, row: any, field: any) => {
    let qty = qtyRef.current[idx].value || 0;
    let discount = disRef.current[idx].value || 0;
    let unitPrice = unitPriceRef.current[idx].value || 0;

    const newState = items?.map((obj: any) => {
      if (obj.ItemCode !== row.ItemCode) return obj;

      // check stock if update qty
      if (qty && parseFloat(qty) > parseFloat(obj.QuantityOnStock)) {
        qty = obj.QuantityOnStock || 0;
        field = { qty };
      }

      // check discount
      if (discount && parseFloat(discount) > 100) {
        discount = 100;
        field = { discount };
      }

      // total
      let total = qty * unitPrice;
      if (discount > 0) {
        total = total - (total * discount) / 100;
      }

      // tax code
      if (field.taxCode) {
        const rate =
          TaxCode?.find((e: any) => e.Code === field.taxCode)
            ?.VatGroups_Lines[0]["Rate"] || 0;

        field = { rate: (rate / 100) * total, taxCode: field.taxCode };
      }

      return { ...obj, ...field, total: total };
    });

    setForm({ ...form, items: newState });
  };

  return (
    <>
      <ModalItemTable
        openModal={open}
        handleClose={handleClose}
        editData={editData}
      />
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {Edit ? (
              ""
            ) : (
              <th scope="col" className="px-6 py-3 w-[5px]">
                #
              </th>
            )}
            <th scope="col" className="px-6 py-3 w-full 2xl:w-[200px]">
              Item No
            </th>
            <th scope="col" className="px-6 py-3 w-[200px]">
              Description
            </th>
            <th scope="col" className="px-6 py-3 w-[100px]">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 w-[100px]">
              Discount(%)
            </th>
            <th scope="col" className="px-6 py-3 w-[100px]">
              Unit Price
            </th>
            <th scope="col" className="px-6 py-3 w-[200px]">
              Tax Code
            </th>
            <th scope="col" className="px-6 py-3 w-[100px]">
              Total (LC)
            </th>
            <th scope="col" className="px-6 py-3 w-[100px]">
              UoM Code
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((res: any, index: number) => {
            return (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-[40px]"
              >
                {Edit ? (
                  ""
                ) : (
                  <td className="px-6 py-3 w-[5px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveRow(res.ItemCode)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </td>
                )}
                <td className="px-2 relative">
                  {inputFormControl({
                    className: "w-full 2xl:w-[200px]",
                    value: res.ItemCode,
                  })}
                  <div className="absolute top-2.5 right-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      onClick={() => handleOpenModal(res)}
                      className="w-5 text-blue-400 cursor-pointer "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                  </div>
                </td>
                <td className="px-2">
                  {inputFormControl({
                    className: "2xl:w-[200px]",
                    value: res.ItemName,
                  })}
                </td>
                <td className="px-2">
                  {inputFormControl({
                    className: "2xl:w-[100px] qty",
                    value: res.qty,
                    type: "number",
                    ref: (el: any) => (qtyRef.current[index] = el),
                    onChange: (e: any) =>
                      handleUpdateRow(index, res, { qty: e.target.value }),
                  })}
                </td>
                <td className="px-2">
                  {inputFormControl({
                    className: "2xl:w-[100px]",
                    value: res.discount,
                    type: "number",
                    ref: (el: any) => (disRef.current[index] = el),
                    onChange: (e: any) =>
                      handleUpdateRow(index, res, { discount: e.target.value }),
                  })}
                </td>
                <td className="px-2">
                  {inputFormControl({
                    className: "2xl:w-[100px]",
                    value: res.unitPrice,
                    type: "number",
                    ref: (el: any) => (unitPriceRef.current[index] = el),
                    onChange: (e: any) => {
                      handleUpdateRow(index, res, {
                        unitPrice: e.target.value,
                      });
                    },
                  })}
                </td>
                <td className="px-2">
                  <Select
                    className="form-control h-[25px] w-full 2xl:w-[200px]"
                    onChange={(e) =>
                      handleUpdateRow(index, res, { taxCode: e.target.value })
                    }
                    value={res.taxCode}
                    sx={{ border: "0px solid black", padding: 0 }}
                  >
                    {TaxCode?.map((res: any, index: number) => (
                      <MenuItem key={index} value={`${res.Code}`}>
                        {res.Code}
                      </MenuItem>
                    ))}
                  </Select>
                </td>
                <td className="px-2">
                  {inputFormControl({
                    className: "2xl:w-[100px]",
                    value: numberWithCommas(res?.total || 0),
                    onChange: (e: any) =>
                      handleUpdateRow(index, res, { total: e.target.value }),
                  })}
                </td>
                <td className="px-2">
                  <Select
                    className="form-control h-[25px] w-full"
                    onChange={(e) => {
                      const uomCode = UnitOfMeasurements?.find(
                        ({ AbsEntry }: any) => AbsEntry === e.target.value
                      )?.Code;
                      handleUpdateRow(index, res, {
                        uomCode: uomCode,
                        uoMEntry: e.target.value,
                      });
                    }}
                    value={res?.uoMEntry || res?.UoMGroupEntry}
                    sx={{ border: "0px solid black", padding: 0 }}
                  >
                    {UnitOfMeasurementGroups?.find(
                      ({ AbsEntry }: any) => AbsEntry === res?.UoMGroupEntry
                    )?.UoMGroupDefinitionCollection?.map(
                      (i: any, index: number) => {
                        return (
                          <MenuItem key={index} value={i?.AlternateUoM}>
                            {
                              UnitOfMeasurements?.find(
                                ({ AbsEntry }: any) =>
                                  AbsEntry === i?.AlternateUoM
                              )?.Name
                            }
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </td>
              </tr>
            );
          })}
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-[40px]">
            {Edit ? "" : <td className="px-6 py-3 w-[5px]"></td>}
            <td className="px-2 relative">
              {inputFormControl({ className: "w-full 2xl:w-[200px]" })}
              <div className="absolute top-2.5 right-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={() => handleOpenModal(null)}
                  className="w-5 text-blue-400 cursor-pointer "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </div>
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[200px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[100px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[100px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[100px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[200px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[100px]" })}
            </td>
            <td className="px-2">
              {inputFormControl({ className: "2xl:w-[100px]" })}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

type inputFormControlProps = {
  name?: string;
  className?: string;
  type?: string;
  value?: any;
  onChange?: (e?: any) => void;
  ref?: any;
};

const inputFormControl = ({
  name,
  className,
  type = "text",
  value = "",
  onChange = () => console.log(),
  ref,
}: inputFormControlProps) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    ref={ref}
    className={`form-control h-[25px] ${className}`}
  />
);
