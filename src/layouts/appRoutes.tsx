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
import DescriptionIcon from "@mui/icons-material/Description";
import { Role } from "@/contexts/useAuthorizationContext";

type RouteType = {
  state: string;
  index?: boolean;
  path?: string;
  child?: any[];
  roles?: Role[];
  sidebarProps?: {
    displayText: string;
    icon?: ReactNode;
  };
};

export const appRoutes: RouteType[] = [
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
    roles: ["UG001", "UG002", "UG003", "UG004"],
    sidebarProps: {
      displayText: "Master Data",
      icon: <DatasetLinkedIcon />,
    },
    child: [
      {
        path: "/master-data/pump",
        state: "pump",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Pump",
        },
      },
      {
        path: "/master-data/pump-attendant",
        state: "pump-attendant",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Pump Attendant",
        },
      },
      {
        path: "/master-data/expense-dictionary",
        state: "expense-dictionary",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Expense Dictionary",
        },
      },
      {
        path: "/master-data/cash-account",
        state: "cash-account",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Cash Account",
        },
      },

      {
        path: "/master-data/driver",
        state: "driver",
        roles: ["UG001", "UG002"],
        sidebarProps: {
          displayText: "Driver",
        },
      },
      {
        path: "/master-data/vehicle",
        state: "vehicle",
        roles: ["UG001", "UG002"],
        sidebarProps: {
          displayText: "Vehicle",
        },
      },
      {
        path: "/master-data/stops",
        state: "stops",
        roles: ["UG001", "UG002"],
        sidebarProps: {
          displayText: "Stops",
        },
      },
      {
        path: "/master-data/route",
        state: "route",
        roles: ["UG001", "UG002"],
        sidebarProps: {
          displayText: "Route",
        },
      },
    ],
  },

  {
    path: "/wholesale",
    state: "wholesale",
    roles: ["UG001", "UG004"],
    sidebarProps: {
      displayText: "Wholesale",
      icon: <SwitchAccountIcon />,
    },
    child: [
      {
        path: "/wholesale/sale-order",
        state: "sale-order",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Sale Order",
        },
        child: [
          {
            path: "/wholesale/sale-order/fuel-sales",
            state: "fuel-sales",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "Fuel Sales",
            },
          },
          {
            path: "/wholesale/sale-order/lube-sales",
            state: "lube-sales",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "Lube Sales",
            },
          },
          {
            path: "/wholesale/sale-order/lpg-sales",
            state: "lpg-sales",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "LPG Sales",
            },
          },
        ],
      },

      {
        path: "/wholesale/sale-invoice",
        state: "sale-invoice",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Sale Invoice",
        },
        child: [
          {
            path: "/wholesale/sale-invoice/fuel-invoice",
            state: "fuel-invoice",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "Fuel Invoice",
            },
          },
          {
            path: "/wholesale/sale-invoice/lube-invoice",
            state: "lube-invoice",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "Lube Invoice",
            },
          },
          {
            path: "/wholesale/sale-invoice/lpg-invoice",
            state: "lpg-invoice",
            roles: ["UG001", "UG004"],
            sidebarProps: {
              displayText: "LPG Invoice",
            },
          },
        ],
      },
    ],
  },

  // {
  //   path: "/sale-order",
  //   state: "sale-order",
  //   roles: ["UG001", "UG004"],
  //   sidebarProps: {
  //     displayText: "Sale Order",
  //     icon: <DescriptionIcon />,
  //   },
  //   child: [
  //     {
  //       path: "/sale-order/fuel-sales",
  //       state: "sale-order-fuel-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "Fuel Sales",
  //       },
  //     },
  //     {
  //       path: "/sale-order/lube-sales",
  //       state: "sale-order-lube-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "Lube Sales",
  //       },
  //     },
  //     {
  //       path: "/sale-order/lpg-sales",
  //       state: "sale-order-lpg-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "LPG Sales",
  //       },
  //     },
  //   ],
  // },

  // {
  //   path: "/sale-invoice",
  //   state: "sale-invoice",
  //   roles: ["UG001", "UG004"],
  //   sidebarProps: {
  //     displayText: "Sale Invoice",
  //     icon: <SwitchAccountIcon />,
  //   },
  //   child: [
  //     {
  //       path: "/sale-invoice/fuel-sales",
  //       state: "sale-invoice-fuel-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "Fuel Sales",
  //       },
  //     },
  //     {
  //       path: "/sale-invoice/lube-sales",
  //       state: "sale-invoice-lube-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "Lube Sales",
  //       },
  //     },
  //     {
  //       path: "/sale-invoice/lpg-sales",
  //       state: "sale-invoice-lpg-sales",
  //       roles: ["UG001", "UG004"],
  //       sidebarProps: {
  //         displayText: "LPG Sales",
  //       },
  //     },
  //   ],
  // },
  {
    path: "/retail-sale",
    state: "retail-sale",
    sidebarProps: {
      displayText: "Retail Sale",
      icon: <PointOfSaleIcon />,
    },
    roles: ["UG001", "UG004"],
    child: [
      {
        path: "/retail-sale/fuel-cash-sale",
        state: "fuel-cash-sale",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Fuel Cash Sale",
        },
      },
      {
        path: "/retail-sale/lube-cash-sale",
        state: "lube-cash-sale",
        roles: ["UG001", "UG004"],
        sidebarProps: {
          displayText: "Lube Cash Sale",
        },
      },
      {
        path: "/retail-sale/lpg-cash-sale",
        state: "lpg-cash-sale",
        roles: ["UG001", "UG004"],
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
    roles: ["UG001", "UG004"],
    sidebarProps: {
      displayText: "Banking",
      icon: <AccountBalanceIcon />,
    },
    child: [
      {
        roles: ["UG001", "UG004"],
        path: "/banking/settle-receipt",
        state: "settle-receipt",
        sidebarProps: {
          displayText: "Settle Receipt",
        },
      },
      {
        roles: ["UG001", "UG004"],
        path: "/banking/payment-account",
        state: "payment-account",
        sidebarProps: {
          displayText: "Payment Account",
        },
      },
      {
        roles: ["UG001", "UG004"],
        path: "/banking/direct-account",
        state: "direct-account",
        sidebarProps: {
          displayText: "Direct Account",
        },
      },
      {
        roles: ["UG001", "UG004"],
        path: "/banking/deposit",
        state: "deposits",
        sidebarProps: {
          displayText: "Deposit",
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
    roles: ["UG001", "UG004"],
    child: [
      {
        path: "/expense/log",
        roles: ["UG001", "UG004"],
        // element: <ExpenseLogLists />,
        state: "log",
        sidebarProps: {
          displayText: "Expense Log",
        },
      },
      {
        path: "/expense/clearance",
        roles: ["UG001", "UG004"],
        state: "clearance",
        sidebarProps: {
          displayText: "Expense Posting",
        },
      },
    ],
  },
  {
    path: "/stock-control",
    state: "stock-control",
    roles: ["UG001", "UG003", "UG004"],
    sidebarProps: {
      displayText: "Stock Control",
      icon: <TrendingUpIcon />,
    },
    child: [
      {
        roles: ["UG001", "UG003", "UG004"],
        path: "/stock-control/inventory-transfer-request",
        state: "/inventory-transfer-request",
        sidebarProps: {
          displayText: "Inventory Transfer Request",
        },
      },
      {
        roles: ["UG001", "UG003", "UG004"],
        path: "/stock-control/stock-transfer",
        state: "/stock-transfer",
        sidebarProps: {
          displayText: "Stock Transfer",
        },
      },
      {
        roles: ["UG001", "UG003", "UG004"],
        path: "/stock-control/good-issue",
        state: "/good-issue",
        sidebarProps: {
          displayText: "Good Issue",
        },
      },
      {
        roles: ["UG001", "UG003", "UG004"],
        path: "/stock-control/good-receipt",
        state: "/good-receipt",
        sidebarProps: {
          displayText: "Good Receipt",
        },
      },

      {
        roles: ["UG001", "UG003", "UG004"],
        path: "/stock-control/pump-test",
        state: "/pump-test",
        sidebarProps: {
          displayText: "Pump Test",
        },
      },
      {
        roles: ["UG001", "UG003", "UG004"],
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
    roles: ["UG001", "UG002", "UG003"],
    sidebarProps: {
      displayText: "Trip Management",
      icon: <LocalShippingIcon />,
    },
    child: [
      {
        roles: ['UG001', 'UG002'],
        path: "/trip-management/transportation-request",
        state: "transportation-request",
        sidebarProps: {
          displayText: "Transportation Request",
        },
      },
      {
        roles: ['UG001', 'UG003'],
        path: "/trip-management/transportation-order",
        state: "transportation-order",
        sidebarProps: {
          displayText: "Transportation Order",
        },
      },
      {
        roles: ["UG001", "UG003"],
        path: "/bulk/seal/allocation",
        state: "allocation",
        sidebarProps: {
          displayText: "Bulk Seal Allocation",
        },
      },
    ],
  },
];

export default appRoutes;
