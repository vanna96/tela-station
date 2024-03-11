import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineFileProtect } from "react-icons/ai";
import TransportationOrderList from "@/presentations/trip_management/transportation_order";
import { Button } from "@mui/material";
const TransportationOrderDashboad = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate(`?status=${route}`);
  const getCount = async () => {
    setCount({
      ...count,
    });
  };

  useEffect(() => {
    getCount();
  }, []);
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
            onClick={() => navigate("/trip-management/working-transportation-request")}
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
            amount={count?.request || 0}
          />
          <ItemCard
            title="Planned"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("p")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Seal Number"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("s")}
            amount={count?.allocation || 0}
          />
          <ItemCard
            title="Dispatched"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("d")}
            amount={count?.request || 0}
          />
          <ItemCard
            title="Released"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("r")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Completed"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("cp")}
            amount={count?.allocation || 0}
          />
          <ItemCard
            title="Cancelled"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("c")}
            amount={count?.allocation || 0}
          />
        </MainContainer>
      </div>
    );
  }
};

export default TransportationOrderDashboad;
