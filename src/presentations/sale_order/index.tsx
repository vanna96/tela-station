import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFileAdd,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
} from "react-icons/ai";
import { useQuery } from "react-query";
import request from "@/utilies/request";

interface SaleOrderItem {
  title: string;
  icon: React.ReactNode;
  queryKey: string;
  filter: string;
  route: string;
}

const SaleOrderPage = () => {
  const navigate = useNavigate();

  const createUseQuery = (queryKey: string, endpoint: string) => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        try {
          const response = await request("GET", endpoint);
          return (response as { data?: number })?.data as number;
        } catch (error) {
          console.error(`Error fetching data for ${endpoint}:`, error);
          throw error;
        }
      },
      staleTime: Infinity,
    });
  };

  const goTo = (route: string) => navigate(`/sale-order/${route}`);

  const saleOrderItems: SaleOrderItem[] = [
    {
      title: "Fuel Sales",
      icon: <AiOutlineFileAdd />,
      queryKey: "fuelOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'Oil'",
      route: "fuel-sales",
    },
    {
      title: "Lube Sales",
      icon: <AiOutlineFileExcel />,
      queryKey: "lubeOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'Lube'",
      route: "lube-sales",
    },
    {
      title: "LPG Sales",
      icon: <AiOutlineFileProtect />,
      queryKey: "lpgOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'LPG'",
      route: "lpg-sales",
    },
  ];

  return (
    <>
      <MainContainer title="Sale Order">
        {saleOrderItems.map(
          ({ title, icon, queryKey, filter, route }, index) => {
            const { data, isLoading } = createUseQuery(
              queryKey,
              `Orders/$count?$filter=${filter}`
            );
            return (
              <ItemCard
                key={index}
                title={title}
                icon={icon}
                onClick={() => goTo(`${route}`)}
                amount={data || 0}
                isLoading={isLoading}
              />
            );
          }
        )}
      </MainContainer>
    </>
  );
};

export default SaleOrderPage;
