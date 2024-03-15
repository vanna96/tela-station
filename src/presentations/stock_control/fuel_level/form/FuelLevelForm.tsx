import MUIDatePicker from "@/components/input/MUIDatePicker"
import MUITextField from "@/components/input/MUITextField"
import MUISelect from "@/components/selectbox/MUISelect"
import { LoadingButton } from "@mui/lab"
import { Backdrop, Button, Checkbox, CircularProgress } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFuelLevelFormHook } from "../hook/useFuelLevelFormHook"
import { Controller } from "react-hook-form"
import shortid from "shortid"
import FormMessageModal from "@/components/modal/FormMessageModal"
import CustomToast from "@/components/modal/CustomToast"
import FuelLevelBranchAutoComplete from "../components/FuelLevelBranchAutoComplete"
import { useGetFuelLevelSeriesHook } from "../hook/useGetFuelLevelSeriesHook"
import FuelLevelWhsAutoComplete from "../components/FuelLevelWarehouseAutoComplete"
import FuelLevelWarehouseBinAutoComplete from "../components/FuelLevelWarehouseBinAutoComplete"
import { IoCreate } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import UomSelectByItem from "../components/UomSelectByItem"

let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();

export const FuelLevelForm = ({ edit = false }: { edit?: boolean }) => {
  const [tap, setTap] = useState<number>(0)
  const hook = useFuelLevelFormHook(edit, dialog);

  const onChangeTap = (index: number) => {

    if (index === 1 && !hook.watch('U_tl_bplid')) {
      toastRef.current?.open();
      return;
    }

    setTap(index)
  }

  const navigate = useNavigate()


  return <div className="w-full h-full p-6 flex flex-col gap-2">
    <div className="w-full flex gap-4">
      <h1>Fuel Level Test</h1>

      {edit && <Button
        variant="outlined"
        size="small"
        onClick={() => {
          hook.reset({
            U_tl_doc_date: new Date().toISOString()?.split('T')[0],
            TL_FUEL_LEVEL_LINESCollection: [],
            U_tl_bplid: undefined
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
          navigate(`/stock-control/fuel-level/create`)
        }}
        endIcon={<IoCreate />}
      >
        Create
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

        <UomSelectByItem item="LPG0001" onChange={(e) => console.log(e)} />

        {tap === 0 && <General {...hook} edit={edit} />}
        {tap === 1 && <Content {...hook} edit={edit} />}
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
                {edit ? 'Update' : 'Add'}
              </span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </form>
  </div>
}



const General = (props: any) => {

  // 
  const { series, defaultSerie } = useGetFuelLevelSeriesHook();

  useEffect(() => {
    if (props?.edit) return;

    if (!defaultSerie.data) return;

    console.log(defaultSerie)
    props?.setValue('Series', defaultSerie?.data?.Series);
    props?.setValue('DocNum', defaultSerie?.data?.NextNum);
  }, [defaultSerie.data])


  const onChangeSerie = useCallback((event: any) => {
    const serie = series.data?.find((e: any) => e?.Series === event?.target?.value);
    if (!serie) return;

    props?.setValue('Series', event?.target?.value);
    props?.setValue('DocNum', serie?.NextNumber);
  }, [series?.data])


  return <div className="grid grid-cols-2 lg:grid-cols-1 gap-[8rem] lg:gap-4 xl:gap-[1rem] mt-4">
    <div>
      <div className="grid grid-cols-4 item-center justify-center  text-sm ">
        <label htmlFor="Code" className="text-gray-500 text-[14px] flex items-center gap-1">
          Branch <span className="text-red-500">*</span>
        </label>
        <div className="col-span-3">
          <Controller
            name="U_tl_bplid"
            control={props?.control}
            render={({ field }) => {
              return (
                <FuelLevelBranchAutoComplete
                  value={props.watch('U_tl_bplid')}
                  onChange={(e) => props?.setValue('U_tl_bplid', e.BPLID)}
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
          <Controller
            name="Series"
            control={props?.control}
            render={({ field }) => {
              return (
                <MUISelect
                  value={field.value}
                  disabled={props?.edit}
                  items={series.data ?? []}
                  aliaslabel="Name"
                  aliasvalue="Series"
                  onChange={onChangeSerie}
                />
              );
            }}
          />
          <MUITextField key={props?.watch('DocNum')} value={props?.watch('DocNum')} disabled={true} />
        </div>
      </div>

      <div className="grid grid-cols-4 item-center justify-center  text-sm ">
        <label htmlFor="Code" className="text-gray-500 text-[14px] flex items-center gap-1">
          Document Date  <span className="text-red-500">*</span>
        </label>
        <div className="col-span-3">
          <Controller
            name="U_tl_doc_date"
            control={props?.control}
            render={({ field }) => {
              return (
                <MUIDatePicker
                  {...field}
                  value={props?.watch('U_tl_doc_date') ?? ''}
                  onChange={(e: any) => {
                    const val =
                      e.toLowerCase() ===
                        "Invalid Date".toLocaleLowerCase()
                        ? ""
                        : e;
                    props?.setValue('U_tl_doc_date', val)
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
    if (!props?.watch('TL_FUEL_LEVEL_LINESCollection')) return []


    return props?.watch('TL_FUEL_LEVEL_LINESCollection');
  }, [props?.watch('TL_FUEL_LEVEL_LINESCollection')])


  const onAddCollection = () => {
    const state = [...lines,
    {
      U_tl_whscode: undefined,
      U_tl_bincode: undefined,
      U_tl_volumn: undefined,
      U_tl_qty: undefined,
      U_tl_remark: undefined,
    }
    ];

    props?.setValue('TL_FUEL_LEVEL_LINESCollection', state)
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
    if (selected.length === 0) return; // [1,2,3,5]

    let state = [...lines];
    state = state.filter((item, index) => !selected.includes(index));
    props?.setValue('TL_FUEL_LEVEL_LINESCollection', state);
    setSelected([])
  };


  const onChangeValue = (index: number, field: string, value: any) => {
    const state: any[] = [...lines ?? []];
    state[index][field] = value;
    props?.setValue('TL_FUEL_LEVEL_LINESCollection', state);
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
              <th className="p-2 font-thin text-left w-[16rem]">Warehouse Code <span className="text-red-500">*</span></th>
              <th className="p-2 font-thin text-left w-[16rem]">Bin Code <span className="text-red-500">*</span></th>
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
              <td className="p-2 w-full">
                <Controller
                  name={`TL_FUEL_LEVEL_LINESCollection.${index}.U_tl_whscode`}
                  rules={{ required: `Warehouse on row ${index} is required.` }}
                  control={props?.control}
                  render={({ field }) => {
                    return <FuelLevelWhsAutoComplete value={row?.U_tl_whscode} onChange={(e) => onChangeValue(index, 'U_tl_whscode', e?.WarehouseCode)} />
                  }}
                />
              </td>
              <td className="p-2">
                <Controller
                  name={`TL_FUEL_LEVEL_LINESCollection.${index}.U_tl_bincode`}
                  rules={{ required: `Bin Code on row ${index} is required.` }}
                  control={props?.control}
                  render={({ field }) => {
                    return <FuelLevelWarehouseBinAutoComplete value={row?.U_tl_bincode} whsCode={row?.U_tl_whscode} onChange={(e) => onChangeValue(index, 'U_tl_bincode', e?.AbsEntry)} />
                  }}
                />
              </td>
              <td className="p-2">
                <Controller
                  name={`TL_FUEL_LEVEL_LINESCollection.${index}.U_tl_volumn`}
                  rules={{ required: `Volum on row ${index} is required.` }}
                  control={props?.control}
                  render={({ field }) => {
                    return <MUITextField
                      type="number"
                      inputProps={{
                        defaultValue: row?.U_tl_volumn,
                        onBlur: (e) => onChangeValue(index, 'U_tl_volumn', e.target.value)
                      }} />
                  }}
                />
              </td>
              <td className="p-2">
                <Controller
                  name={`TL_FUEL_LEVEL_LINESCollection.${index}.U_tl_qty`}
                  rules={{ required: `Quantity on row ${index} is required.` }}
                  control={props?.control}
                  render={({ field }) => {
                    return <MUITextField
                      type="number"
                      inputProps={{
                        defaultValue: row?.U_tl_qty,
                        onBlur: (e) => onChangeValue(index, 'U_tl_qty', e.target.value)
                      }}
                    />
                  }}
                />
              </td>
              <td className="p-2"><MUITextField
                inputProps={{
                  defaultValue: row?.U_Remrk,
                  onBlur: (e) => onChangeValue(index, 'U_tl_remark', e.target.value)
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

