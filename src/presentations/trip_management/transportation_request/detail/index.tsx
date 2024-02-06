import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import MenuButton from "@/components/button/MenuButton";
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import General from "../components/General";
import { useParams } from "react-router-dom";
import ManagerRepository from "@/services/actions/ManagerRepository";
import DocumentSerieRepository from "@/services/actions/documentSerie";
let dialog = React.createRef<FormMessageModal>();

// const { id } = useParams();
const TransportationRequestDetail = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,

    formState: { errors, defaultValues },
  } = useForm();
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
  const [header, setHeader] = useState({
    code: null,
    name: null,
    number: null,
    model: null,
    owner: null,
    base: null,
    status: "tYES",
  });

  const [requestS, setRequestS] = React.useState<any>([]);

  const collecttions = requestS?.TL_TR_ROWCollection;
  const [emp, setEmp] = useState([]);
  const [serie, setSerie] = useState([]);
  const [collection, setCollection] = useState<any[]>(collecttions ?? []);

  React.useEffect(() => {
    if (requestS) {
      reset({ ...requestS });
      setCollection(collecttions);
    }
  }, [requestS, collecttions]);
  useEffect(() => {
    fetchData();
  }, []);
  console.log(requestS);

  const fetchData = async () => {
    let seriesList: any = props?.query?.find("tr-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_TR",
      });
      props?.query?.set("tr-series", seriesList);
    }
    setSerie(seriesList);
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `TL_TR(${id})`)
        .then((res: any) => {
          setRequestS(res?.data);
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
          General
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 1}
          onClick={() => handlerChangeMenu(1)}
        >
          Document
        </MenuButton>
      </>
    );
  };

  const Left = ({ header, data }: any) => {
    const branchAss: any = useQuery({
      queryKey: ["branchAss"],
      queryFn: () => new BranchBPLRepository().get(),
      staleTime: Infinity,
    });
    const emp: any = useQuery({
      queryKey: ["manager"],
      queryFn: () => new ManagerRepository().get(),
      staleTime: Infinity,
    });
    return (
      <div className="w-[100%] mt-0 pl-[25px] h-[100px] flex py-5 px-4">
        <div className="w-[40%] text-[15px] text-gray-500 flex flex-col h-full">
          <div>
            <span className="">Requester</span>
          </div>
          <div className="mt-4">Branch</div>
        </div>
        <div className="w-[60%] text-[15px] flex flex-col h-full">
          <div className="">
            {`${
              emp?.data?.find((e: any) => e?.EmployeeID === data?.U_Requester)
                ?.FirstName ||
              emp?.data?.find((e: any) => e?.EmployeeID === header?.U_Requester)
                ?.FirstName ||
              "_"
            } ${
              emp?.data?.find((e: any) => e?.EmployeeID === data?.U_Requester)
                ?.LastName ||
              emp?.data?.find((e: any) => e?.EmployeeID === header?.U_Requester)
                ?.LastName ||
              "_"
            }`}
          </div>
          <div className="mt-4">
            {branchAss?.data?.find((e: any) => e?.BPLID === data?.U_Branch)
              ?.BPLName ||
              header?.U_Branch ||
              "_"}
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
      <div className="w-[100%] h-[165px] mt-0 flex py-5 px-4">
        <div className="w-[55%] text-[15px] text-gray-500 flex items-end flex-col h-full">
          <div>
            <span className="mr-10 mb-[20px] inline-block">Terminal</span>
          </div>
          <div>
            <span className="mr-10 mb-[20px] inline-block">Base Station</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div className="mb-[20px] inline-block">
            <span>{data?.U_Terminal || header?.base || "_"}</span>
          </div>
          <div>
            <span>
              {data?.Status || header?.status == "O"
                ? "Active"
                : "Inactive" || "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };
  console.log(defaultValues);

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
                <Left header={header} data={requestS} />
                <Right header={header} data={requestS} />
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
          >
            {state.tapIndex === 0 && (
              <h1>
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                  detail={props?.detail}
                  serie={serie}
                />
              </h1>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default TransportationRequestDetail;
