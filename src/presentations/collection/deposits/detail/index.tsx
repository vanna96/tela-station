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
import Checks from "../components/Checks";
import Cash from "../components/Cash";
import CheckDetail from "./CheckDetail";
import BasicInformationDetail from "./BasicInformationDetail";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import { useDepositHook } from "../hook/useDepositHook";
let dialog = React.createRef<FormMessageModal>();

const DepositDetail = (props: any) => {

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
  } = useDepositHook({ props, state, setState, id, dialog });


  const { data, isLoading }: any = useQuery({
    queryKey: [`deposits`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `/sml.svc/TL_POSTED_DEPOSIT?$filter=DeposId eq ${id} `
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });

      return response?.value;
    },
    cacheTime: 0,
    staleTime: 0,
  });

  const [deposit, setDeposit] = React.useState<any>();
  const [serie, setSerie] = useState([]);

  useEffect(() => {
    fethSeries();
    fetchData();
  }, []);

  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("deposit-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "25",
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
      await request("GET", `Deposits(${id})`)
        .then((res: any) => {
          reset({ ...res?.data });
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



  const handlerChangeMenu = useCallback(
    (index: number) => {

      if (watch('DepositType') === 'dtCash' && index === 1) return;
      if (watch('DepositType') === 'dtChecks' && index === 2) return;

      setState((prevState) => ({
        ...prevState,
        tapIndex: index,
      }));
    },
    [state, props?.edit, props?.detail, watch('DepositType')]
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
                <h1>
                  <CheckDetail
                    watch={watch}
                    detail={props?.detail}
                    register={register}
                    setValue={setValue}
                    control={control}
                    data={data}
                    getValues={getValues}
                    edit={props?.edit}
                  />
                </h1>
              )}
              {state.tapIndex === 2 && (
                <h1>
                  <Cash
                    watch={watch}
                    detail={props?.detail}
                    register={register}
                    setValue={setValue}
                    control={control}
                    getValues={getValues}
                    edit={props?.edit}
                  />
                </h1>
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

export default withRouter(DepositDetail);
