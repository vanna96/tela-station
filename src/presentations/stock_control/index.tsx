import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

type MenuProps = {
  roles: Role[];
  title: string;
  route: string;
  icon: React.ReactNode;
  totalRecords: number;
  loading: boolean,
};

const StockControlPage = () => {
  const navigate = useNavigate();

  const goTo = (route: string) => navigate("/stock-control/" + route);

  const getTFCount = useQuery({
    queryKey: ["transfer_count"],
    queryFn: () => request("GET", "/StockTransfers/$count"),
  });
  const getITRCount = useQuery({
    queryKey: ["inventory_transfer_request_count"],
    queryFn: () => request("GET", "/InventoryTransferRequests/$count"),
  });
  const getGRCount = useQuery({
    queryKey: ["gr_count"],
    queryFn: () => request("GET", "/InventoryGenEntries/$count"),
  });
  const getGICount = useQuery({
    queryKey: ["gi_count"],
    queryFn: () => request("GET", "/InventoryGenExits/$count"),
  });
  const getFuelLevelCount = useQuery({
    queryKey: ["fuel_level_count"],
    queryFn: () => request("GET", "/TL_FUEL_LEVEL/$count"),
  });

  const items: MenuProps[] = useMemo(() => {
    return [
      {
        roles: ["UG001", "UG004"],
        title: "Inventory Transfer Request",
        route: "inventory-transfer-request",
        icon: <AiOutlineFileAdd />,
        totalRecords: (getITRCount?.data as any)?.data ?? 0,
        loading: getITRCount.isLoading
      },
      {
        roles: ["UG001", "UG004"],
        title: "Inventory Transfer",
        route: "inventory-transfer",
        icon: <AiOutlineFileAdd />,
        totalRecords: (getTFCount?.data as any)?.data ?? 0,
        loading: getTFCount.isLoading
      },
      {
        title: "Good Issue",
        route: "good-issue",
        icon: <AiOutlineFileAdd />,
        roles: ["UG001", "UG004"],
        totalRecords: (getGICount?.data as any)?.data ?? 0,
        loading: getGICount.isLoading
      },
      {
        title: "Good Receipt",
        route: "good-receipt",
        icon: <AiOutlineFileAdd />,
        roles: ["UG001", "UG004"],
        totalRecords: (getGRCount?.data as any)?.data ?? 0,
        loading: getGRCount.isLoading
      },
      {
        title: "Fuel Level",
        route: "fuel-level",
        icon: <AiOutlineFileAdd />,
        roles: ["UG001", "UG004"],
        totalRecords: (getFuelLevelCount?.data as any)?.data ?? 0,
        loading: getFuelLevelCount.isLoading
      },
    ] as MenuProps[];
  }, [getTFCount, getITRCount, getGRCount, getGICount, getFuelLevelCount]);

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <>
      <MainContainer title="Stock Control">
        {items.map(({ title, route, icon, roles, totalRecords, loading }, index) => {
          if (!roles.includes(getRoleCode as Role)) return null;

          return (
            <ItemCard
              key={index}
              title={title}
              icon={icon}
              onClick={() => goTo(route)}
              amount={totalRecords || 0}
              isLoading={loading}
            />
          );
        })}
      </MainContainer>
    </>
  );
};

export default StockControlPage;
