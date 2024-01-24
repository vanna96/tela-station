import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useQueries } from "react-query";
import request, { url } from "@/utilies/request";

const MasterDataPage = () => {
  const navigate = useNavigate();

  const goTo = (route: string) => navigate("/master-data/" + route);

  const count = useQueries([
    {
      queryKey: ['count_pump'], queryFn: async () => {
        const response: any = await request(
          "GET",
          `${url}/TL_Dispenser/$count`
        )
          .then(async (res: any) => res?.data)
          .catch((e: Error) => {
            throw new Error(e.message);
          });
        return response;
      }
    },
    {
      queryKey: ['count_pump_attendant'], queryFn: async () => {
        const response: any = await request(
          "GET",
          `${url}/TL_PUMP_ATTEND/$count`
        )
          .then(async (res: any) => res?.data)
          .catch((e: Error) => {
            throw new Error(e.message);
          });
        return response;
      }
    },
    {
      queryKey: ['count_exp_dic'], queryFn: async () => {
        const response: any = await request(
          "GET",
          `${url}/TL_ExpDic/$count`
        )
          .then(async (res: any) => res?.data)
          .catch((e: Error) => {
            throw new Error(e.message);
          });
        return response;
      }
    },
    {
      queryKey: ['count_caash_acct'], queryFn: async () => {
        const response: any = await request(
          "GET",
          `${url}/TL_CashAcct/$count`
        )
          .then(async (res: any) => res?.data)
          .catch((e: Error) => {
            throw new Error(e.message);
          });
        return response;
      }
    }
  ])

  return (
    <>
      <MainContainer title="Master Data">
        <ItemCard
          title="Pump"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("pump")}
          amount={
            count[0]?.data || 0
          }
        />
        <ItemCard
          title="Pump Attendant"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("pump-attendant")}
          amount={
            count[1]?.data || 0
          }
        />
        <ItemCard
          title="Expense Dictionary"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("expense-dictionary")}
          amount={
            count[2]?.data || 0
          }
        />
        <ItemCard
          title="Cash Account"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("cash-account")}
          amount={
            count[3]?.data || 0
          }
        />
        <ItemCard
          title="Driver"
          amount={0}
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("driver")}
        />

        <ItemCard
          title="Stops"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("stops")}
          amount={
            // count?.order ||
            0
          }
        />
        <ItemCard
          title="Route"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("route")}
          amount={
            // count?.order ||
            0
          }
        />
      </MainContainer>
    </>
  );
};

export default MasterDataPage;
