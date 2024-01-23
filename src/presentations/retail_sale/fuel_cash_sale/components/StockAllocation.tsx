import FormCard from "@/components/card/FormCard";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import BPAddress from "@/components/selectbox/BPAddress";
import MUISelect from "@/components/selectbox/MUISelect";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import { getShippingAddress } from "@/models/BusinessParter";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import CashBankTable from "./CashBankTable";
import CheckNumberTable from "./CheckNumberTable";
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";
import MUITextField from "@/components/input/MUITextField";
import CurrencySelect from "@/components/selectbox/Currency";
import StockAllocationData from "./StockAllocationTable";

export interface IncomingPaymentProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function StockAllocationForm({
  data,
  handlerChange,
  edit,
  ref,
}: IncomingPaymentProps) {
  return <StockAllocationData data={data} onChange={handlerChange} />;
}
