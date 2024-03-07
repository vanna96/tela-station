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
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import BasicInformation from "../components/BasicInformation";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import { useTransferRequestHook } from "../hook/useTransferRequestHook";
import CustomToast from "@/components/modal/CustomToast";
import ContentsForm from "../components/Contents";
import Contents from "../components/Contents";

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
  detail?: boolean;
  edit?: boolean;
  data?: any;
  watch: UseFormWatch<FieldValues>;
  serie?: any;
  getValues: UseFormGetValues<FieldValues>;
};
// const { id } = useParams();
const InventoryTransferRequestForm = (props: any) => {
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

  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("itr-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "1250000001",
      });
      props?.query?.set("itr-series", seriesList);
    }
    setSerie(seriesList);

    console.log(seriesList);
    
  };


  
  const [transferR, setTransferR] = React.useState<any>();
  const [serie, setSerie] = useState([]);

  useEffect(() => {
    fethSeries();
    fetchData();
  }, []);

  const items = transferR?.TL_VH_COMMERCIALCollection;
  const [item, setItem] = useState<any[]>(items);

  React.useEffect(() => {
    if (item && items) {
      reset({ ...transferR });
      setItem(item);
    }
  }, [transferR, items]);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `InventoryTransferRequests(${id})`)
        .then((res: any) => {
          setTransferR(res?.data);
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

  const isNextTap = (tapIndex: number) => {
    // if (!getValues("DepositCurrency") || getValues("DepositCurrency") === "") {
    //   toastRef.current?.open();
    //   return;
    // }
    // if (!getValues("BPLID") || getValues("BPLID") === "") {
    //   toastRef.current?.open();
    //   return;
    // }
    // if (!getValues("DepositAccount") || getValues("DepositAccount") === "") {
    //   toastRef.current?.open();
    //   return;
    // }
    // if (!getValues("U_tl_busi") || getValues("U_tl_busi") === "") {
    //   toastRef.current?.open();
    //   return;
    // }

    handlerChangeMenu(tapIndex);
  };

  const {
    onSubmit,
    onInvalidForm,
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
  } = useTransferRequestHook({ props, state, setState, id, dialog });

  const HeaderTaps = () => {
    return (
      <>
        <MenuButton active={state.tapIndex === 0} onClick={() => isNextTap(0)}>
          Basic Information
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 1}
          onClick={() => {
            isNextTap(1);
            // setValue("DepositType", "dtChecks");
            // setValue("TotalLC", undefined);
          }}
        >
          Contents
        </MenuButton>
      </>
    );
  };

  React.useEffect(() => {
    if (transferR) {
      reset({ ...transferR });
    }
  }, [transferR]);

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
              <div className="grow">
                <BasicInformation
                  register={register}
                  setValue={setValue}
                  control={control}
                  serie={serie}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}

            {state.tapIndex === 1 && (
              <div className="grow">
                <Contents
                  register={register}
                  item={item}
                  control={control}
                  setItem={setItem}
                  data={transferR}
                  setValue={setValue}
                />
              </div>
            )}
            <div className="sticky w-full  bottom-4 md:bottom-0 md:p-3  mt-2 p-3">
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

export default InventoryTransferRequestForm;
