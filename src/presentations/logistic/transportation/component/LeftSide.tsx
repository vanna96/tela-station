import React, { useRef, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Chip, IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import TransportationOrderRepository from "@/services/actions/transportationOrderRepository";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import shortid from "shortid";

export default function LeftSide() {
  const route = useNavigate();
  const [transOrder, setTransOrder] = useState([]);

  const { data, isLoading }: any = useQuery({
    queryKey: ["transportation-order"],
    queryFn: () => new TransportationOrderRepository().get(),
  });

  interface TransportationData {
    docEntry: string;
    u_TRANSPVEHICLE: string;
    driver: string;
    u_TRANSPROUTE: string;
    u_TRANSPSTATUS: string;
  }
  function TransportationOrderTile({ data }: { data: TransportationData[] }) {
    return (
      <>
        {data?.map((data) => (
          <div
            key={shortid.generate()}
            className="flex gap-2 p-3 border rounded m-2 flex-col hover:bg-gray-50 hover:shadow-lg cursor-pointer"
          >
            <h2 className="text-sm text-slate-600 font-bold">
              Transp. Order: {data.docEntry ?? "N/A"}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <p className="text-sm text-slate-600">
                Truck#: {data.u_TRANSPVEHICLE ?? "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                Driver: {data.driver ?? "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-slate-600">
                Route: {data.u_TRANSPROUTE ?? "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                Status:{" "}
                <Chip label={data.u_TRANSPSTATUS ?? "N/A"} color="success" />
              </p>
            </div>
          </div>
        ))}
      </>
    );
  }
  const itemRef = useRef();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    U_TRANSPDRIVER: "",
    U_TRANSPVEHICLE: "",
  });
  const [dropPlanDoc, setDropPlanDoc] = useState([]);
  const [sealDoc, setSealDoc] = useState([]);

  const transportationOrderRepo = new TransportationOrderRepository();

  const onSelectTO = async (row: { DocEntry: undefined }) => {
    itemRef.current = row?.DocEntry;
    setLoading(true);
    try {
      const item = await transportationOrderRepo.find(row?.DocEntry);
      const seals = item?.BIZ_LOG_TO11Collection?.map(
        (e: { DocEntry: any }) => ({ key: e?.DocEntry, ...e })
      );
      let dropoffplans = item?.BIZ_LOG_TO01Collection?.map(
        (e: {
          U_TRANSPDCUST: any;
          U_TRANSPSDHIPTO: any;
          U_TRANSPSDHIPTOA: any;
          U_TRANSPDREFD: any;
          U_TRANSPDTTQTY: any;
          U_TRANSPDUNST: any;
          U_TRANSPDUNET: any;
        }) => {
          return {
            key: shortid.generate(),
            CardCode: e?.U_TRANSPDCUST,
            ShipTo: e?.U_TRANSPSDHIPTO,
            Address: e?.U_TRANSPSDHIPTOA ?? "",
            type: e?.U_TRANSPDREFD ?? "",
            TotalQTY: e?.U_TRANSPDTTQTY ?? 0,
            U_TRANSPDUNST: e?.U_TRANSPDUNST ?? 0,
            U_TRANSPDUNET: e?.U_TRANSPDUNET ?? 0,
          };
        }
      );
      setDropPlanDoc(dropoffplans);
      setSealDoc(seals);
      setFormState({ ...item });
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

        <div className="h-full w-full flex lg:flex-col  gap-5">
          <div className="min-w-[22rem] lg:min-w-full">
            <TransportationOrderTile data={data} />
          </div>
        </div>
      
    </>
  );
}
