import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { useContext } from "react";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

interface CollectionItem {
  title: string;
  icon: React.ReactNode;
  queryKey: string;
  filter: string;
  route: string;
  roles: Role[];
}

const RetailSalePage = () => {
  const navigate = useNavigate();

  const createUseQuery = (queryKey: string, filter: string) => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        try {
          const response = await request(
            "GET",
            `TL_RETAILSALE/$count${filter ? `?$filter=${filter}` : ""}`
          );

          return (response as { data?: number })?.data as number;
        } catch (error) {
          console.error(`Error fetching data for ${queryKey}:`, error);
          throw error;
        }
      },
      staleTime: Infinity,
    });
  };

  const goTo = (route: string) => navigate(`/retail-sale/${route}`);

  const collectionItems: CollectionItem[] = [
    {
      roles: ["UG001", "UG004"],
      title: "Fuel Cash Sales",
      icon: <AiOutlineFileProtect />,
      queryKey: "fuelOrders",
      filter: "",
      route: "fuel-cash-sale",
    },
    {
      roles: ["UG001", "UG004"],
      title: "Lube Cash Sales",
      icon: <AiOutlineFileProtect />,
      queryKey: "lubeOrders",
      filter: "",
      route: "lube-cash-sale",
    },
    {
      roles: ["UG001", "UG004"],
      title: "LPG Cash Sales",
      icon: <AiOutlineFileProtect />,
      queryKey: "lpgOrders",
      filter: "",
      route: "lpg-cash-sale",
    },
  ];

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <MainContainer title="Retail Sale">
      {collectionItems.map(
        ({ title, icon, queryKey, filter, route, roles }, index) => {
          if (!roles.includes(getRoleCode as Role)) return null;

          const { data, isLoading } = createUseQuery(queryKey, filter);

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
  );
};

export default RetailSalePage;
