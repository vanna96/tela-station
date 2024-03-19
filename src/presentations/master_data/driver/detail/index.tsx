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
import General from "../component/General";
import Address from "../component/Address";
import Personal from "../component/Personal";
import Finance from "../component/Finance";
import Remarks from "../component/Remaks";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
let dialog = React.createRef<FormMessageModal>();

// const { id } = useParams();
const FormDetail = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
    watch,
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
    DocNum: "",
  });
  const [header, setHeader] = useState({
    firstName: null,
    lastName: null,
    gender: null,
    department: null,
    branch: null,
  });

  const [branchAss, setBranchAss] = useState([]);
  const [driver, setDriver] = React.useState<any>();

  useEffect(() => {
    // Fetch initial data if needed
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `EmployeesInfo(${id})`)
        .then((res: any) => {
          setBranchAss(res?.data?.EmployeeBranchAssignment);
          setDriver(res?.data);
          setState({
            ...state,
            loading: false,
            DocNum: res?.data?.FirstName + " " + res?.data?.LastName,
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
          Address
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Personal
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 3}
          onClick={() => handlerChangeMenu(3)}
        >
          Finance
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 4}
          onClick={() => handlerChangeMenu(4)}
        >
          Remarks
        </MenuButton>

        {/* ... Other menu buttons ... */}
      </>
    );
  };

  React.useEffect(() => {
    if (driver) {
      reset({ ...driver });
    }
  }, [driver]);

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
            <span className="mr-10 mb-[27px] inline-block">Department </span>
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
                <Left header={header} data={driver} />
                <Right header={header} data={driver} />
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
                  watch={watch}
                  getValues={getValues}
                  detail={props?.detail}
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
                <Address
                  setValue={setValue}
                  register={register}
                  detail={props.detail}
                  watch={watch}
                  getValues={getValues}
                />
              </h1>
            )}
            {state.tapIndex === 2 && (
              <h1>
                <Personal
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                  detail={props?.detail}
                  watch={watch}
                  getValues={getValues}
                />
              </h1>
            )}
            {state.tapIndex === 3 && (
              <h1>
                <Finance
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  detail={props?.detail}
                  watch={watch}
                  getValues={getValues}
                />
              </h1>
            )}
            {state.tapIndex === 4 && (
              <h1>
                <Remarks
                  watch={watch}
                  getValues={getValues}
                  setValue={setValue}
                  detail={props?.detail}
                  register={register}
                />
              </h1>
            )}
            {/* ... Other form fields ... */}
          </form>
        </>
      )}
    </>
  );
};

export default withRouter(FormDetail);
