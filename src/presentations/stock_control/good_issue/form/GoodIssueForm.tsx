import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import request from "@/utilies/request";
import { useNavigate, useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import General from "../components/General";
import Content from "../components/Content";
import Tabar from "../components/Tabar";
import CustomToast from "@/components/modal/CustomToast";
let dialog = React.createRef<FormMessageModal>();
let toastRef = React.createRef<CustomToast>();

export type UseFormProps = {
  register?: UseFormRegister<FieldValues>;
  setValue?: UseFormSetValue<FieldValues>;
  control?: any;
  defaultValues?: any;
  setBranchAss?: any;
  branchAss?: any;
  header?: any;
  setHeader?: any;
  detail?: boolean;
  watch: UseFormWatch<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  reset: any;
};
const GoodIssueForm = (props: any) => {
  const { handleSubmit, register, setValue, control, reset, getValues, watch } =
    useForm({
      defaultValues: {
        DocDate: new Date()?.toISOString()?.split("T")[0],
        TaxDate: new Date()?.toISOString()?.split("T")[0],
      } as any,
    });
  const route = useNavigate();
  const { id }: any = useParams();

  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
    showCollapse: true,
    DocNum: 0,
  });

  const onSubmit = async (payload: any) => {
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/InventoryGenExits(${id})`, payload)
          .then((res: any) =>
            dialog.current?.success("Update Successfully.", res?.data?.DocEntry)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/InventoryGenExits", payload)
          .then((res: any) =>
            dialog.current?.success("Create Successfully.", res?.data?.DocEntry)
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
    if (
      !getValues("BPL_IDAssignedToInvoice") ||
      getValues("BPL_IDAssignedToInvoice") === ""
    ) {
      toastRef.current?.open();
      return;
    }
    if (!getValues("U_tl_whsdesc") || getValues("U_tl_whsdesc") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("Series") || getValues("Series") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("TaxDate") || getValues("TaxDate") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("U_tl_gitype") || getValues("U_tl_gitype") === "") {
      toastRef.current?.open();
      return;
    }

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
  useEffect(() => {
    if (!id) return;
    setState({
      ...state,
      loading: true,
    });
    request("GET", `InventoryGenExits(${id})`)
      .then((res: any) => {
        setState({
          ...state,
          loading: false,
          DocNum: res?.data?.DocNum,
        });
        reset({ ...res.data }, { keepValues: false });
      })
      .catch((e: any) => {
        setState({
          ...state,
          loading: false,
        });
        dialog.current?.error(e?.message);
      });
  }, [id]);

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
          <CustomToast ref={toastRef} />
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
                  setValue={setValue}
                  reset={reset}
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
                  setValue={setValue}
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
                    onClick={() => route("/stock-control/good-issue")}
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

export default GoodIssueForm;
