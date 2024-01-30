// import React, { useMemo } from "react";
// import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
// import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
// import { MdDeleteOutline } from "react-icons/md";
// import MUITextField from "@/components/input/MUITextField";
// import MUIDatePicker from "@/components/input/MUIDatePicker";
// import BankSelect from "@/components/selectbox/bank";
// import ExpDicSelect from "@/components/selectbox/ExpDic";

// export default function Commercial(props: any) {
//   const { data, commer, setCommer }: any = props;
//   const [rowSelection, setRowSelection] = React.useState<any>({});
//   const addNewRow = () => {
//     // Assuming commer is initially set to an empty array or some array
//     let newRow: any = {
//       U_Type: "",
//       U_Name: "",
//       U_Ref: "",
//       U_IssueDate: "",
//       U_ExpiredDate: "",
//       U_Fee: 0,
//     };

//     // Make sure commer is initialized as an array
//     setCommer((prevCommer: any) => {
//       if (!Array.isArray(prevCommer)) {
//         // If commer is not an array, initialize it as an empty array
//         return [newRow];
//       }

//       // Spread the previous commer array and add the new row
//       return [...prevCommer, newRow];
//     });
//   };
//   const handlerRemoveCheck = () => {
//     const rows = Object.keys(rowSelection);
//     if (rows.length <= 0) return;
//     const newData = commer?.filter(
//       (item: any, index: number) => !rows.includes(index.toString())
//     );
//     setCommer(newData);
//     setRowSelection({});
//   };

//   const handleChange = (index: number, key: string, value: any) => {
//     const updated = commer?.map((item: any, idx: number) => {
//       if (idx === index) {
//         return {
//           ...item,
//           [key]: value,
//         };
//       }
//       return item;
//     });

//     setCommer(updated);

//   };
//   const columns = [
//     {
//       accessorKey: "U_Type",
//       header: "Type",
//       Cell: ({ cell }: any) => (
//         <MUITextField
//           key={"U_Type" + cell?.row?.id}
//           defaultValue={cell.row.original?.U_Description || ""}
//           onBlur={(e: any) => {
//             handleChange(cell?.row?.id, "U_Type", e?.target?.value);
//           }}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="">
//       <div className="flex space-x-4 text-[25px] justify-end mb-2">
//         {!data?.edit && (
//           <>
//             <AiOutlinePlus
//               className="text-blue-700 cursor-pointer"
//               onClick={addNewRow}
//             />
//             <MdDeleteOutline
//               className="text-red-500 cursor-pointer"
//               onClick={handlerRemoveCheck}
//             />
//           </>
//         )}
//         <AiOutlineSetting className="cursor-pointer" />
//       </div>
//       <MaterialReactTable
//         columns={columns}
//         data={commer || []}
//         enableStickyHeader={true}
//         enableHiding={true}
//         enablePinning={true}
//         enableSelectAll={true}
//         enableMultiRowSelection={true}
//         enableColumnActions={false}
//         enableColumnFilters={false}
//         enablePagination={false}
//         enableSorting={false}
//         enableBottomToolbar={false}
//         enableTopToolbar={false}
//         enableColumnResizing={true}
//         enableTableFooter={false}
//         enableRowSelection
//         onRowSelectionChange={setRowSelection}
//         initialState={{
//           density: "compact",
//           rowSelection,
//         }}
//         state={{
//           rowSelection,
//         }}
//         muiTableProps={{
//           sx: { cursor: "pointer", height: "60px" },
//         }}
//       />
//     </div>
//   );
// }

import MUITextField from "@/components/input/MUITextField";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
export default function Commercial({
  register,
  defaultValue,
  setValue,
  commer,
  setCommer,
}: any) {
  const addNewRow = () => {
    let newRow: any = {};
    setCommer([...(commer ?? []), newRow]);
  };

  const handlerDelete = (index: number) => {
    if (index) {
      const state: any[] = [...commer];
      state.splice(index, 1);
      setCommer(state);
    } else {
      return;
    }
  };

  const handlerChangeCommer = (key: string, value: any, index: number) => {
    const updated = commer.map((item: any, idx: number) => {
      if (idx === index) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setCommer(updated);
  };
  console.log(commer);

  return (
    <>
      <div>
        <table className="border w-full shadow-sm bg-white border-[#dadde0]">
          <tr className="border-[1px] border-[#dadde0]">
            <th className="w-[100px] "></th>

            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Type
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Name
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Issue Date
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Expire Date
            </th>
            <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
              Fee
            </th>
            <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
              Referance
            </th>
          </tr>
          {commer?.length === undefined && (
            <tr>
              <td
                colSpan={6}
                className="text-center p-10 text-[16px] text-gray-400"
              >
                No Record For Commercial
              </td>
            </tr>
          )}
          {commer?.map((e: any, index: number) => {
            return (
              <tr key={index}>
                <td className="py-5 flex justify-center gap-5 items-center">
                  <div
                    onClick={() => handlerDelete(index)}
                    className="w-[17px] shadow-lg shadow-[#878484] h-[17px] bg-red-500 rounded-sm text-white flex justify-center items-center cursor-pointer"
                  >
                    -
                  </div>
                  <span>{index + 1}</span>
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Type"
                    inputProps={{
                      defaultValue: e?.U_Type,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Type", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Name"
                    inputProps={{
                      defaultValue: e?.U_Name,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Name", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  {/* <DatePicker
                    onChange={(value: any) => {
                      if (value) {
                        handlerChangeCommer(
                          "U_IssueDate",
                          value?.toISOString(),
                          index
                        );
                      }
                    }}
                  
                  /> */}
                </td>
                <td className="pr-4">
                  {/* <DatePicker
                    onChange={(value: any) => {
                      if (value) {
                        handlerChangeCommer(
                          "U_ExpiredDate",
                          value?.toISOString(),
                          index
                        );
                      }
                    }}
  
                    key={e?.U_ExpiredDate}
                  /> */}
                </td>

                <td className="pr-4">
                  <MUITextField
                    placeholder="Fee"
                    inputProps={{
                      defaultValue: e?.U_Fee,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Fee", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Referance"
                    inputProps={{
                      defaultValue: e?.U_Ref,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Ref", e?.target?.value, index),
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <span
          onClick={addNewRow}
          className="p-1 bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
        >
          Add
        </span>
      </div>
    </>
  );
}
