import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormGetValues,
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
import Document, { TRSourceDocument } from "../components/Document";
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
  getValues: UseFormGetValues<FieldValues>;
};
// const { id } = useParams();
const Form = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    watch,
    getValues,
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
    fethSeries()
  }, []);
  const fethSeries = async() => {
   let seriesList: any = props?.query?.find("tr-series");
   if (!seriesList) {
     seriesList = await DocumentSerieRepository.getDocumentSeries({
       Document: "TL_TR",
     });
     props?.query?.set("tr-series", seriesList);
   }
   setSerie(seriesList);
}
  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
     
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
     const payload: any = Object.fromEntries(
       Object.entries(e).filter(
         ([key, value]): any => value !== null && value !== undefined
       )
     );
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
  console.log(invalids);
  let message = invalids[Object.keys(invalids)[0]]?.message?.toString();

  // Iterate over all invalid entries
  for (const invalidKey of Object.keys(invalids)) {
    const invalidEntry = invalids[invalidKey];
    if (!invalidEntry || !Array.isArray(invalidEntry)) continue;

    for (const err of invalidEntry) {
      if (!err) continue;

      if (!err?.U_Children) {
        message = err?.message?.toString();
      } else {
        console.log(err);
        if (Array.isArray(err.U_Children) && err.U_Children.length > 0) {
          for (const child of err.U_Children) {
            if (child && typeof child === "object") {
              const keys = Object.keys(child);
              if (keys.length > 0) {
                message = child[keys[0]]?.message?.toString();
                // Assuming you only want the first message found, you might want to adjust this behavior if needed
                if (message) break;
              }
            }
          }
        }
      }
      // If message is found, break the loop
      if (message) break;
    }
    // If message is found, break the loop
    if (message) break;
  }

  dialog.current?.error(message ?? "Oops something wrong!", "Invalid Value");
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
      console.log(requestS);
      
      reset({ ...requestS });
    }
  }, [requestS]);

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
      <div className="w-[100%] mt-2 pl-[25px] h-[125px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">Requester</span>
          </div>
          <div>
            <span className="mt-10">Branch</span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span className="mb-[27px] inline-block">
              {`${
                emp?.data?.find((e: any) => e?.EmployeeID === data?.U_Requester)
                  ?.FirstName ||
                emp?.data?.find(
                  (e: any) => e?.EmployeeID === header?.U_Requester
                )?.FirstName ||
                "_"
              } ${
                emp?.data?.find((e: any) => e?.EmployeeID === data?.U_Requester)
                  ?.LastName ||
                emp?.data?.find(
                  (e: any) => e?.EmployeeID === header?.U_Requester
                )?.LastName ||
                "_"
              }`}
            </span>
          </div>
          <div>
            <span>
              {branchAss?.data?.find((e: any) => e?.BPLID === data?.U_Branch)
                ?.BPLName ||
                header?.U_Branch ||
                branchAss?.data?.find((e: any) => e?.BPLID === header?.U_Branch)
                  ?.BPLName ||
                "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const Right = ({ header, data }: any) => {
    return (
      <div className="w-[100%] h-[150px] mt-2 flex py-5 px-4">
        <div className="w-[55%] text-[15px] text-gray-500 flex items-end flex-col h-full">
          <div>
            <span className="mr-10 mb-[27px] inline-block">Terminal</span>
          </div>
          <div>
            <span className="mr-10">Status</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div>
            <span>{data?.U_Terminal || header?.base || "_"}</span>
          </div>
          <div className="mt-7">
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
            onSubmit={handleSubmit(onSubmit, onInvalidForm)}
          >
            {state.tapIndex === 0 && (
              <div className="grow">
                <General
                  data={state}
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  emp={emp}
                  header={header}
                  setHeader={setHeader}
                  serie={serie}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow">
                <Document
                  register={register}
                  collection={collection}
                  control={control}
                  setCollection={setCollection}
                  data={requestS}
                  document={document}
                  defaultValues={defaultValues}
                  setValue={setValue}
                  appendDocument={appendDocument}
                  removeDocument={removeDocument}
                  getValues={getValues}
                  watch={watch}
                />
              </div>
            )}
            <div className="sticky bottom-4  mt-2 ">
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
                      (window.location.href = "/master-data/pump-attendant")
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
                      {props.edit ? "Update" : "Save"}
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

export default Form;
