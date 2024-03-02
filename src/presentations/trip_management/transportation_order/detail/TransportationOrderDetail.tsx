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
// const { id } = useParams();
const TransportationOrderDetail = (props: any) => {
  const {
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

  const [to, setTo] = React.useState<any>();
  const [commer, setCommer] = React.useState<any>([]);
  const [expense, setExpense] = React.useState<any>([]);
  const [serie, setSerie] = useState([]);
  const [itemCodes, setItemCodes] = useState("");
  const [transDetail, setTransDetail] = useState([]);
  const [headTrans, setHeadTrans] = useState<any>([]);
  const [document, setDocument] = useState([]);
  const [trans, setTrans] = useState([]);
  const [fuel, setFuel] = useState<any>([]);

  useEffect(() => {
    fethSeries();
    fetchData();
  }, []);

  const { fields: compartment } = useFieldArray({
    control,
    name: "TL_TO_COMPARTMENTCollection",
  });
  const fethSeries = async () => {
    let seriesList: any = props?.query?.find("to-series");
    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_TO",
      });
      props?.query?.set("to-series", seriesList);
    }
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
            ...res?.data?.TL_TO_COMPARTMENTCollection?.map((e: any) => ({
              ...e,
              U_Children: e?.U_Children?.map((e: any) => ({
                ...e,
                U_SealNumber: e?.U_SealNumber,
                U_SealReference: e?.U_SealReference,
              })),
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
    if (document) {
      let itemCode = document.reduce((p: any, c: any) => {
        return p.concat(
          c.TL_TO_DETAIL_ROWCollection.map(
            (itemCode: any) => itemCode?.U_ItemCode
          )
        );
      }, []);
      itemCode = itemCode.join(",");
      setItemCodes(itemCode);
    }
  }, [to, document]);

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
          <form
            id="formData"
            className="h-full w-full flex flex-col gap-4 relative"
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
                  document={document}
                  itemCodes={itemCodes}
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
           
          </form>
        </>
      )}
    </>
  );
};

export default TransportationOrderDetail;
