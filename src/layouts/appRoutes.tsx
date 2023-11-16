import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaleMasterPage from "@/presentations/sale";
import ExpensePage from "@/presentations/expense";
import { ReactNode } from "react";
import MasterDataPage from "@/presentations/master";
import DispenserList from "../presentations/master_data/dispenser/index";
import CashAccountList from "@/presentations/master_data/cash_account/index";
import ExpenseDictionaryList from "@/presentations/master_data/expense_dictionary";
import MorphPriceLists from "@/presentations/sale/morph_price";
import SaleOrderLists from "@/presentations/sale/sale_order";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { MdPointOfSale, MdReceipt } from "react-icons/md";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettleReceiptLists from "@/presentations/collection/settle_receipt";
import InventoryTransferList from "@/presentations/stock_control/inventory_transfer";
import ExpenseLogLists from "@/presentations/expense/log";
import ClearenceLists from "@/presentations/expense/clearence";
import DirectAccountLists from "@/presentations/collection/direct_account";
import PaymentAccountLists from "@/presentations/collection/payment_account";
type RouteType = {
  state: string;
  index?: boolean;
  path?: string;
  child?: RouteType[];
  sidebarProps?: {
    displayText: string;
    icon?: ReactNode;
  };
};
const appRoutes: RouteType[] = [
  {
    index: true,
    state: "home",
  },
  {
    path: "/dashboard",
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />,
    },
  },
  {
    path: "/sale",
    state: "sale",
    sidebarProps: {
      displayText: "Sale",
      icon: <PointOfSaleIcon />,
    },
    child: [
      {
        path: "/sale/fuel-sales",
        state: "fuel-sales",
        sidebarProps: {
          displayText: "Fuel",
        },
      },
      {
        path: "/sale/lube-sales",
        state: "lube-sales",
        sidebarProps: {
          displayText: "Lube",
        },
      },
      {
        path: "/sale/lpg-sales",
        state: "lpg-sales",
        sidebarProps: {
          displayText: "LPG ",
        },
      },
      {
        path: "/sale/pump-record",
        state: "pump-record",
        sidebarProps: {
          displayText: "Pump Record ",
        },
      },
      {
        path: "/sale/morph-price",
        state: "morph-price",
        sidebarProps: {
          displayText: "Morph Price ",
        },
      },
    ],
  },
  {
    path: "/master-data",
    state: "master-data",
    sidebarProps: {
      displayText: "Master Data",
      icon: <DatasetLinkedIcon />,
    },
    child: [
      {
        path: "/master-data/dispenser",
        state: "component.alert",
        sidebarProps: {
          displayText: "Dispenser",
        },
      },
      {
        path: "/master-data/cash-account",
        state: "",
        sidebarProps: {
          displayText: "Cash Account",
        },
      },
      {
        path: "/master-data/expense-dictionary",
        state: "",
        sidebarProps: {
          displayText: "Expense Dictionary",
        },
      },
    ],
  },
  {
    path: "/banking",
    state: "banking",
    sidebarProps: {
      displayText: "Banking",
      icon: <AccountBalanceIcon />,
    },
    child: [
      {
        path: "/banking/settle-receipt",
        state: "component.alert",
        sidebarProps: {
          displayText: "Settle Receipt",
        },
      },
      {
        path: "/banking/payment-account",
        state: "component.alert",
        sidebarProps: {
          displayText: "Payment Account",
        },
      },
      {
        path: "/banking/direct-account",
        state: "component.alert",
        sidebarProps: {
          displayText: "Direct Account",
        },
      },
    ],
  },
  {
    path: "/expense",
    state: "expense",
    sidebarProps: {
      displayText: "Expense",
      icon: <PaymentIcon />,
    },
    child: [
      {
        path: "/expense/log",
        // element: <ExpenseLogLists />,
        state: "component.alert",
        sidebarProps: {
          displayText: "Expense Log",
        },
      },
      {
        path: "/expense/clearance",
        state: "component.alert",
        sidebarProps: {
          displayText: "Expense Clearnace",
        },
      },
    ],
  },
  {
    path: "/stock-control",
    state: "stock-control",
    sidebarProps: {
      displayText: "Stock Control",
      icon: <ShowChartIcon />,
    },
    child: [
      {
        path: "/stock-control/inventory-manage",
        state: "component.alert",
        sidebarProps: {
          displayText: "Inventory Transfer List",
        },
      },
    ],
  },
];

export default appRoutes;
