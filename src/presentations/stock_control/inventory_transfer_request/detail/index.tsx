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
import BasicInformation from "../components/BasicInformation";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import BasicInformationDetail from "./BasicInformationDetail";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import { useTransferRequestHook } from "../hook/useTransferRequestHook";
import Contents from "../components/Contents";
let dialog = React.createRef<FormMessageModal>();

const InventoryTransferRequestDetails = (props: any) => {

  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
    showCollapse: true,
    DocNum: "",
  });

  const { id } = useParams();

  const {
    onSubmit,
    handleSubmit,
    onInvalidForm,
    register,
    setValue,
    control,
    reset,
    watch,
    getValues,
  } = useTransferRequestHook({ props, state, setState, id, dialog });


  const [transferR, setTransferR] = React.useState<any>();
  const [serie, setSerie] = useState([]);

  useEffect(() => {
    fethSeries();
    fetchData();
  }, []);


  const contents = transferR?.TL_VH_COMMERCIALCollection;
  const [content, setContent] = useState<any[]>(contents);

  React.useEffect(() => {
    if (content && contents) {
      reset({ ...transferR });
      setContent(content);
    }
  }, [transferR, contents]);

  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("deposit-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "1250000001",
      });
      props?.query?.set("deposit-series", seriesList);
    }
    setSerie(seriesList);
  };

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `InventoryTransferRequests(${id})`)
        .then((res: any) => {
          reset({ ...res?.data });
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
    [state, props?.edit, props?.detail]
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
      {state.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <>
          <DocumentHeaderComponent
            data={state}
            menuTabs={<HeaderTaps />}
            HeaderCollapeMenu={<></>}
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
            <div className="grow">
              {state.tapIndex === 0 && (
                <h1>
                  <BasicInformationDetail
                    serie={serie}
                    watch={watch}
                    detail={props?.detail}
                    register={register}
                    setValue={setValue}
                    control={control}
                    getValues={getValues}
                  />
                </h1>
              )}
              {state.tapIndex === 1 && (
              <div className="m-5">
                <Contents
                  content={content}
                  control={control}
                  setContent={setContent}
                  data={transferR}
                  detail={props?.detail}
                  register={register}
                />
              </div>
            )}
            </div>
            {!props?.detail && (
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
            )}
          </form>
        </>
      )}
    </>
  );
};

export default withRouter(InventoryTransferRequestDetails);
