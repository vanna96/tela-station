import MUIDatePicker from "@/components/input/MUIDatePicker"
import MUITextField from "@/components/input/MUITextField"
import MUISelect from "@/components/selectbox/MUISelect"
import { LoadingButton } from "@mui/lab"
import { Checkbox } from "@mui/material"
import React, { useMemo, useState } from "react"
import { useFuelLevelFormHook } from "../hook/useFuelLevelFormHook"
import { Controller } from "react-hook-form"
import shortid from "shortid"
import FormMessageModal from "@/components/modal/FormMessageModal"
import CustomToast from "@/components/modal/CustomToast"

let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();

export const FuelLevelForm = () => {
  const [tap, setTap] = useState<number>(0)
  const hook = useFuelLevelFormHook();

  const onChangeTap = (index: number) => {

    if (index === 1 && !hook.watch('U_BPLId')) {
      toastRef.current?.open();
      return;
    }

    setTap(index)
  }

  console.log(hook.watch('U_DocDate'))

  return <div className="w-full h-full p-6 flex flex-col gap-2">
    <div className="w-full flex">
      <h1>Fuel Level Test</h1>
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
        {tap === 0 && <General {...hook} />}
        {tap === 1 && <Content {...hook} />}
      </div>


      <FormMessageModal ref={dialog} />
      <CustomToast ref={toastRef} />

      <div className="sticky w-full bottom-4 md:bottom-0 md:p-3  mt-2 ">
        <div className="backdrop-blur-sm bg-white p-2 rounded-lg  z-[1000] flex justify-end gap-3 border drop-shadow-sm">
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
                (window.location.href = "/stock-control/fuel-level")
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
                Add
              </span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </form>
  </div>
}



const General = (props: any) => {
  return <div className="grid grid-cols-2 lg:grid-cols-1 gap-[8rem] lg:gap-4 xl:gap-[1rem] mt-4">
    <div>
      <div className="grid grid-cols-4 item-center justify-center  text-sm ">
        <label htmlFor="Code" className="text-gray-500 text-[14px] flex items-center gap-1">
          Branch <span className="text-red-500">*</span>
        </label>
        <div className="col-span-3">
          <Controller
            name="U_IssueDate"
            control={props?.control}
            render={({ field }) => {
              return (
                <MUISelect
                  value={field.value}
                  items={[{ Code: 1, Name: '20000 - Tela Head Office' }]}
                  aliaslabel="Name"
                  aliasvalue="Code"
                  onChange={(val) => console.log(val)}
                />
              );
            }}
          />
        </div>
      </div>
    </div>

    {/*  */}
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap- item-center justify-center  text-sm ">
        <label htmlFor="Code" className="text-gray-500 text-[14px] flex items-center gap-1">
          Series <span className="text-red-500">*</span>
        </label>
        <div className="col-span-3 grid grid-cols-2 items-center gap-2">
          <MUISelect items={[]} />
          <MUITextField disabled={true} />
        </div>
      </div>

      <div className="grid grid-cols-4 item-center justify-center  text-sm ">
        <label htmlFor="Code" className="text-gray-500 text-[14px] flex items-center gap-1">
          Document Date  <span className="text-red-500">*</span>
        </label>
        <div className="col-span-3">
          <Controller
            name="U_IssueDate"
            control={props?.control}
            render={({ field }) => {
              return (
                <MUIDatePicker
                  {...field}
                  value={props?.watch('U_DocDate') ?? ''}
                  onChange={(e: any) => {
                    const val =
                      e.toLowerCase() ===
                        "Invalid Date".toLocaleLowerCase()
                        ? ""
                        : e;
                    props?.setValue('U_DocDate', val)
                  }}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  </div>
}

const Content = (props: any) => {
  const [selected, setSelected] = useState<number[]>([])

  const lines: any[] = useMemo(() => {
    if (!props?.watch('Collections')) return []


    return props?.watch('Collections');
  }, [props?.watch('Collections')])


  const onAddCollection = () => {
    const state = [...lines,
    {
      U_WhsCode: undefined,
      U_BinCode: undefined,
      U_Volume: undefined,
      U_Qty: undefined,
      U_Remark: undefined,
    }
    ];

    props?.setValue('Collections', state)
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let state = [...selected];
    if (selected.includes(index)) {
      state = state.filter((e) => e !== index)
    } else {
      state.push(index)
    }

    setSelected(state)
  }

  const handlerDelete = () => {
    if (selected.length === 0) return;
    let state = [...lines];
    state = state.filter((item, index) => !selected.includes(index));
    props?.setValue('Collections', state);
    setSelected([])
  };


  const onChangeValue = (index: number, field: string, value: any) => {
    const state: any[] = [...lines ?? []];
    state[index][field] = value;
    props?.setValue('Collections', state);
  }


  return <div className="grow w-full h-full mt-8">
    <div className="border p-2 text-[15px] flex flex-col gap-4  w-full">
      <div className="w-full flex justify-end ">
        <div role="button" onClick={handlerDelete} className=" px-4 py-1 rounded-[4px] hover:bg-gray-100 text-red-500 border">Remove</div>
      </div>

      <div className="w-full   overflow-auto">
        <table className="w-full border table table-fixed p-2 lg:w-[60rem] ">
          <thead className="text-sm font-thin">
            <tr className="border">
              <th className="w-[4rem]"></th>
              <th className="p-2 font-thin text-left">Warehouse Code <span className="text-red-500">*</span></th>
              <th className="p-2 font-thin text-left">Bin Code <span className="text-red-500">*</span></th>
              <th className="w-[12rem] p-2 font-thin text-left">Volumn <span className="text-red-500">*</span></th>
              <th className="w-[12rem] p-2 font-thin text-left">Qty <span className="text-red-500">*</span></th>
              <th className="p-2 font-thin text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && <tr>
              <td colSpan={6} className="text-center p-10 text-gray-500">
                No records.
              </td>
            </tr>}
            {lines.map((row, index: number) => <tr key={shortid.generate()}>
              <td className="p-2 flex justify-center"><Checkbox checked={selected.includes(index)} onChange={(e) => onSelectChange(e, index)} /></td>
              <td className="p-2 w-full"><MUISelect items={[]} /></td>
              <td className="p-2"><MUISelect items={[]} /></td>
              <td className="p-2">
                <MUITextField type="number" inputProps={{
                  defaultValue: row?.U_Volume,
                  onBlur: (e) => onChangeValue(index, 'U_Volume', e.target.value)
                }} /></td>
              <td className="p-2">
                <MUITextField type="number"
                  inputProps={{
                    defaultValue: row?.U_Qty,
                    onBlur: (e) => onChangeValue(index, 'U_Qty', e.target.value)
                  }}
                /></td>
              <td className="p-2"><MUITextField
                inputProps={{
                  defaultValue: row?.U_Remrk,
                  onBlur: (e) => onChangeValue(index, 'U_Remrk', e.target.value)
                }} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-start ">
        <div role="button" onClick={onAddCollection} className="px-10 py-1 rounded-[4px] hover:bg-gray-100  border">Add</div>
      </div>
    </div>
  </div>
}

