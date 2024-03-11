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
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import Tabar from "../../good_issue/components/Tabar";
import General from "../components/General";
import Content from "../components/Content";
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
  detail?: boolean;
  watch: UseFormWatch<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
};
// const { id } = useParams();
const GoodReceiptForm = (props: any) => {
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
    // if (!getValues("FirstName") || getValues("FirstName") === "") return;
    // if (!getValues("LastName") || getValues("LastName") === "") return;
    // if (!getValues("EmployeeCode") || getValues("EmployeeCode") === "") return;
    // if (!getValues("BPLID") || getValues("BPLID") === "") return;
    // if (!getValues("U_tl_terminal") || getValues("U_tl_terminal") === "")
    //   return;
    // if (!getValues("StartDate") || getValues("StartDate") === "") return;
    // if (!getValues("Position") || getValues("Position") === "") return;

    handlerChangeMenu(tapIndex);
  };

  const HeaderTaps = () => {
    return (
      <>
        <MenuButton active={state.tapIndex === 0} onClick={() => isNextTap(0)}>
          General
        </MenuButton>
        <MenuButton active={state.tapIndex === 1} onClick={() => isNextTap(1)}>
          Content
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
          <Tabar data={state} menuTabs={<HeaderTaps />} />
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
                  getValues={getValues}
                  control={control}
                  watch={watch}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow">
                <Content
                  register={register}
                  getValues={getValues}
                  control={control}
                  watch={watch}
                />{" "}
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
                    // onClick={() =>
                    //   (window.location.href = "/master-data/driver")
                    // }
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

export default GoodReceiptForm;
