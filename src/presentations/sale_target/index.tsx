import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileAdd, AiOutlineFileSearch } from "react-icons/ai";
import request from "@/utilies/request";
import { useQuery } from "react-query";

const SaleTargetPage = () => {
  const navigate = useNavigate();

  const { data, isLoading }: any = useQuery({
    queryKey: ["saleTarget"],
    queryFn: async () => {
      try {
        const response = await request("GET", "TL_SALES_SCENARIO/$count");
        return (response as { data?: number })?.data as number;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    staleTime: Infinity,
  });

  const goTo = (route: string) => navigate("/sale-target/" + route);

  return (
    <>
      <MainContainer title="Sale Target">
        <ItemCard
          title="Sale Scenario "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sale-scenario")}
          amount={data || 0}
        />
        <ItemCard
          title="Sale Target "
          icon={<AiOutlineFileSearch />}
          onClick={() => goTo("sale-target")}
          amount={data || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleTargetPage;
