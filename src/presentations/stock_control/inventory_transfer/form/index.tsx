
import { LoadingButton } from "@mui/lab"
import { Backdrop, Button, Checkbox, CircularProgress } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import FormMessageModal from "@/components/modal/FormMessageModal"
import CustomToast from "@/components/modal/CustomToast"
import { IoCreate } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import BasicInformation from "../components/BasicInformation"
import Contents from "../components/Contents"
import { useStockTransferFormHook } from "../hook/useStockTransferHook"
import { GetInventoryTransferRequestModal } from '../../components/GetInventoryTransferRequestOpenModal';

let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();
let inventoryTransferRequestModalRef = React.createRef<GetInventoryTransferRequestModal>();

export const InventoryTransferForm = ({ edit = false, detail = false }: { edit?: boolean, detail?: boolean | undefined }) => {
  const [tap, setTap] = useState<number>(0)
  const hook = useStockTransferFormHook(edit, dialog);

  const onChangeTap = (index: number) => {

    if (index === 1 && !hook.watch('BPLID')) {
      toastRef.current?.open();
      return;
    }

    setTap(index)
  }

  const navigate = useNavigate()


  return <div className="w-full h-full p-6 flex flex-col gap-2">
    <div className="w-full flex gap-4">
      <h1>Inventory Transfer</h1>

      {edit && <Button
        variant="outlined"
        size="small"
        onClick={() => {
          hook.reset({
            DocDate: new Date().toISOString()?.split('T')[0],
            StockTransferLines: [],
            BPLID: undefined
          }, {
            keepDirtyValues: false,
            keepErrors: false,
            keepDirty: false,
            keepDefaultValues: false,
            keepIsSubmitted: false,
            keepIsValid: false,
            keepSubmitCount: false,
            keepTouched: false,
            keepValues: false
          })
          navigate(`/stock-control/inventory-transfer/create`)
        }}
        endIcon={<IoCreate />}
      >
        Create
      </Button>}

      {detail && <Button
        variant="outlined"
        size="small"
        onClick={() => {
          hook.reset({
            DocDate: new Date().toISOString()?.split('T')[0],
            StockTransferLines: [],
            BPLID: undefined
          }, {
            keepDirtyValues: false,
            keepErrors: false,
            keepDirty: false,
            keepDefaultValues: false,
            keepIsSubmitted: false,
            keepIsValid: false,
            keepSubmitCount: false,
            keepTouched: false,
            keepValues: false
          })
          navigate(`/stock-control/inventory-transfer/${hook.id}/edit`)
        }}
        endIcon={<IoCreate />}
      >
        Edit
      </Button>}

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


        {tap === 0 && <BasicInformation {...hook} edit={edit} />}
        {tap === 1 && <Contents {...hook} edit={edit} />}
      </div>


      <FormMessageModal ref={dialog} />
      <CustomToast ref={toastRef} />
      <GetInventoryTransferRequestModal ref={inventoryTransferRequestModalRef} onSelect={(e) => hook.onCopyFrom(e?.DocEntry)} />

      {!detail && <div className="sticky w-full bottom-4 md:bottom-0 md:p-3  mt-2 ">
        <div className="backdrop-blur-sm bg-white p-2 rounded-lg  z-[1000] flex justify-between gap-3 border drop-shadow-sm">

          <div className="flex ">
            {!edit && <LoadingButton
              size="small"
              sx={{ height: "25px" }}
              variant="outlined"
              style={{
                background: hook.watch('FromWarehouse') ? "#2D31AB" : '#DADADA',
                border: 'none'
              }}
              disableElevation
              disabled={!hook.watch('FromWarehouse')}
              onClick={() => inventoryTransferRequestModalRef.current?.onOpen(hook.watch('FromWarehouse'))}
            >
              <span className="px-3 text-[11px] py-1 text-white">
                Copy From
              </span>
            </LoadingButton>}
          </div>

          <div className="flex justify-end gap-3  items-center border">
            <div className="flex ">
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
                  (window.location.href = "/stock-control/inventory-transfer")
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
                loading={false}
                size="small"
                variant="contained"
                disableElevation
              >
                <span className="px-6 text-[11px] py-4 text-white">
                  {edit ? 'Update' : 'Add'}
                </span>
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>}
    </form>
  </div>
}






