import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFileAdd,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
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
  roles: Role[]
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
      roles: ['UG001', 'UG004'],
      title: "Fuel Sales",
      icon: <AiOutlineFileAdd />,
      queryKey: "fuelOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'Oil'",
      route: "fuel-sales",
    },
    {
      roles: ['UG001', 'UG004'],
      title: "Lube Sales",
      icon: <AiOutlineFileExcel />,
      queryKey: "lubeOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'Lube'",
      route: "lube-sales",
    },
    {
      roles: ['UG001', 'UG004'],
      title: "LPG Sales",
      icon: <AiOutlineFileProtect />,
      queryKey: "lpgOrder",
      filter: "U_tl_salestype eq null and U_tl_arbusi eq 'LPG'",
      route: "lpg-sales",
    },
  ];

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <>
      <MainContainer title="Sale Order">
        {saleOrderItems.map(
          ({ title, icon, queryKey, filter, route, roles }, index) => {

            if (!roles.includes(getRoleCode as Role)) return null;

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
