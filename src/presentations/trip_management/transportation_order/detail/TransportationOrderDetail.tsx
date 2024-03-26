import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import Document from "../component/detail/DocumentDetail";
import { getTextStatus, useTransportationOrderFormHook } from '../hook/useTransportationOrderForm';
import { TOStatus } from "../../type";
import General from "../component/detail/GeneralDetail";
import ReviewingOrderingTransportationOrder from "../component/detail/ReviewingOrderingTransportationOrderDetail";
import Expense from "../component/detail/ExpenseDetail";
import Compartment from "../component/detail/CompartmentDetail";

let dialog = React.createRef<FormMessageModal>();

const TransportationOrderFormDetail = (props: any) => {
  const hook = useTransportationOrderFormHook(props?.edit, dialog)
  const [tapIndex, setTapIndex] = useState<any>(0)

  const HeaderTaps = () => {
    return (
      <>
        <MenuButton
          active={tapIndex === 0}
          onClick={() => setTapIndex(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={tapIndex === 1}
          onClick={() => setTapIndex(1)}
        >
          Documents
        </MenuButton>
        <MenuButton
          active={tapIndex === 2}
          onClick={() => setTapIndex(2)}
        >
          Expense
        </MenuButton>
        <MenuButton
          active={tapIndex === 3}
          onClick={() => setTapIndex(3)}
        >
          Compartments
        </MenuButton>
        <MenuButton
          active={tapIndex === 4}
          onClick={() => setTapIndex(4)}
        >
          Transportation Detail
        </MenuButton>
      </>
    );
  };


  const Left = () => {
    return <div className="w-[100%] pl-[25px] h-[165px] flex py-5 px-4">
      <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
        <div>
          <span className="">Trip Number </span>
        </div>
        <div>
          <span className="">Driver</span>
        </div>
        <div>
          <span className="">Vehicle</span>
        </div>
        <div>
          <span className="">Route</span>
        </div>
      </div>
      <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
        <div>
          <span>{hook?.watch('DocNum') ?? '-'}</span>
        </div>
        <div>
          <span>{hook?.watch('U_Driver') ?? '-'}</span>
        </div>
        <div>
          <span>{hook.watch('U_Vehicle') ?? '-'}</span>
        </div>
        <div>
          <span>{hook.watch('U_Route') ?? '-'}</span>
        </div>
      </div>
    </div>;
  }

  const Right = () => {
    return <>
      <div className="w-[100%] h-[165px] flex py-5 px-4">
        <div className="w-[70%] text-[15px] text-gray-500 flex items-end justify-between flex-col h-full">
          <div>
            <span className="">Base Station </span>
          </div>
          <div>
            <span className="">Dispatch Date</span>
          </div>
          <div>
            <span className="">Completed Date</span>
          </div>
          <div>
            <span className="">Status</span>
          </div>
        </div>
        <div className="w-[23%] text-[15px] items-end justify-between flex flex-col h-full">
          <div>
            <span>{ }</span>
          </div>
          <div>
            <span>{hook.watch('U_BaseStation') ?? '-'}</span>
          </div>
          <div>
            <span>{hook.watch('U_DispatchDate') ?? '-'}</span>
          </div>
          <div>
            <span>{hook.watch('U_CompletedDate') ?? '-'}</span>
          </div>
          <div>
            <span>{getTextStatus(hook.watch('U_Status') as TOStatus) ?? '-'}</span>
          </div>
        </div>
      </div></>
  }

  return (
    <>
      {hook.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <div className="w-full h-[93vh] flex flex-col p-3">
          <DocumentHeaderComponent
            data={{
              showCollapse: true
            }}
            menuTabs={<HeaderTaps />}
            HeaderCollapeMenu={
              <>
                <Left />
                <Right />
              </>
            }
            leftSideField={<div></div>}
            rightSideField={undefined}
          />
          <Backdrop
            sx={{
              color: "#fff",
              backgroundColor: "rgb(251 251 251 / 60%)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={hook.loading}
          >
            <CircularProgress />
          </Backdrop>{" "}
          <FormMessageModal ref={dialog} />


          <form
            id="formData"
            className="grow flex flex-col gap-4 relative"
          >
            <div className="grow">
              {tapIndex === 0 && <General {...hook} />}
              {tapIndex === 1 && <Document {...hook} />}
              {tapIndex === 2 && <Expense {...hook} />}
              {tapIndex === 3 && <Compartment {...hook} />}
              {tapIndex === 4 && <ReviewingOrderingTransportationOrder {...hook} />}
            </div>

            {/*  */}

          </form>
        </div>
      )}
    </>
  );
};

export default TransportationOrderFormDetail;
