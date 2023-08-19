import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileAdd, AiOutlineFileProtect } from "react-icons/ai";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";

const SaleMasterPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/banking/" + route);
  const getCount = async () => {
    const incomingPayment = await new IncomingPaymentRepository().getCount({});

    setCount({
      ...count,
      incomingPayment,
    });
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <>
      <MainContainer title="Banking">
        <ItemCard
          title="Incoming Payments"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("incoming-payments")}
          count={count?.incomingPayment || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleMasterPage;
