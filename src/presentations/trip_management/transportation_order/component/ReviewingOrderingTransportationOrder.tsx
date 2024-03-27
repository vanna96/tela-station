import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import shortid from "shortid";

export default function ReviewingOrderingTransportationOrder(props: any) {
  const [reordering, setReordering] = useState(false);



  const undOrdering: any[] = useMemo(() => {
    return props?.documents.filter((e: any) => e?.U_Order <= 0).sort((a: any, b: any) => a?.U_Order - b?.U_Order);
  }, [props?.documents])

  const orderings: any[] = useMemo(() => {
    return props?.documents.filter((e: any) => e?.U_Order > 0).sort((a: any, b: any) => a?.U_Order - b?.U_Order);
  }, [props?.documents])

  const onChangeOrdering = (item: any) => {
    let state = [...props?.watch('TL_TO_ORDERCollection')]
    let order = item?.U_Order === 0 ? orderings.length + 1 : 0;

    state[item?.ParentIndex]['TL_TO_DETAIL_ROWCollection'][item?.Index]['U_Order'] = order;

    if (order === 0 && orderings.length > 0) {
      const sorting = orderings.sort((a: any, b: any) => a?.U_Order - b?.U_Order);
      for (let index = 0; index < sorting.length; index++) {
        const element: any = sorting[index];
        state[element?.ParentIndex]['TL_TO_DETAIL_ROWCollection'][element?.Index]['U_Order'] = index;
      }
    }

    props?.setValue('TL_TO_ORDERCollection', state);
  }

  useEffect(() => {
    if (props?.documents.length === orderings.length) {
      setReordering(true)
    }
  }, [props?.documents, orderings])

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1 gap2">
          <h2 className="mr-3">Transportation Detail</h2>
          {reordering && <div role="button" onClick={() => setReordering(false)} className="text-[12px] border px-2 rounded hover:bg-gray-100">Change Ordering</div>}
        </div>

        {reordering && <div className="w-full min-w-[30rem] whitespace-nowrap overflow-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left  w-[6%] text-[13px] font-thin py-2 px-3 border">Order</th>
                <th className="text-left  w-[12%] text-[13px] font-thin py-2 px-3 border">Stop / Drop Off</th>
                <th className="text-left  text-[13px] font-thin py-2 px-3 border">From Location</th>
                <th className="text-left  text-[13px] font-thin py-2 px-3 border">To Location</th>
                <th className="text-left  text-[13px] font-thin py-2 px-3 border">Address</th>
                <th className="text-left  text-[13px] font-thin py-2 px-3 border">Remark</th>
              </tr>
            </thead>
            <tbody>
              {orderings.map((e: any, index: number) => {
                return <React.Fragment key={shortid.generate()}>
                  <tr className={`text-[13px] border ${e?.U_DocType === 'S' ? 'bg-gray-200' : ''}`}>
                    <td className="p-2 px-3">{e?.U_Order}</td>
                    <td className="p-2 px-3">{e?.U_DocType !== 'S' ? 'Drop-off' : 'Stops'}</td>
                    <td className="p-2 px-3">{index === 0 ? props?.watch('U_BaseStation') : props?.documents[index]?.U_ShipToCode}</td>
                    <td className="p-2 px-3">{e?.U_ShipToCode}</td>
                    <td className="p-2 px-3">{e?.U_ShipToAddress}</td>
                    <td className="p-2 px-3"></td>
                  </tr>
                  {e?.U_DocType !== 'S' && <tr className="border">
                    <td></td>
                    <td colSpan={5} className="p-0 border-none">
                      <div className="w-full bg-gray-100">
                        <table className="table w-full">
                          <thead>
                            <tr className="">
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Source Document</th>
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Document Number</th>
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Item</th>
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Total Quantity</th>
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Unload Start Time</th>
                              <th className="text-left text-[13px] font-thin border py-2 px-3">Unload End Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className={`text-[13px] border ${e?.U_DocType === 'S' ? 'bg-gray-100' : ''}`}>
                              <td className="p-1 px-4">{e?.U_DocType}</td>
                              <td className="p-1 px-4">{e?.U_DocNum}</td>
                              <td className="p-1 px-4">{e?.U_ItemCode}</td>
                              <td className="p-1 px-4">{e?.U_Quantity}</td>
                              <td className="p-1 px-4"></td>
                              <td className="p-1 px-4"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>}
                </React.Fragment>
              })}
            </tbody>
          </table>
        </div>}

        {!reordering && <div className="flex gap-5">
          <OrderingCollection data={undOrdering} onClick={onChangeOrdering} />
          <div className="flex items-center justify-center flex-col gap-3">
            <span className="text-gray-400 inline-block border p-[2px]">
              {" "}
              <FaAngleRight />
            </span>
            <span className="text-gray-400 inline-block border p-[2px]">
              <FaAngleLeft />
            </span>
          </div>
          <OrderingCollection data={orderings} onClick={onChangeOrdering} />
        </div>}
      </div>
    </>
  );
}


export const OrderingCollection = ({ data, onClick }: { data: any[], onClick: (item: any) => void }) => {
  return <div className="grow">
    <table className="border w-full table-fixed shadow-sm bg-white border-[#dadde0]">
      <thead>
        <tr className="border-[1px] border-[#dadde0] bg-gray-50">
          <th className="w-[70px] text-left font-normal  py-2 pl-3 text-[14px] text-gray-500">
            No
          </th>

          <th className="w-[150px] text-left font-normal  py-2 text-[14px] text-gray-500">
            Type
          </th>
          <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
            Address / ShipTo
          </th>
          <th className="w-[160px] text-left font-normal  py-2 text-[14px] text-gray-500">
            Document .No
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: number) => {
          return <tr
            key={shortid.generate()}
            className=" cursor-default border-b hover:cursor-pointer"
            onClick={() => onClick(item)}
          >
            <td className="py-3 text-left pl-4 ">
              <span className="text-gray-500">{item?.U_Order}</span>
              {/* <span className="text-gray-500">{index + 1}</span> */}
            </td>
            <td className="pr-4 h-[20px]">
              <span className={`${item?.U_DocType === "S" || item?.U_Type === "S" ? "text-red-500" : "text-gray-500"} text-[13.5px]`}>
                {item?.U_DocType !== "S" ? item?.U_ItemCode || item?.U_StopCode : "Drop-Off"}
              </span>
            </td>
            <td className="pr-4">
              <span className="text-gray-500 text-[13.5px]">
                {item?.U_ShipToCode}
              </span>
            </td>
            <td className="pr-4">
              <span className="text-gray-500 text-[13.5px]">
                {item?.U_DocNum}
              </span>
            </td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
}