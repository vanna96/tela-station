import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFileAdd,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
  AiOutlineSolution,
} from "react-icons/ai";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

interface SaleOrderItem {
  title: string;
  icon: React.ReactNode;
  queryKey: string;
  filter: string;
  route: string;
  roles: Role[];
}

const Page = () => {
  const navigate = useNavigate();
  const { getRoleCode } = useContext(AuthorizationContext);

  const goTo = (route: string) => navigate(`/wholesale/sale-order/${route}`);
  const fetchModuleCount = async (endpoint: string): Promise<number> => {
    const response = (await request("GET", endpoint)) as { data: number }; // Assuming response.data is of type number
    return response.data;
  };

  const {
    data: count,
    error,
    isLoading,
  } = useQuery(
    "moduleCount",
    async () => {
      const [
        // sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,
        deliveryNote,
        fuelInvoice,
        lubeInvoice,
        lpgInvoice,
      ] = await Promise.all([
        // sale orders
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Oil'"
        ),
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Lube'"
        ),
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'LPG'"
        ),
        fetchModuleCount("DeliveryNotes/$count"),
        fetchModuleCount(
          "Invoices/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Oil'"
        ),
        fetchModuleCount(
          "Invoices/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Lube'"
        ),
        fetchModuleCount(
          "Invoices/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'LPG'"
        ),
      ]);

      return {
        // sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,
        deliveryNote,
        fuelInvoice,
        lubeInvoice,
        lpgInvoice,
      };
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  );

  if (error) {
    // Handle error if needed
    console.error("Error fetching data:", error);
  }

  const renderCards = (cards: any[]) => {
    return cards.map((card) => {
      if (!card?.roles?.includes(getRoleCode as Role)) return null;

      return (
        <ItemCard
          key={card.amountKey}
          title={card.title}
          icon={<AiOutlineSolution />}
          amount={count?.[card.amountKey as keyof typeof count] || 0}
          onClick={() => navigate(card.route)}
          isLoading={card.isLoading}
        />
      );
    });
  };
  const saleOrderCards = renderCards([
    {
      title: "Fuel Sales",
      amountKey: "fuelOrders",
      route: "/wholesale/sale-order/fuel-sales",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Lube Sales",
      amountKey: "lubeOrders",
      route: "/wholesale/sale-order/lube-sales",
      roles: ["UG001", "UG004"],
    },
    {
      title: "LPG Sales",
      amountKey: "lpgOrders",
      route: "/wholesale/sale-order/lpg-sales",
      roles: ["UG001", "UG004"],
    },
  ]);

  const saleDeliveryCards = renderCards([
    {
      title: "Delivery Note",
      amountKey: "deliveryNote",
      route: "/wholesale/delivery/delivery-note",
      roles: ["UG001", "UG004"],
    },
  ]);
  const saleInvoiceCards = renderCards([
    {
      title: "Fuel Invoice",
      amountKey: "fuelInvoice",
      route: "/wholesale/sale-invoice/fuel-invoice",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Lube Invoice",
      amountKey: "lubeInvoice",
      route: "/wholesale/sale-invoice/lube-invoice",
      roles: ["UG001", "UG004"],
    },
    {
      title: "LPG Invoice",
      amountKey: "lpgInvoice",
      route: "/wholesale/sale-invoice/lpg-invoice",
      roles: ["UG001", "UG004"],
    },
  ]);
  const sections = [
    { title: "Sale Order", cards: saleOrderCards, roles: ["UG001", "UG004"] },
    {
      title: "Delivery",
      cards: saleDeliveryCards,
      roles: ["UG001", "UG004"],
    },
    {
      title: "Sale Invoice",
      cards: saleInvoiceCards,
      roles: ["UG001", "UG004"],
    },
  ];
  return (
    <div className="px-6">
      {sections.map((section, index) => {
        if (!section.roles?.includes(getRoleCode as Role)) return null;

        return (
          <>
            <div key={index}>
              <h1 className="mb-4 mt-6">{section.title}</h1>
              <div className="grid grid-cols-6 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {section.cards}
              </div>
              <div className="mb-10" />
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Page;
