
import { Backdrop, Button, Checkbox, CircularProgress } from "@mui/material"
import React, { useState } from "react"
import { useTransferRequestFormHook } from "../hook/useTransferRequestHook"
import FormMessageModal from "@/components/modal/FormMessageModal"
import CustomToast from "@/components/modal/CustomToast"
import { MdEdit } from 'react-icons/md';
import { IoCreate } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import BasicInformation from "../components/BasicInformation"
import Contents from "../components/Contents"
import { LoadingButton } from "@mui/lab"

let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();

export const InventoryTransferRequestDetails = () => {
  const [tap, setTap] = useState<number>(0)
  const hook = useTransferRequestFormHook(false, dialog);

  const onChangeTap = (index: number) => {

    if (index === 1 && !hook.watch('BPLID')) {
      toastRef.current?.open();
      return;
    }

    setTap(index)
  }

  const navigate = useNavigate();
  const { id } = useParams();


  return <div className="w-full h-full p-6 flex flex-col gap-2">
    <div className="w-full flex gap-4">
      <h1>Inventory Transfer Request</h1>

      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate(`/stock-control/inventory-transfer-request/${id}/edit`)}
        endIcon={<MdEdit />}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate(`/stock-control/inventory-transfer-request/create`)}
        endIcon={<IoCreate />}
      >
        Create
      </Button>
    </div>

    <div className="w-full border-t border-b mt-4">
      <ul className="flex gap-8 text-[15px] py-2">
        <li role="button" className={tap === 0 ? 'text-green-600 ' : ''} onClick={() => onChangeTap(0)}>Basic Information</li>
        <li role="button" className={tap === 1 ? 'text-green-600 ' : ''} onClick={() => onChangeTap(1)} >Content</li>
      </ul>
    </div>

    <form
      onSubmit={hook.handleSubmit(hook.onSubmit, hook.onInvalidForm)}
      className="grow flex flex-col">
      <div className="grow ">
        <Backdrop
          sx={{
            color: "#fff",
            backgroundColor: "rgb(251 251 251 / 60%)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={hook.loading}
        >
          <CircularProgress />
        </Backdrop>

        {tap === 0 && <BasicInformation {...hook} />}
        {tap === 1 && <Contents {...hook} />}
      </div>


      <FormMessageModal ref={dialog} />
      <CustomToast ref={toastRef} />

      <div className="sticky w-full bottom-4 md:bottom-0 md:p-3  mt-2 ">
        <div className="backdrop-blur-sm bg-white p-2 rounded-lg  z-[1000] flex justify-end gap-3 border drop-shadow-sm">


          {/*  */}
          <div className="flex ">
            <LoadingButton
              size="small"
              sx={{ height: "25px", }}
              style={{
                background: '#2D31AB',
                backgroundColor: '#2D31AB',
              }}
              disableElevation
              onClick={() => navigate(`/stock-control/stock-transfer/create?type=external&id=${hook.id}`)}
            >
              <span className="px-3 text-[11px] py-1 text-white">
                Copy To
              </span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </form>
  </div>
}



