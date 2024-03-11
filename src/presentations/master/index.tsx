import { useQuery } from "react-query";
import { AiOutlineFileProtect } from "react-icons/ai";
import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useNavigate } from "react-router-dom";
import request, { url } from "@/utilies/request";
import { useContext } from "react";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

const MasterDataPage = () => {
  const navigate = useNavigate();

  const goTo = (route: string) => navigate(`/master-data/${route}`);

  const queryConfig = [
    { key: "count_pump", title: "Pump", urlKey: "TL_Dispenser", roles: ['UG001'] },
    {
      key: "count_pump_attendant",
      title: "Pump Attendant",
      urlKey: "TL_PUMP_ATTEND",
      roles: ['UG001']
    },
    { key: "count_exp_dic", title: "Expense Dictionary", urlKey: "TL_ExpDic", roles: ['UG001'] },
    { key: "count_caash_acct", title: "Cash Account", urlKey: "TL_CashAcct", roles: ['UG001'] },
    { key: "count_driver", title: "Driver", urlKey: "EmployeesInfo", roles: ['UG001'] },
    { key: "count_vehicle", title: "Vehicle", urlKey: "TL_VEHICLE", roles: ['UG001'] },
    { key: "count_stops", title: "Stops", urlKey: "TL_STOPS", roles: ['UG001'] },
    { key: "count_route", title: "Route", urlKey: "TL_ROUTE", roles: ['UG001'] },
  ];

  const queries = queryConfig.map(({ key, urlKey }) =>
    useQuery(
      [key],
      async () => {
        const response: any = await request("GET", `${url}/${urlKey}/$count`);
        return response?.data;
      },
      {
        staleTime: 1800000, // 30 minutes in milliseconds
      }
    )
  );

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <MainContainer title="Master Data">
      {queryConfig.map(({ title, roles }, index) => {
        if (!roles.includes(getRoleCode as Role)) return null;

        return (
          <ItemCard
            key={title}
            title={title}
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo(title.toLowerCase().replace(/\s/g, "-"))}
            amount={queries[index]?.data || 0}
            isLoading={queries[index]?.isLoading} />
        );
      })}
    </MainContainer>
  );
};

export default MasterDataPage;
