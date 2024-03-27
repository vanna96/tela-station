import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import MenuButton from "@/components/button/MenuButton";
import General from "../components/General";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import Document from "../components/Document";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import request from "@/utilies/request";
import { useParams } from "react-router-dom";
import DocumentHeaderComponentTR from "../components/DocumentHeaderComponentTR";
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
  emp?: any;
  header?: any;
  setHeader?: any;
  detail?: boolean;
  data?: any;
  serie?: any;
  watch: UseFormWatch<FieldValues>;
};
// const { id } = useParams();
const TransportationRequestDetail = (props: any) => {
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
    DocNum: id,
  });
 

  const [branchAss, setBranchAss] = useState([]);
  const [requestS, setRequest] = React.useState<any>();
  const [serie, setSerie] = useState([]);
  const [collection, setCollection] = useState<any[]>([]);

  const {
    fields: document,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: "TL_TR_ROWCollection", // name of the array field
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      let seriesList: any = props?.query?.find("tr-series");
      if (!seriesList) {
        seriesList = await DocumentSerieRepository.getDocumentSeries({
          Document: "TL_TR",
        });
        props?.query?.set("tr-series", seriesList);
      }
      setSerie(seriesList);
      await request("GET", `script/test/transportation_request(${id})`)
        .then((res: any) => {
          setBranchAss(res?.data);
          setRequest(res?.data);
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
        {/* ... Other menu buttons ... */}
      </>
    );
  };

  React.useEffect(() => {
    if (requestS) {
      reset({ ...requestS });
    }
  }, [requestS]);

  const Left = () =>
    useMemo(() => {
      return (
        <div className="w-[100%] mt-2 pl-[25px] h-[125px] flex py-5 px-4 text-sm">
          <div className="w-[25%] gap-[10px] text-[15px] text-gray-500 flex flex-col justify-between h-full">
            <div>
              <span className="">Requester</span>
            </div>
            <div>
              <span className="">Branch</span>
            </div>
            <div>
              <span className="">Terminal</span>
            </div>
            <div>
              <span className="">Status</span>
            </div>
          </div>
          <div className="w-[70%] gap-[10px] text-[15px] flex flex-col justify-between h-full">
            <div>
              <span className="">{watch("RequesterName") || "_"}</span>
            </div>
            <div>
              <span>{watch("BranchName") || "_"}</span>
            </div>
            <div>
              <span>{watch("U_Terminal") || "_"}</span>
            </div>
            <div className="">
              <span>{watch("U_Status") === "O" ? "OPEN" : "CLOSE" || "_"}</span>
            </div>
          </div>
        </div>
      );
    }, [requestS]);

  return (
    <>
      {state.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <>
            <DocumentHeaderComponentTR
              status={watch("U_Status")}
              data={state}
              menuTabs={<HeaderTaps />}
              HeaderCollapeMenu={<>
                <Left />
              </>}
              leftSideField={undefined}
              rightSideField={undefined} collapse={false}          />
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
                  getValues={getValues}
                  data={state}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  serie={serie}
                  detail={props?.detail}
                  watch={watch}
                />
              </h1>
            )}
            {state.tapIndex === 1 && (
              <div className="m-5">
                <Document
                  register={register}
                  collection={collection}
                  control={control}
                  setCollection={setCollection}
                  data={requestS}
                  document={document}
                  setValue={setValue}
                  appendDocument={appendDocument}
                  removeDocument={removeDocument}
                  getValues={getValues}
                  detail={props?.detail}
                  watch={watch}
                />
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default TransportationRequestDetail;
