import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { withRouter } from "@/routes/withRouter";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import General from "../components/General";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import ManagerRepository from "@/services/actions/ManagerRepository";
import EmployeeRepository from "@/services/actions/employeeRepository";
import Document from "../components/Document";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import request from "@/utilies/request";
import { log } from "util";
import { useParams } from "react-router-dom";
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
  const [header, setHeader] = useState({
    firstName: null,
    lastName: null,
    gender: null,
    branch: null,
    status: "O",
  });

  const [branchAss, setBranchAss] = useState([]);
  const [requestS, setRequest] = React.useState<any>();
  const [emp, setEmp] = useState([]);
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

  const onSubmit = async (e: any) => {
    const payload = {
      ...e,
    };
    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request(
          "PATCH",
          `/script/test/transportation_request(${id})`,
          payload
        )
          .then((res: any) =>
            dialog.current?.success("Update Successfully.", res?.data?.DocEntry)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/script/test/transportation_request", payload)
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
  const onInvalidForm = (invalids: any) => {
    dialog.current?.error(
      invalids[Object.keys(invalids)[0]]?.message?.toString() ??
        "Oop something wrong!",
      "Invalid Value"
    );
  };
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
          <DocumentHeaderComponent
            data={state}
            menuTabs={<HeaderTaps />}
            HeaderCollapeMenu={
              <>
                <Left />
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
                <General
                  getValues={getValues}
                  data={state}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  emp={emp}
                  header={header}
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
