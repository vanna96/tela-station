import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
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
import CustomToast from "@/components/modal/CustomToast";

let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();

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
  detail?: boolean;
  watch: UseFormWatch<FieldValues>;
  getValues: UseFormGetValues<FieldValues>
};
// const { id } = useParams();
const Form = (props: any) => {
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

  const onSubmit = async (e: any) => {
    const data: any = Object.fromEntries(
      Object.entries(e).filter(
        ([key, value]): any => value !== null && value !== undefined
      )
    );
    const fullName = `${getValues("FirstName")} ${getValues("LastName")}`;
    const payload = {
      ...data,
      U_tl_driver: "Y",
      U_tl_name: fullName,
      HomeCountry: "KH",
      EmployeeBranchAssignment: branchAss?.map((e: any) => {
        return {
          BPLID: e?.BPLID,
        };
      }),
    };
    const { id } = props?.match?.params || 0;
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/EmployeesInfo(${id})`, payload)
          .then((res: any) =>
            dialog.current?.success(
              "Update Successfully.",
              res?.data?.EmployeeID
            )
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/EmployeesInfo", payload)
          .then((res: any) =>
            dialog.current?.success(
              "Create Successfully.",
              res?.data?.EmployeeID
            )
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
  const isNextTap = (tapIndex: number) => {

    if (!getValues("FirstName") || getValues("FirstName") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("LastName") || getValues("LastName") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("EmployeeCode") || getValues("EmployeeCode") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("BPLID") || getValues("BPLID") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("U_tl_terminal") || getValues("U_tl_terminal") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("StartDate") || getValues("StartDate") === "") {
      toastRef.current?.open();
      return
    };
    if (!getValues("Position") || getValues("Position") === "") {
      toastRef.current?.open();
      return
    };

    handlerChangeMenu(tapIndex);
  };

  const HeaderTaps = () => {
    return (
      <>
        <MenuButton active={state.tapIndex === 0} onClick={() => isNextTap(0)}>
          General
        </MenuButton>
        <MenuButton active={state.tapIndex === 1} onClick={() => isNextTap(1)}>
          Address
        </MenuButton>
        <MenuButton active={state.tapIndex === 2} onClick={() => isNextTap(2)}>
          Personal
        </MenuButton>
        <MenuButton active={state.tapIndex === 3} onClick={() => isNextTap(3)}>
          Finance
        </MenuButton>
        <MenuButton active={state.tapIndex === 4} onClick={() => isNextTap(4)}>
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

  const onInvalidForm = (invalids: any) => {
    dialog.current?.error(
      invalids[Object.keys(invalids)[0]]?.message?.toString() ??
      "Oop something wrong!",
      "Invalid Value"
    );
  };
  return (
    <>
      <CustomToast ref={toastRef} />
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
            onSubmit={handleSubmit(onSubmit, onInvalidForm)}
          >
            {state.tapIndex === 0 && (
              <div className="grow">
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  header={header}
                  setHeader={setHeader}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow">
                <Address
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 2 && (
              <div className="grow">
                <Personal
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 3 && (
              <div className="grow">
                <Finance
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 4 && (
              <div className="grow">
                <Remarks
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {/* ... Other form fields ... */}
            <div className="sticky bottom-4  mt-2 ">
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
                      (window.location.href = "/master-data/driver")
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

export default withRouter(Form);
