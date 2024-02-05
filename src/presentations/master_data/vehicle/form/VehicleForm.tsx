import React, { useState, useCallback } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
  useWatch,
} from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import General from "../component/General";
import SpecDetail from "../component/SpecDetail";
import Engine from "../component/Engine";
import Tyres from "../component/Tyres";
import Commercial from "../component/Commercial";
import Compartment from "../component/Compartment";
import { useParams } from "react-router-dom";
let dialog = React.createRef<FormMessageModal>();
export type UseFormProps = {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  useWatch?: any;
  control?: any;
  defaultValues?:
    | Readonly<{
        [x: string]: any;
      }>
    | undefined;
  setBranchAss?: any;
  branchAss?: any;
  header?: any;
  setHeader?: any;
  detail?: boolean;
  setIsChecked?: any;
  isChecked?: any;
};
// const { id } = useParams();
const VehicleForm = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,

    formState: { errors, defaultValues },
  } = useForm();
  const { id }: any = useParams();
  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
    showCollapse: true,
    DocNum: id,
  });
  const [header, setHeader] = useState({
    code: null,
    name: null,
    number: null,
    model: null,
    owner: null,
    base: null,
    status: "tYES",
  });

  const [vehicle, setVehicle] = React.useState<any>();

  const commers = vehicle?.TL_VH_COMMERCIALCollection;
  const comparts = vehicle?.TL_VH_COMPARTMENTCollection;
  const [commer, setCommer] = useState(commers ?? []);
  const [compart, setCompart] = useState<any[]>(comparts ?? []);

  React.useEffect(() => {
    if (vehicle && commers && comparts) {
      reset({ ...vehicle });
      setCommer(commers);
      setCompart(comparts);
    }
  }, [vehicle, commers, comparts]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `TL_VEHICLE('${id}')`)
        .then((res: any) => {
          setVehicle(res?.data);
          setState({
            ...state,
            loading: false,
          });
        })
        .catch((err: any) =>
          setState({ ...state, isError: true, message: err.message })
        );
    }
  };
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (e: any) => {
    const data: any = Object.fromEntries(
      Object.entries(e).filter(
        ([key, value]): any => value !== null && value !== undefined
      )
    );
    if (!commer || commer.length === 0) {
      // Alert the user if commer is an empty array
      dialog.current?.error(
        "Please provide at least one item in commercial." ??
          "Oops something wrong!",
        "Invalid Value"
      );
      return;
    }
    let missingField: any = null;

    const isCommercialValid = commer?.every((e: any) => {
      const requiredFields = [
        "U_Type",
        "U_Name",
        "U_IssueDate",
        "U_ExpiredDate",
        "U_Fee",
        "U_Ref",
      ];

      missingField = requiredFields.find(
        (field) =>
          e[field] === null || e[field] === "" || e[field] === undefined
      );

      return !missingField;
    });

    if (!isCommercialValid) {
      if (missingField) {
        // Map specific values for missingField
        const fieldMap: any = {
          U_Type: "Type",
          U_Name: "Name",
          U_IssueDate: "Issue Date",
          U_ExpiredDate: "Expired Date",
          U_Fee: "Fee",
          U_Ref: "	Reference",
        };

        // Replace missingField with the mapped value or keep the original value
        const displayField = fieldMap[missingField] || missingField;

        dialog.current?.error(
          `${displayField} is required` ?? "Oops something wrong!",
          "Invalid Value"
        );
      }
      return;
    }

    if (!compart || compart.length === 0) {
      // Alert the user if commer is an empty array
      dialog.current?.error(
        "Please provide at least one item in compartment." ??
          "Oops something wrong!",
        "Invalid Value"
      );
      return;
    }
    let missingFieldP: any = null;

    const isCompartValid = compart?.every((e: any) => {
      const requiredFields = [
        "U_CM_NO",
        "U_VOLUME",
        "U_TOP_HATCH",
        "U_BOTTOM_HATCH",
      ];

      missingFieldP = requiredFields.find(
        (field) =>
          e[field] === null || e[field] === "" || e[field] === undefined
      );

      return !missingFieldP;
    });

    if (!isCompartValid) {
      if (missingFieldP) {
        const fieldMap: any = {
          U_CM_NO: "Compart. No",
          U_VOLUME: "Volume",
          U_TOP_HATCH: "Top Hatch",
          U_BOTTOM_HATCH: "	Bottom Hatch ",
        };

        // Replace missingField with the mapped value or keep the original value
        const displayField = fieldMap[missingFieldP] || missingFieldP;
        dialog.current?.error(
          `${displayField} is required` ?? "Oops something wrong!",
          "Invalid Value"
        );
      }
      return;
    }
    const payload = {
      ...data,
      // U_UnderMaintenance: isChecked ? "YES" : "No",
      TL_VH_COMMERCIALCollection: commer?.map((e: any) => {
        return {
          U_IssueDate: e?.U_IssueDate,
          U_ExpiredDate: e?.U_ExpiredDate,
          U_Type: e?.U_Type,
          U_Name: e?.U_Name,
          U_Fee: e?.U_Fee,
          U_Ref: e?.U_Ref,
        };
      }),
      TL_VH_COMPARTMENTCollection: compart?.map((e: any) => {
        return {
          U_CM_NO: e?.U_CM_NO,
          U_TOP_HATCH: e?.U_TOP_HATCH,
          U_VOLUME: e?.U_VOLUME,
          U_BOTTOM_HATCH: e?.U_BOTTOM_HATCH,
        };
      }),
    };

    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/TL_VEHICLE('${id}')`, payload)
          .then(
            (res: any) =>
              dialog.current?.success("Update Successfully.", res?.data?.Code)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/TL_VEHICLE", payload)
          .then(
            (res: any) =>
              dialog.current?.success("Create Successfully.", res?.data?.Code)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setState({ ...state, isSubmitting: false });
    }
  };
  const handlerChangeMenu = useCallback(
    (index: number) => {
      setState((prevState) => ({
        ...prevState,
        tapIndex: index,
      }));
    },
    [state]
  );

  const HeaderTaps = () => {
    return (
      <>
        <MenuButton
          active={state.tapIndex === 0}
          onClick={() => handlerChangeMenu(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 1}
          onClick={() => handlerChangeMenu(1)}
        >
          Spec Detail
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Engine / Transmission
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 3}
          onClick={() => handlerChangeMenu(3)}
        >
          Tyres
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 4}
          onClick={() => handlerChangeMenu(4)}
        >
          Commercial
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 5}
          onClick={() => handlerChangeMenu(5)}
        >
          Compartment
        </MenuButton>
        {/* ... Other menu buttons ... */}
      </>
    );
  };

  const Left = ({ header, data }: any) => {
    return (
      <div className="w-[100%] mt-0 pl-[25px] h-[170px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">Vehicle Code </span>
          </div>
          <div>
            <span className="">Vehicle Name </span>
          </div>
          <div>
            <span className="">Plate Number </span>
          </div>
          <div>
            <span className="">Model</span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span>{data?.Code || header?.code || "_"}</span>
          </div>
          <div>
            <span>{data?.Name || header?.name || "_"}</span>
          </div>
          <div>
            <span>{data?.U_PlateNumber || header?.number || "_"}</span>
          </div>
          <div>
            <span>{data?.U_Model || header?.model || "_"}</span>
          </div>
        </div>
      </div>
    );
  };
  const Right = ({ header, data }: any) => {
    const branchAss: any = useQuery({
      queryKey: ["branchAss"],
      queryFn: () => new BranchBPLRepository().get(),
      staleTime: Infinity,
    });
    return (
      <div className="w-[100%] h-[165px] mt-0 flex py-5 px-4">
        <div className="w-[55%] text-[15px] text-gray-500 flex items-end flex-col h-full">
          <div>
            <span className="mr-10 mb-[18px] inline-block">Ownership</span>
          </div>
          <div>
            <span className="mr-10 mb-[18px] inline-block">Base Station</span>
          </div>
          <div>
            <span className="mr-10">Status</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div>
            <span className="mb-[18px] inline-block">
              {data?.U_Owner || header?.owner || "_"}
            </span>
          </div>
          <div className="mb-[18px] inline-block">
            <span>{data?.U_BaseStation || header?.base || "_"}</span>
          </div>
          <div>
            <span>
              {data?.U_Status || header?.status == "tYES"
                ? "Active"
                : "Inactive" || "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const onInvalidForm = (invalids: any) => {
    dialog.current?.error(
      invalids[Object.keys(invalids)[0]]?.message?.toString() ??
        "Oop something wrong!",
      "Invalid Value"
    );
  };
  return (
    <>
      {state.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <>
          <DocumentHeaderComponent
            data={state}
            menuTabs={<HeaderTaps />}
            HeaderCollapeMenu={
              <>
                <Left header={header} data={vehicle} />
                <Right header={header} data={vehicle} />
                {/* <TotalSummaryRightSide data={this.state} /> */}
              </>
            }
            leftSideField={undefined}
            rightSideField={undefined}
          />
          <Backdrop
            sx={{
              color: "#fff",
              backgroundColor: "rgb(251 251 251 / 60%)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={state.isSubmitting}
          >
            <CircularProgress />
          </Backdrop>
          <FormMessageModal ref={dialog} />
          <form
            id="formData"
            className="h-full w-full flex flex-col gap-4 relative"
            onSubmit={handleSubmit(onSubmit, onInvalidForm)}
          >
            {state.tapIndex === 0 && (
              <h1>
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                  setIsChecked={setIsChecked}
                  isChecked={isChecked}
                  useWatch={useWatch}
                />
              </h1>
            )}
            {state.tapIndex === 1 && (
              <h1>
                <SpecDetail
                  setValue={setValue}
                  header={header}
                  setHeader={setHeader}
                  register={register}
                  control={control}
                  defaultValues={defaultValues}
                />
              </h1>
            )}
            {state.tapIndex === 2 && (
              <h1>
                <Engine
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                />
              </h1>
            )}
            {state.tapIndex === 3 && (
              <h1>
                <Tyres
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                />
              </h1>
            )}
            {state.tapIndex === 4 && (
              <div className="m-5">
                <Commercial
                  commer={commer}
                  control={control}
                  setCommer={setCommer}
                  data={vehicle}
                />
              </div>
            )}
            {state.tapIndex === 5 && (
              <div className="m-5">
                <Compartment
                  compart={compart}
                  setCompart={setCompart}
                  control={control}
                  data={vehicle}
                  detail={props?.detail}
                />
              </div>
            )}
            {/* ... Other form fields ... */}
            <div className="absolute w-full bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
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
                      (window.location.href = "/master-data/vehicle")
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
                    loading={state.isSubmitting}
                    size="small"
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      {props.edit ? "Update" : "Add"}
                    </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default VehicleForm;
