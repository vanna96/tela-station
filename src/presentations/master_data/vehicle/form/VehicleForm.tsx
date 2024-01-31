import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { withRouter } from "@/routes/withRouter";
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";

import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import Address from "../component/SpecDetail";
import General from "../component/General";
import Personal from "../component/Engine";
import Finance from "../component/Tyres";
import Remarks from "../component/Commercial";
import SpecDetail from "../component/SpecDetail";
import Engine from "../component/Engine";
import Tyres from "../component/Tyres";
import Commercial from "../component/Commercial";
import Compartment from "../component/Compartment";
let dialog = React.createRef<FormMessageModal>();
export type UseFormProps = {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
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
  const { id }: any = props?.match?.params || 0;

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
    firstName: null,
    lastName: null,
    gender: null,
    department: null,
    branch: null,
  });

  const [branchAss, setBranchAss] = useState([]);
  const [vehicle, setVehicle] = React.useState<any>();
  React.useEffect(() => {
     fetchData();
    if (vehicle) {
      reset({ ...vehicle });
    }
  }, [vehicle]);


  const arr = vehicle?.TL_VH_COMMERCIALCollection;
  const [commer, setCommer] = useState<any[]>([arr]);



  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `TL_VEHICLE(${id})`)
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

  const onSubmit = async (e: any) => {
    const data: any = Object.fromEntries(
      Object.entries(e).filter(
        ([key, value]): any => value !== null && value !== undefined
      )
    );
    const payload = {
      ...data,
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
    };
    const { id } = props?.match?.params || 0;
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/TL_VEHICLE(${id})`, payload)
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
      console.log(error);
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
          Spac Detail
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
      <div className="w-[100%] mt-2 pl-[25px] h-[150px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">First Name </span>
          </div>
          <div>
            <span className="">Last Name </span>
          </div>
          <div>
            <span className="">Gender </span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span>{data?.FirstName || header?.firstName || "_"}</span>
          </div>
          <div>
            <span>{data?.LastName || header?.lastName || "_"}</span>
          </div>
          <div>
            <span>
              {data?.Gender?.replace("gt_", "") ||
                header?.gender?.replace("gt_", "") ||
                "_"}
            </span>
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
      <div className="w-[100%] h-[150px] mt-2 flex py-5 px-4">
        <div className="w-[55%] text-[15px] text-gray-500 flex items-end flex-col h-full">
          <div>
            <span className="mr-10 mb-[27px] inline-block">Department</span>
          </div>
          <div>
            <span className="mr-10">Branch</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div>
            <span className="mb-[27px] inline-block">
              {new DepartmentRepository()?.find(data?.Department)?.Name ||
                header?.department ||
                "_"}
            </span>
          </div>
          <div>
            <span>
              {branchAss?.data?.find((e: any) => e?.BPLID === data?.BPLID)
                ?.BPLName ||
                header?.branch ||
                "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // console.log(state)

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
            onSubmit={handleSubmit(onSubmit)}
          >
            {state.tapIndex === 0 && (
              <h1>
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  header={header}
                  setHeader={setHeader}
                />
              </h1>
            )}
            {state.tapIndex === 1 && (
              <h1>
                <SpecDetail setValue={setValue} register={register} />
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
                  commer={commer}
                  control={control}
                  setCommer={setCommer}
                  data={vehicle}
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
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-3 text-[11px] py-1 text-white">
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
                      {props.edit ? "Update" : "Save"}
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
