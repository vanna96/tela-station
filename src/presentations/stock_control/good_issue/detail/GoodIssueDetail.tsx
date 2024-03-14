import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import MenuButton from "@/components/button/MenuButton";
import request from "@/utilies/request";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import General from "../components/General";
import Content from "../components/Content";
import Tabar from "../components/Tabar";
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
const GoodIssueDetail = (props: any) => {
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
const { id } = useParams();

  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
    showCollapse: true,
    DocNum: 0,
  });

  const [issue, setIssue] = React.useState<any[]>([]);


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
      await request("GET", `InventoryGenExits(${id})`)
        .then((res: any) => {
           setIssue(res?.data);
           setState({
             ...state,
             loading: false,
             DocNum: res?.data?.DocNum,
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
  const isNextTap = (tapIndex: number) => {

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
    if (issue) {
      reset({ ...issue });
    }
  }, [issue]);

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
          >
            {state.tapIndex === 0 && (
              <div className="grow">
                <General
                  detail={props?.detail}
                  register={register}
                  getValues={getValues}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow">
                <Content
                  detail={props?.detail}
                  register={register}
                  getValues={getValues}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />{" "}
              </div>
            )}

            {/* ... Other form fields ... */}
          </form>
        </>
      )}
    </>
  );
};

export default GoodIssueDetail;
