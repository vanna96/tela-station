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
import GeneralForm from "../components/General";
let dialog = React.createRef<FormMessageModal>();
export type UseFormProps = {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  control?: any;
  edit?: boolean;
  detail: boolean;
  defaultValues?:
    | Readonly<{
        [x: string]: any;
      }>
    | undefined;
};
const StopsForm = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    formState: { errors, defaultValues },
  } = useForm();

  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
  });

  const [stop, setStop] = React.useState<any>();

  useEffect(() => {
    // Fetch initial data if needed
    fetchData();
  }, []);

  const fetchData = async () => {
    const { id }: any = props?.match?.params || 0;
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `TL_STOPS('${id}')`)
        .then((res: any) => {
          setStop(res?.data);
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
        ([key, value]): any =>
          value !== "" && value !== null && value !== undefined
      )
    );
    const payload = {
      ...data,
    };

    const { id } = props?.match?.params || 0;
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request("PATCH", `/TL_STOPS('${id}')`, payload)
          .then((res: any) =>
            dialog.current?.success("Update Successfully.", res?.data?.Code)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/TL_STOPS", payload)
          .then(async (res: any) => {
            if ((res && res.status === 200) || 201) {
              const docEntry = res.data.Code;
              dialog.current?.success("Create Successfully.", docEntry);
            } else {
              console.error("Error in POST request:", res.statusText);
            }
          })
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
      </>
    );
  };

  React.useEffect(() => {
    if (stop) {
      reset({ ...stop });
    }
  }, [stop]);
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
          {/* <DocumentHeaderComponent data={state} menuTabs={<HeaderTaps />} leftSideField={undefined} rightSideField={undefined} /> */}
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
                <GeneralForm
                  detail={props.detail}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  edit={props?.edit}
                />
              </h1>
            )}
            {/* ... Other form fields ... */}
            <div className="absolute w-full bottom-4 mt-2">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex gap-3 border drop-shadow-sm">
                <div className="flex ml-auto">
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
                      (window.location.href = "/master-data/stops")
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
                    <span className="px-5 text-[11px] py-4 text-white">
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

export default withRouter(StopsForm);
