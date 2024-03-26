import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import General from "../components/General";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import Document from "../components/Document";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import request from "@/utilies/request";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import CustomToast from "@/components/modal/CustomToast";
import { Backdrop } from "@mui/material";

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
  emp?: any;
  header?: any;
  detail?: boolean;
  data?: any;
  serie?: any;
  watch: UseFormWatch<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
};
// const { id } = useParams();
const Form = (props: any) => {
  const { handleSubmit, register, setValue, control, reset, watch, getValues } =
    useForm({
      defaultValues: {
        U_RequestDate: new Date()?.toISOString()?.split("T")[0],
      } as any,
    });
  const { id } = useParams();
  const route = useNavigate();
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
  const [open, setOpen] = useState(false);

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
    fethSeries();
  }, []);
  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("tr-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_TR",
      });
      props?.query?.set("tr-series", seriesList);
    }
    setSerie(seriesList);
  };
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
    if (open) return;
    const payload: any = {
      ...e,
      RequesterName: undefined,
      BranchName: undefined,
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
  const isNextTap = (index: number) => {
    if (!getValues("U_Requester") || getValues("U_Requester") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("U_Branch") || getValues("U_Branch") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("Series") || getValues("Series") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("U_Terminal") || getValues("U_Terminal") === "") {
      toastRef.current?.open();
      return;
    }
    if (!getValues("U_RequestDate") || getValues("U_RequestDate") === "") {
      toastRef.current?.open();
      return;
    }

    handlerChangeMenu(index);
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
        <MenuButton active={state.tapIndex === 0} onClick={() => isNextTap(0)}>
          General
        </MenuButton>
        <MenuButton active={state.tapIndex === 1} onClick={() => isNextTap(1)}>
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
          <CustomToast ref={toastRef} />

          <form
            id="formData"
            className="h-full w-full flex flex-col gap-4 relative"
            onSubmit={handleSubmit(onSubmit, onInvalidForm)}
          >
            {state.tapIndex === 0 && (
              <div className="grow">
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  serie={serie}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow pt-3">
                <Document
                  open={open}
                  setOpen={setOpen}
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
                      route("/trip-management/transportation-request")
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

export default Form;
