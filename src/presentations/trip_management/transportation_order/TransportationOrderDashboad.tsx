import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineFileProtect } from "react-icons/ai";
import TransportationOrderList from "@/presentations/trip_management/transportation_order";
import { Button } from "@mui/material";
import { useQuery } from "react-query";
import request from "@/utilies/request";

const TransportationOrderDashboad = () => {
  const navigate = useNavigate();
  const goTo = (route: string) => navigate(`?status=${route}`);

  const countQuery: any = useQuery({
    queryKey: ["count"],
    queryFn: () => request("GET", `/TL_TO`),
    refetchOnWindowFocus: false,
  });

  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  if (
    status === "i" ||
    status === "p" ||
    status === "s" ||
    status === "d" ||
    status === "r" ||
    status === "cp" ||
    status === "c"
  ) {
    return <TransportationOrderList />;
  } else {
    return (
      <div>
        <span className="float-right -mb-[10rem] mt-[1.2rem] mr-[1.7rem]">
          <Button
            sx={{ height: "30px" }}
            className="bg-white z-50"
            size="small"
            variant="contained"
            disableElevation
            onClick={() =>
              navigate("/trip-management/working-transportation-request")
            }
          >
            <span className="px-3 text-[11px] py-7 text-white">
              Generate WTR
            </span>
          </Button>
        </span>
        <MainContainer title="Transportation Orders">
          <ItemCard
            title="Initiated"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("i")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "I"
              )?.length || 0
            }
          />
          <ItemCard
            title="Planned"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("p")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "P"
              )?.length || 0
            }
          />
          <ItemCard
            title="Seal Number"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("s")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "S"
              )?.length || 0
            }
          />
          <ItemCard
            title="Dispatched"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("d")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "D"
              )?.length || 0
            }
          />
          <ItemCard
            title="Released"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("r")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "R"
              )?.length || 0
            }
          />
          <ItemCard
            title="Completed"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("cp")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "CP"
              )?.length || 0
            }
          />
          <ItemCard
            title="Cancelled"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("c")}
            amount={
              countQuery?.data?.data?.value?.filter(
                (e: any) => e?.U_Status === "C"
              )?.length || 0
            }
          />
        </MainContainer>
      </div>
    );
  }
};

export default TransportationOrderDashboad;
