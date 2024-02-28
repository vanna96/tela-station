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
import BasicInformation from "../components/BasicInformation";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import Checks from "../components/Checks";
import Cash from "../components/Cash";

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
  detail?: boolean;
  data?: any;
  watch: UseFormWatch<FieldValues>;
  serie?: any;
  getValues: UseFormGetValues<FieldValues>;
};
// const { id } = useParams();
const DepositForm = (props: any) => {
  const {
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
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
  // const [header, setHeader] = useState({
  //   firstName: null,
  //   lastName: null,
  //   gender: null,
  //   department: null,
  //   branch: null,
  // });

  const [branchAss, setBranchAss] = useState([]);
  const [deposit, setDeposit] = React.useState<any>();
  const [serie, setSerie] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `Deposits(${id})`)
        .then((res: any) => {
          setDeposit(res?.data);
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
    const { id } = props?.match?.params || 0;
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/Deposits(${id})`)
          .then((res: any) =>
            dialog.current?.success("Update Successfully.", res?.data?.AbsEntry)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/Deposits")
          .then((res: any) =>
            dialog.current?.success("Create Successfully.", res?.data?.AbsEntry)
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
          Basic Information
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 1}
          onClick={() => handlerChangeMenu(1)}
        >
          Checks
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Cash
        </MenuButton>
      </>
    );
  };

  React.useEffect(() => {
    if (deposit) {
      reset({ ...deposit });
    }
  }, [deposit]);

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
                {/* <Left header={header} data={driver} /> */}
                {/* <Right header={header} data={driver} /> */}
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
                <BasicInformation
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  serie={serie}
                    watch={watch}
                    getValues={getValues}
                
                />
              </h1>
            )}
             {state.tapIndex === 1 && (
              <h1>
                <Checks
                  watch={watch}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  getValues={getValues}
                />
              </h1>
            )}
             {state.tapIndex === 2 && (
              <h1>
                <Cash
                  getValues={getValues}
                  watch={watch}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                />
              </h1>
            )}
            <div className="absolute w-full bottom-4  mt-2 ">
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
                    onClick={() => (window.location.href = "/banking/deposit")}
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

export default withRouter(DepositForm);
