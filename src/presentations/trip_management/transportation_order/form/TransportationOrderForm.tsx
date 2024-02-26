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
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";

import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import General from "../component/General";
import Document from "../component/Document";
import Expense from "../component/Expense";
import Compartment from "../component/Compartment";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import TransDetail from "../component/TransDetail";
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
  serie?: any;
  getValues: UseFormGetValues<FieldValues>;
  compartment: any;
  transDetail: any;
  setTransDetail: any;
  setFuel: any;
};
// const { id } = useParams();
const TransportationOrderForm = (props: any) => {
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
    TripNumber: null,
    Driver: null,
    Vehicle: null,
    Route: null,
    BaseStation: null,
    DispatchDate: null,
    CompletedDate: null,
    Status: "Initiated",
  });

  const [branchAss, setBranchAss] = useState([]);
  const [to, setTo] = React.useState<any>();
  const [commer, setCommer] = React.useState<any>([]);
  const [expense, setExpense] = React.useState<any>([]);
  const [serie, setSerie] = useState([]);
  const [transDetail, setTransDetail] = useState([]);
  const [headTrans, setHeadTrans] = useState<any>([]);
  const [document, setDocument] = useState([]);
  const [trans, setTrans] = useState([]);
  const [fuel, setFuel] = useState<any>([]);

  useEffect(() => {
    fethSeries();
    fetchData();
  }, []);
  // const { fields: document, remove: removeDocument } = useFieldArray({
  //   control,
  //   name: "Document",
  // });
  const { fields: compartment } = useFieldArray({
    control,
    name: "TL_TO_COMPARTMENTCollection", // name of the array field
  });
  //  const { fields: transDetail, remove: removeTransDetail } = useFieldArray({
  //    control,
  //    name: "TL_TO_ORDERCollection", // name of the array field
  //  });
  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("to-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_TO",
      });
      props?.query?.set("to-series", seriesList);
    }
    console.log(seriesList);

    setSerie(seriesList);
  };
  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });

      await request("GET", `script/test/transportation_order(${id})`)
        .then((res: any) => {
          setTransDetail(res?.data?.TL_TO_ORDERCollection);
          setHeadTrans(
            res?.data?.TL_TO_ORDERCollection?.filter(
              (e: any) => e?.U_DocNum !== null
            )
          );
          setDocument(
            res?.data?.TL_TO_ORDERCollection?.filter(
              (e: any) => e?.U_DocNum !== null
            )
          );
          setTo(res?.data);
                    setValue("TL_TO_COMPARTMENTCollection", [
                      ...res?.data?.TL_TO_ORDERCollection?.filter(
                        (e: any) => e?.U_DocNum !== null
                      )?.map((e: any) => ({
                        U_DocNum: e?.U_DocNum,
                        U_SourceDocEntry: e?.U_SourceDocEntry,
                        U_ItemCode: e?.U_ItemCode,
                      })),
                    ]);

          setState({
            ...state,
            loading: false,
            DocNum: res?.data?.DocEntry,
          });
        })
        .catch((err: any) =>
          setState({ ...state, isError: true, message: err.message })
        );
    }
  };

  const onSubmit = async (e: any) => {
    const order = Object.values(
      trans.reduce((acc: any, obj: any, index: number) => {
        if (obj.U_DocNum !== null) {
          // Handle non-null U_DocNum objects
          const { U_DocNum } = obj;
          if (!acc[U_DocNum]) {
            acc[U_DocNum] = {
              DocEntry:obj?.DocEntry || null,
              U_DocNum,
              U_Terminal: headTrans?.find(
                (e: any) => e?.U_DocNum === obj?.U_DocNum
              )?.U_Terminal,
              U_TotalQuantity: headTrans?.find(
                (e: any) => e?.U_DocNum === obj?.U_DocNum
              )?.U_TotalQuantity,
              U_BPLId: headTrans?.find(
                (e: any) => e?.U_DocNum === obj?.U_DocNum
              )?.U_BPLId,
              U_BPLName: null,
              U_Type: headTrans?.find((e: any) => e?.U_DocNum === obj?.U_DocNum)
                ?.U_Type,
              U_StopCode: null,
              U_Description: null,
              U_SourceDocEntry: headTrans?.find(
                (e: any) => e?.U_DocNum === obj?.U_DocNum
              )?.U_SourceDocEntry,
              U_TotalItem: headTrans?.find(
                (e: any) => e?.U_DocNum === obj?.U_DocNum
              )?.U_TotalItem,
              TL_TO_DETAIL_ROWCollection: [],
            };
          }
          acc[U_DocNum].TL_TO_DETAIL_ROWCollection.push({
            U_LineId: obj?.U_LineId || null,
            VisOrder: 0,
            U_DocType: obj.U_DocType || null,
            U_DocNum,
            U_SourceDocEntry: obj.U_SourceDocEntry || null,
            U_ShipToCode: obj.U_ShipToCode || null,
            U_ShipToAddress: obj.U_ShipToAddress || null,
            U_ItemCode: obj.U_ItemCode || obj?.U_StopCode || null,
            U_ItemName: null,
            U_DeliveryDate: null,
            U_Quantity: obj.U_Quantity || null,
            U_Status: "O",
            U_UomCode: obj.U_UomCode || null,
            U_UomAbsEntry: obj.U_UomAbsEntry || null,
            U_Order: obj.U_Order || 0,
          });
        } else {
          // Handle null U_DocNum objects
          acc[index] = {
            DocEntry: obj?.DocEntry || null,
            U_DocNum: null,
            U_Terminal: null,
            U_TotalQuantity: null,
            U_BPLId: null,
            U_BPLName: null,
            U_Type: "S",
            U_StopCode: obj?.U_StopCode || obj?.U_ItemCode || null,
            U_Description: obj?.U_Description || null,
            U_SourceDocEntry: null,
            U_TotalItem: null,
            U_TOAbsEntry: 201,
            U_Order: obj.U_Order,
            TL_TO_DETAIL_ROWCollection: [
              {
                VisOrder: 0,
                U_DocType: "S",
                U_DocNum: null,
                U_SourceDocEntry: null,
                U_ShipToCode: obj?.U_ShipToCode || null,
                U_ShipToAddress: obj.U_ShipToAddress || null,
                U_ItemCode: obj?.U_StopCode || obj?.U_ItemCode || null,
                U_ItemName: null,
                U_DeliveryDate: null,
                U_Quantity: null,
                U_Status: "O",
                U_UomCode: null,
                U_UomAbsEntry: null,
                U_Order: obj.U_Order,
              },
            ],
          };
        }
        return acc;
      }, {})
    );
    const payload = {
      ...e,
      TL_TO_ORDERCollection: order,
      U_Fuel: fuel[0]["U_Fuel"] || null,
      U_FuelAmount: fuel[0]["U_FuelAmount"] || null,
      U_FuelRemark: fuel[0]["U_FuelRemark"] || null,
    };

    try {
      setState({ ...state, isSubmitting: true });
      if (props.edit) {
        await request(
          "PATCH",
          `/script/test/transportation_order(${id})`,
          payload
        )
          .then((res: any) =>
            dialog.current?.success("Update Successfully.", res?.data?.DocEntry)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/script/test/transportation_order", payload)
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
  const handleChangeFuel = (index: number, e: any, key: string) => {
    const { value } = e.target;
    const updatedFuel: any = [...fuel];
    updatedFuel[index][key] = value;
    setFuel(updatedFuel);
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
          Documents
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Expense
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 3}
          onClick={() => handlerChangeMenu(3)}
        >
          Compartments
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 4}
          onClick={() => handlerChangeMenu(4)}
        >
          Transportation Detail
        </MenuButton>
      </>
    );
  };

  React.useEffect(() => {
    if (to) {
      reset({ ...to });
      setFuel([
        {
          U_Fuel: watch("U_Fuel"),
          U_FuelAmount: watch("U_FuelAmount"),
          U_FuelRemark: watch("U_FuelRemark"),
        },
      ]);
    }
  }, [to]);

  const Left = ({ header, data }: any) => {
    return (
      <div className="w-[100%] pl-[25px] h-[165px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">Trip Number </span>
          </div>
          <div>
            <span className="">Driver</span>
          </div>
          <div>
            <span className="">Vehicle</span>
          </div>
          <div>
            <span className="">Route</span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span>{data?.FirstName || header?.TripNumber || "_"}</span>
          </div>
          <div>
            <span>{data?.LastName || header?.Driver || "_"}</span>
          </div>
          <div>
            <span>{data?.LastName || header?.Vehicle || "_"}</span>
          </div>
          <div>
            <span>{data?.LastName || header?.Route || "_"}</span>
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
      <div className="w-[100%] h-[165px] flex py-5 px-4">
        <div className="w-[70%] text-[15px] text-gray-500 flex items-end justify-between flex-col h-full">
          <div>
            <span className="">Base Station </span>
          </div>
          <div>
            <span className="">Dispatch Date</span>
          </div>
          <div>
            <span className="">Completed Date</span>
          </div>
          <div>
            <span className="">Status</span>
          </div>
        </div>
        <div className="w-[23%] text-[15px] items-end justify-between flex flex-col h-full">
          <div>
            <span>{data?.FirstName || header?.BaseStation || "_"}</span>
          </div>
          <div>
            <span>{data?.FirstName || header?.DispatchDate || "_"}</span>
          </div>
          <div>
            <span>{data?.FirstName || header?.CompletedDate || "_"}</span>
          </div>
          <div>
            <span>{data?.FirstName || header?.Status || "_"}</span>
          </div>
        </div>
      </div>
    );
  };

  const onInvalidForm = (invalids: any) => {
    dialog.current?.error(
      invalids[Object.keys(invalids)[0]]?.message?.toString() ??
        "Oop something wrong!",
      "Invalid Value"
    );
  };
  console.log(compartment);
  
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
                <Left header={header} data={to} />
                <Right header={header} data={to} />
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
                  register={register}
                  setValue={setValue}
                  control={control}
                  header={header}
                  setHeader={setHeader}
                  watch={watch}
                  serie={serie}
                  getValues={getValues}
                  compartment={compartment}
                  transDetail={transDetail}
                  setTransDetail={setTransDetail}
                  setFuel={setFuel}
                  detail={props?.detail}
                />
              </div>
            )}
            {state.tapIndex === 1 && (
              <div className="grow">
                {" "}
                <Document
                  setValue={setValue}
                  document={document}
                  setDocument={setDocument}
                  commer={commer}
                  control={control}
                  transDetail={transDetail}
                  setTransDetail={setTransDetail}
                  setHeadTrans={setHeadTrans}
                    detail={props?.detail}
                    compartment={compartment}
                />
              </div>
            )}
            {state.tapIndex === 2 && (
              <div className="grow">
                {" "}
                <Expense
                  fuel={fuel}
                  setValue={setValue}
                  control={control}
                  watch={watch}
                  register={register}
                  expense={expense}
                  handleChangeFuel={handleChangeFuel}
                  detail={props?.detail}
                />
              </div>
            )}
            {state.tapIndex === 3 && (
              <div className="grow">
                <Compartment
                  setValue={setValue}
                  control={control}
                  getValues={getValues}
                  watch={watch}
                  compartment={compartment}
                  register={register}
                  detail={props?.detail}
                />
              </div>
            )}
            {state.tapIndex === 4 && (
              <div className="grow">
                <TransDetail
                  getValues={getValues}
                  setValues={setValue}
                  control={control}
                  transDetail={transDetail}
                  setTransDetail={setTransDetail}
                  setTrans={setTrans}
                    detail={props?.detail}
                    defaultValue={defaultValues}
                />
              </div>
            )}
            {/* ... Other form fields ... */}
            <div className="sticky bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
                <div className="flex">
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
                      (window.location.href =
                        "/trip-management/transportation-order")
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

export default TransportationOrderForm;
