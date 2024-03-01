import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { ReactNode } from "react";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import DescriptionIcon from '@mui/icons-material/Description';

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
    path: "/master-data",
    state: "master-data",
    sidebarProps: {
      displayText: "Master Data",
      icon: <DatasetLinkedIcon />,
    },
    child: [
      {
        path: "/master-data/pump",
        state: "pump",
        sidebarProps: {
          displayText: "Pump",
        },
      },
      {
        path: "/master-data/pump-attendant",
        state: "pump-attendant",
        sidebarProps: {
          displayText: "Pump Attendant",
        },
      },
      {
        path: "/master-data/expense-dictionary",
        state: "expense-dictionary",
        sidebarProps: {
          displayText: "Expense Dictionary",
        },
      },
      {
        path: "/master-data/cash-account",
        state: "cash-account",
        sidebarProps: {
          displayText: "Cash Account",
        },
      },

      {
        path: "/master-data/driver",
        state: "driver",
        sidebarProps: {
          displayText: "Driver",
        },
      },
      {
        path: "/master-data/vehicle",
        state: "vehicle",
        sidebarProps: {
          displayText: "Vehicle",
        },
      },
      {
        path: "/master-data/stops",
        state: "stops",
        sidebarProps: {
          displayText: "Stops",
        },
      },
      {
        path: "/master-data/route",
        state: "route",
        sidebarProps: {
          displayText: "Route",
        },
      },
    ],
  },
  {
    path: "/sale-target",
    state: "sale-target",
    sidebarProps: {
      displayText: "Sale Target",
      icon: <AdsClickIcon />,
    },
    child: [
      {
        path: "/sale-target/sale-scenario",
        state: "sale-target/sale-scenario",
        sidebarProps: {
          displayText: "Sale Scenario",
        },
      },
      {
        path: "/sale-target/sale-target",
        state: "sale-target/sale-target",
        sidebarProps: {
          displayText: "Sale Target",
        },
      },
    ],
  },

  {
    path: "/sale-order",
    state: "sale-order",
    sidebarProps: {
      displayText: "Sale Order",
      icon: <DescriptionIcon />,
    },
    child: [
      {
        path: "/sale-order/fuel-sales",
        state: "fuel-sales",
        sidebarProps: {
          displayText: "Fuel Sales",
        },
      },
      {
        path: "/sale-order/lube-sales",
        state: "lube-sales",
        sidebarProps: {
          displayText: "Lube Sales",
        },
      },
      {
        path: "/sale-order/lpg-sales",
        state: "lpg-sales",
        sidebarProps: {
          displayText: "LPG Sales",
        },
      },
    ],
  },

  {
    path: "/sale-invoice",
    state: "sale-invoice",
    sidebarProps: {
      displayText: "Sale Invoice",
      icon: <SwitchAccountIcon />,
    },
    child: [
      {
        path: "/sale-invoice/fuel-sales",
        state: "fuel-sales",
        sidebarProps: {
          displayText: "Fuel Sales",
        },
      },
      {
        path: "/sale-invoice/lube-sales",
        state: "lube-sales",
        sidebarProps: {
          displayText: "Lube Sales",
        },
      },
      {
        path: "/sale-invoice/lpg-sales",
        state: "lpg-sales",
        sidebarProps: {
          displayText: "LPG Sales",
        },
      },
    ],
  },
  {
    path: "/retail-sale",
    state: "retail-sale",
    sidebarProps: {
      displayText: "Retail Sale",
      icon: <PointOfSaleIcon />,
    },
    child: [
      {
        path: "/retail-sale/fuel-cash-sale",
        state: "fuel-sales",
        sidebarProps: {
          displayText: "Fuel Cash Sale",
        },
      },
      {
        path: "/retail-sale/lube-cash-sale",
        state: "lube-sales",
        sidebarProps: {
          displayText: "Lube Cash Sale",
        },
      },
      {
        path: "/retail-sale/lpg-cash-sale",
        state: "lpg-sales",
        sidebarProps: {
          displayText: "LPG Cash Sale ",
        },
      },

      // {
      //   path: "/retail-sale/pump-record",
      //   state: "pump-record",
      //   sidebarProps: {
      //     displayText: "Pump Record ",
      //   },
      // },
      // {
      //   path: "/retail-sale/morph-price",
      //   state: "morph-price",
      //   sidebarProps: {
      //     displayText: "Morph Price ",
      //   },
      // },
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
        state: "settle-receipt",
        sidebarProps: {
          displayText: "Settle Receipt",
        },
      },
      {
        path: "/banking/payment-account",
        state: "payment-account",
        sidebarProps: {
          displayText: "Payment Account",
        },
      },
      {
        path: "/banking/direct-account",
        state: "direct-account",
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
        state: "expense/log",
        sidebarProps: {
          displayText: "Expense Log",
        },
      },
      {
        path: "/expense/clearance",
        state: "expense/clearance",
        sidebarProps: {
          displayText: "Expense Posting",
        },
      },
    ],
  },
  {
    path: "/stock-control",
    state: "stock-control",
    sidebarProps: {
      displayText: "Stock Control",
      icon: <TrendingUpIcon />,
    },
    child: [
      {
        path: "/stock-control/inventory-transfer-request",
        state: "/inventory-transfer-request",
        sidebarProps: {
          displayText: "Inventory Transfer Request",
        },
      },
      {
        path: "/stock-control/stock-transfer",
        state: "/stock-transfer",
        sidebarProps: {
          displayText: "Stock Transfer",
        },
      },
      {
        path: "/stock-control/good-issue",
        state: "/good-issue",
        sidebarProps: {
          displayText: "Good Issue",
        },
      },
      {
        path: "/stock-control/good-receipt",
        state: "/good-receipt",
        sidebarProps: {
          displayText: "Good Receipt",
        },
      },

      {
        path: "/stock-control/pump-test",
        state: "/pump-test",
        sidebarProps: {
          displayText: "Pump Test",
        },
      },
      {
        path: "/stock-control/fuel-level",
        state: "/fuel-level",
        sidebarProps: {
          displayText: "Fuel Level",
        },
      },
    ],
  },
  {
    path: "/trip-management",
    state: "trip-management",
    sidebarProps: {
      displayText: "Trip Management",
      icon: <LocalShippingIcon />,
    },
    child: [
      {
        path: "/transportation/request",
        state: "transportation/request",
        sidebarProps: {
          displayText: "Transportation Request",
        },
      },
      {
        path: "/transportation/order",
        state: "transportation/order",
        sidebarProps: {
          displayText: "Transportation Order",
        },
      },
      {
        path: "/bulk/seal/allocation",
        state: "bulk/seal/allocation",
        sidebarProps: {
          displayText: "Bulk Seal Allocation",
        },
      },
    ],
  },
];

export default appRoutes;
