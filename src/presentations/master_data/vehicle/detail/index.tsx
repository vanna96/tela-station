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
import { useParams } from "react-router-dom";
let dialog = React.createRef<FormMessageModal>();

// const { id } = useParams();
const VehicleDetail = (props: any) => {
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
  const [commer, setCommer] = useState<any[]>(commers);
  const [compart, setCompart] = useState<any[]>(comparts);

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
      <div className="w-[100%] mt-0 pl-[25px] h-[165px] flex py-5 px-4">
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
            <span className="mr-10 mb-[20px] inline-block">Ownership</span>
          </div>
          <div>
            <span className="mr-10 mb-[20px] inline-block">Base Station</span>
          </div>
          <div>
            <span className="mr-10">Status</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div>
            <span className="mb-[20px] inline-block">
              {data?.U_Owner || header?.owner || "_"}
            </span>
          </div>
          <div className="mb-[20px] inline-block">
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
                  detail={props?.detail}
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
                  detail={props?.detail}
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
                  detail={props?.detail}
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
                  detail={props?.detail}
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
                  detail={props?.detail}
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
          </form>
        </>
      )}
    </>
  );
};

export default VehicleDetail;
