import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";
import { useContext } from "react";

interface CollectionItem {
  title: string;
  icon: React.ReactNode;
  queryKey: string;
  filter: string;
  route: string;
  roles: Role[]
}

const CollectionPage = () => {
  const navigate = useNavigate();

  const createUseQuery = (queryKey: string, filter: string) => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        try {
          const response = await request(
            "GET",
            `IncomingPayments/$count?$filter=${filter}`
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

  const goTo = (route: string) => navigate(`/banking/${route}`);

  const collectionItems: CollectionItem[] = [
    {
      title: "Settle Receipt",
      icon: <AiOutlineFileProtect />,
      queryKey: "settleReceipt",
      filter: "DocType eq 'rCustomer'",
      route: 'settle-receipt',
      roles: ['UG001', 'UG004'],
    },
    {
      title: "Payment on Account",
      icon: <AiOutlineFileProtect />,
      queryKey: "paymentAccount",
      filter: "DocType eq 'rCustomer'",
      route: 'payment-account',
      roles: ['UG001', 'UG004'],
    },
    {
      title: "Direct to Account",
      icon: <AiOutlineFileProtect />,
      queryKey: "directAccount",
      filter: "DocType eq 'rAccount'",
      route: 'direct-account',
      roles: ['UG001', 'UG004'],
    },
    {
      title: "Deposit",
      icon: <AiOutlineFileProtect />,
      queryKey: "deposit",
      filter: "DocType eq 'rAccount'",
      route: 'deposit'
    },
  ];


  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <MainContainer title="Collection">
      {collectionItems.map(({ title, icon, queryKey, filter, route, roles }, index) => {

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
      })}
    </MainContainer>
  );
};

export default CollectionPage;
