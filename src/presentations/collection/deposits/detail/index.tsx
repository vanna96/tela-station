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
let dialog = React.createRef<FormMessageModal>();

// const { id } = useParams();
const DepositDetail = (props: any) => {
  const {
    register,
    setValue,
    control,
    reset,
    watch,
    getValues,
    formState: { errors, defaultValues },
  } = useForm();
  // const { id }: any = props?.match?.params || 0;

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
          >
            {state.tapIndex === 0 && (
              <h1>
                <BasicInformation
                  watch={watch}
                  detail={props?.detail}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
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
                  defaultValues={defaultValues}
                  data={data}
                  getValues={getValues}
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
                  defaultValues={defaultValues}
                  getValues={getValues}
                />
              </h1>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default withRouter(DepositDetail);
