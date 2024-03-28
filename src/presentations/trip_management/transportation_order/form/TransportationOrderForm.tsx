import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import Document from "../component/Document";
import { getTextStatus, useTransportationOrderFormHook } from '../hook/useTransportationOrderForm';
import { TOStatus } from "../../type";
import TRModal, { TransportationOrderModal } from "../component/TRModal";
import General from "../component/General";
import ReviewingOrderingTransportationOrder from "../component/ReviewingOrderingTransportationOrder";
import Expense from "../component/Expense";
import Compartment from "../component/Compartment";
import { useTOAuthorizationField } from "../hook/useTOAuthorizationField";
import TODocumenHeaderComponent from "../../component/TODocumenHeaderComponent";
import { displayTextDate, useQueryParams } from "@/lib/utils";
import { createGIGRTransaction } from "../services";
import request from "@/utilies/request";
import CustomToast from "@/components/modal/CustomToast";

let dialog = React.createRef<FormMessageModal>();
let loadDocumentRef = React.createRef<TransportationOrderModal>();
let toastRef = React.createRef<CustomToast>();

const TransportationOrderForm = (props: any) => {
  const hook = useTransportationOrderFormHook(props?.edit, dialog)
  const [tapIndex, setTapIndex] = useState<any>(0)

  const autorizationField = useTOAuthorizationField();

  const HeaderTaps = () => {
    return (
      <>
        {<MenuButton
          active={tapIndex === 0}
          onClick={() => setTapIndex(0)}
        >
          General
        </MenuButton>}
        {
          <MenuButton
            active={tapIndex === 1}
            onClick={() => setTapIndex(1)}
          >
            Documents
          </MenuButton>
        }
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
            <span>{displayTextDate(hook.watch('U_DispatchDate')) ?? '-'}</span>
          </div>
          <div>
            <span>{displayTextDate(hook.watch('U_CompletedDate')) ?? '-'}</span>
          </div>
          <div>
            <span>{getTextStatus(hook.watch('U_Status') as TOStatus) ?? '-'}</span>
          </div>
        </div>
      </div></>
  }

  const queryParam = useQueryParams();

  const isResyncStock = useMemo(() => {
    if (!hook.id) return false;
    // if (hook.watch('U_Status') === queryParam.get('status'))
    return hook.watch('TL_TO_ORDERCollection')?.filter((child: any) => child?.U_Type !== 'S')
      ?.some((e: any) => e?.TL_TO_DETAIL_ROWCollection
        ?.some((row: any) => row?.U_gi_synced === 0 || row?.U_gr_synced === 0));

    // 
  }, [hook.watch('TL_TO_ORDERCollection'), hook.watch('U_Status')])


  const onResynceData = useCallback(async () => {
    try {
      hook.setLoading(true)
      const getStock = await request('GET', `/script/test/generate_trans_order_gigr(${hook.id})`);
      hook.setLoading(false)
      console.log(getStock);
      // const transferReponse: any = await createGIGRTransaction(response?.data ?? []);
      // dialog.current?.success(`${transferReponse?.message ?? ''}`, response?.data?.DocEntry)
    } catch (error: any) {
      hook.setLoading(false)
      dialog.current?.error(error?.message ?? '')
    }
  }, [isResyncStock])

  return (
    <>
      <FormMessageModal ref={dialog} />
      <CustomToast ref={toastRef} />
      {hook.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <div className="w-full h-[93vh] flex flex-col p-3">
          <TODocumenHeaderComponent
            status={hook.watch('U_Status')}
            edit={props?.edit}
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

          <TransportationOrderModal ref={loadDocumentRef} onSelectItems={hook.onSelectChangeDocuments} />

          <form
            id="formData"
            className="grow flex flex-col gap-4 relative"
            onSubmit={hook.handleSubmit(hook.onSubmit, hook.onInvalidForm)}
          >
            <div className="grow">
              {tapIndex === 0 && <General {...hook} {...autorizationField} />}
              {tapIndex === 1 && <Document {...hook} dialog={loadDocumentRef} {...autorizationField} />}
              {tapIndex === 2 && <Expense {...hook} {...autorizationField} />}
              {tapIndex === 3 && <Compartment {...hook} {...autorizationField} />}
              {tapIndex === 4 && <ReviewingOrderingTransportationOrder {...hook} {...autorizationField} />}
            </div>

            {/*  */}
            <div className="sticky bottom-0  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
                <div className="flex">
                  <LoadingButton
                    size="small"
                    sx={{ height: "25px" }}
                    variant="outlined"
                    style={{
                      background: "white",
                      border: "1px solid red",
                    }}
                    disableElevation
                    onClick={() =>
                    (window.location.href =
                      "/trip-management/transportation-order")
                    }
                  >
                    <span className="px-3 text-[11px] py-1 text-red-500">
                      Cancel
                    </span>
                  </LoadingButton>
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingButton
                    type="submit"
                    sx={{ height: "25px" }}
                    className="bg-white"
                    loading={hook.loading}
                    size="small"
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      {props.edit ? "Update" : "Add"}
                    </span>
                  </LoadingButton>
                </div>

                {isResyncStock && <div className="flex items-center space-x-4">
                  <LoadingButton
                    sx={{ height: "25px" }}
                    className="bg-white"
                    loading={hook.loading}
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={onResynceData}
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      Re-generate Stock
                    </span>
                  </LoadingButton>
                </div>}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TransportationOrderForm;
