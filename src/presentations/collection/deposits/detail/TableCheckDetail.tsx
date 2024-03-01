import { Checkbox } from "@mui/material";
import React, { useMemo } from "react";



export default function TableCheckDetail({
  setValue,
  commer,
  watch,
  data
}: any) {

  const selectedValues: any[] = useMemo(() => {
    if (!watch("CheckLines")) return [];

    return watch("CheckLines");
  }, [watch("CheckLines")]);
// console.log(selectedValues);

  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const index = selectedValues.findIndex(
      (e) => e.CheckKey === value.CheckKey
    );

    if (index < 0) {
      setValue("CheckLines", [...selectedValues, value]);
      return;
    }

    const values = [...selectedValues];
    values.splice(index, 1);
    setValue("CheckLines", values);
    
  };


  const getTotolCheck = useMemo(() =>  selectedValues?.length ??0 ,[selectedValues]);

  const getTotalAmount = useMemo(() =>  selectedValues?.reduce((p, c) => p + Number(c.CheckAmount), 0),[selectedValues]);

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 mt-[2rem] overflow-x-auto">
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0] text-black">
              <th className="w-[5rem]">
                <span className="">
                  <Checkbox size="small" />
                </span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] ">
                Date
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px]">
                Check
              </th>
              <th className="w-[250px] text-left font-normal  py-2 text-[14px]">
                BP/Account
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] ">
                Check Amount
              </th>
              <th className=" text-left font-normal py-2 text-[14px]">
                Incoming Payment
              </th>
            </tr>
            {commer?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record For Commercial
                </td>
              </tr>
            )}
            <tbody>
              {data?.map((e: any, index: number) => (
                <tr>
                  <td>
                    <Checkbox
                      checked={selectedValues?.find(
                        (val) => val.CheckKey === e.CheckKey
                      )}
                      onChange={(event) => onSelectChange(event, e)}
                    />
                  </td>
                  <td>{e.CheckDate}</td>
                  <td>{e.CashCheck}</td>
                  <td>{e.CardCode + ' - ' + e.CardName}</td>
                  <td>{e.CheckAmount}</td>
                  <td>{e.DocNum}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-[0.90rem] border bg-zinc-100 text-gray-600">
                <td className="py-2 border-r text-right pr-10" colSpan={2}>
                  No. of Checks
                </td>
                <td className=" border-r py-2" colSpan={2}>
                  <div className="flex justify-between px-3">
                    <span>{getTotolCheck}</span>
                    <span>Total</span>
                  </div>
                </td>
                <td className="pl-2" colSpan={2}>
                  {watch('TotalLC')?.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
