import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import TRModal from "./TRModal";
import { FaAngleDown } from "react-icons/fa6";
import { dateFormat } from "@/utilies";
import { TOCollections } from "../../type";
import shortid from "shortid";

export default function Document(props: any) {

  const documents: TOCollections[] = useMemo(() => {
    if (!props?.watch('TL_TO_ORDERCollection')) return []

    return props?.watch('TL_TO_ORDERCollection')?.filter((e: any) => e?.U_Type !== 'S') ?? [];
  }, [props?.watch('TL_TO_ORDERCollection')])

  const [rowSelect, setRowSelect] = useState<number[]>([])
  const [rowChildSelect, setRowChildSelect] = useState<string[]>([])

  const onRemoveLine = () => {
    let sources: any[] = [];
    for (let index = 0; index < documents.length; index++) {
      let indexes: any[] = rowChildSelect.filter((e) => `${index}_`);
      if (!indexes || indexes.length === 0) continue;

      indexes = indexes.map((e) => Number(e?.split('_').at(1)));
      const ele = documents[index];
      let rows: any[] = []
      for (let j = 0; j < ele?.TL_TO_DETAIL_ROWCollection?.length; j++) {
        if (indexes.includes(j)) continue;

        rows.push(ele?.TL_TO_DETAIL_ROWCollection[j])
      }

      if (rows.length > 0)
        sources.push({ ...ele, TL_TO_DETAIL_ROWCollection: rows })
    }

    setRowChildSelect([])
    setRowSelect([])
    if (sources.length > 0)
      props?.setValue('TL_TO_ORDERCollection', sources)
  }

  const onSelectParent = (event: any, index: number) => {
    let state = [...rowSelect];
    if (state.includes(index)) {
      state = state.filter((e) => e !== index);
      const childs = rowChildSelect.filter((e) => !e.includes(`${index}_`));
      setRowChildSelect(childs)
    } else {
      state.push(index);
      const childs = documents[index].TL_TO_DETAIL_ROWCollection.map((e, childIndex) => `${index}_${childIndex}`)
      setRowChildSelect(childs)
    }
    setRowSelect(state)
  }


  const onSelectChild = (event: any, parentIndex: number, index: string) => {
    let state = [...rowChildSelect];
    if (state.find((e) => e === index)) {
      state = state.filter((e) => e !== index)
    } else {
      state.push(index)
    }

    const all = state.map((e) => e.split('_').at(0));
    const selected = documents[parentIndex].TL_TO_DETAIL_ROWCollection.length === all.filter((e) => Number(e) == parentIndex)?.length;
    let parents = [...rowSelect];
    parents = selected ? [...parents, parentIndex] : parents.filter((e) => e !== parentIndex);

    setRowSelect(parents)
    setRowChildSelect(state)
  }

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between gap-x-3 items-center mb-5 pb-1">
          <div className="flex gap-2">
            <h2 className="mr-3">Source Document</h2>
            <Button
              sx={{ height: "25px" }}
              className="bg-white"
              size="small"
              variant="contained"
              disableElevation
              onClick={() => props?.dialog.current?.onOpen()}
            >
              <span className="px-4 text-[11px] py-4 text-white">
                Load Document
              </span>
            </Button>
          </div>
          {/* 
          <Button
            variant="outlined"
            className="px-4 border-gray-400"
            onClick={onRemoveLine}
          >
            <span className="px-2 text-xs">Remove</span>
          </Button> */}

          <Button
            sx={{ height: "25px" }}
            className="bg-white"
            size="small"
            variant="outlined"
            disableElevation
            onClick={onRemoveLine}
          >
            <span className="px-2 text-xs">Remove</span>
          </Button>
        </div>
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <thead>
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[50px] "></th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Source Document
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Document Number{" "}
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  To Branch
                </th>
                <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                  To Warehouse
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Items
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Quantity{" "}
                </th>

              </tr>
            </thead>

            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-10 text-[16px] text-gray-400"
                  >
                    No Record
                  </td>
                </tr>
              )}

              {/*  */}
              {documents?.map((e: any, index: number) => {
                return (
                  <Fragment key={shortid.generate()}>
                    <tr className="border-t border-[#dadde0]">
                      <td className="py-2 flex justify-center gap-2 items-center">
                        <Checkbox size="small" checked={rowSelect.includes(index)} onChange={(event) => onSelectParent(event, index)} />
                        <div className={`text-gray-700 `}>
                          <FaAngleDown color="gray" />
                        </div>
                        <span className="text-black">{index + 1}</span>
                      </td>

                      <td className="pr-4">
                        <span className="text-black text-[13.5px] ml-11">
                          {e?.U_Type}
                        </span>
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Document Number"
                          value={e?.U_DocNum}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="To Branch"
                          value={e?.U_BPLName}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="To Warehouse"
                          value={e?.U_Terminal}
                        />
                      </td>

                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Items"
                          value={e?.U_TotalItem}
                        />
                      </td>
                      <td colSpan={false ? 2 : undefined} className="">
                        <MUITextField
                          disabled={true}
                          placeholder="Quantity"
                          value={e?.U_TotalQuantity}
                        />
                      </td>
                    </tr>
                    {e?.TL_TO_DETAIL_ROWCollection &&
                      e?.TL_TO_DETAIL_ROWCollection?.map(
                        (c: any, indexc: number) => {
                          return (
                            <Fragment key={shortid.generate()}>
                              <tr
                                className="border-t-[1px] border-[#dadde0] "
                                key={indexc}
                              >
                                <th className="w-[120px] "></th>
                                <th className="w-[200px] border-l-[1px]  border-b border-[#dadde0] pl-5 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500">
                                  Source Type{" "}
                                </th>

                                <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                                  Document Number{" "}
                                </th>

                                <th className="text-left bg-gray-50  border-b border-[#dadde0]  font-normal  py-2 text-[14px] text-gray-500">
                                  Ship To
                                </th>
                                <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                                  Item{" "}
                                </th>
                                <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                                  Delivery Date
                                </th>
                                <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                                  Qty{" "}
                                </th>
                                <th className="bg-gray-50  border-b border-[#dadde0] "></th>
                              </tr>
                              <tr key={index} className="">
                                <td className="py-6 flex justify-center gap-8 items-center"></td>

                                <td className="pr-4 bg-gray-50 border-l-[1px] border-[#dadde0]">
                                  <span className="text-black flex items-center gap-3 text-[13.5px] ml-1">
                                    <Checkbox
                                      className=""
                                      size="small"
                                      disabled={false}
                                      checked={rowChildSelect.includes(`${index}_${indexc}`)}
                                      onChange={(event) => onSelectChild(event, index, `${index}_${indexc}`)}
                                    />
                                    {c?.U_DocType}
                                  </span>
                                </td>
                                <td className="pr-4 bg-gray-50">
                                  <MUITextField
                                    disabled={true}
                                    placeholder="Document Number"
                                    value={c?.U_DocNum}
                                  />
                                </td>

                                <td className="pr-4 bg-gray-50">
                                  <MUITextField
                                    disabled={true}
                                    placeholder="Ship To"
                                    value={c?.U_ShipToCode}
                                  />
                                </td>
                                <td className="pr-4 bg-gray-50">
                                  <MUITextField
                                    disabled={true}
                                    placeholder="Item"
                                    value={c?.U_ItemCode}
                                  />
                                </td>
                                <td className="pr-4 bg-gray-50">
                                  <MUITextField
                                    disabled={true}
                                    placeholder="Delivery Date"
                                    value={dateFormat(c?.U_DeliveryDate)}
                                  />
                                </td>
                                <td colSpan={2} className="bg-gray-50">
                                  <MUITextField
                                    disabled={true}
                                    placeholder="Qty"
                                    value={c?.U_Quantity}
                                  />
                                </td>
                              </tr>
                            </Fragment>
                          );
                        }
                      )}
                  </Fragment>
                );
              })}

            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}
