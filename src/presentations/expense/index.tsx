import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileProtect } from "react-icons/ai";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import { AuthorizationContext, Role } from '@/contexts/useAuthorizationContext';

const ExpensePage = () => {
  const navigate = useNavigate();
  const goTo = (route: string) => navigate("/expense/" + route);

  const { data: expenseLog, isLoadingLog }: any = useQuery({
    queryKey: ["expense"],
    queryFn: async () => {
      try {
        const response = await request("GET", "TL_ExpLog/$count");
        return (response as { data?: number })?.data as number;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    staleTime: Infinity,
  });

  const { data: expenseClearance, isLoadingExpense }: any = useQuery({
    queryKey: ["expenseClearance"],
    queryFn: async () => {
      try {
        const response = await request("GET", "TL_ExpClear/$count");
        return (response as { data?: number })?.data as number;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    staleTime: Infinity,
  });

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <>
      <MainContainer title="Expense Log">
        {
          ['UG001', 'UG004'].includes(getRoleCode as Role) && <ItemCard
            title="Expense Log"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("log")}
            amount={expenseLog || 0}
          />
        }
        {
          ['UG001', 'UG004'].includes(getRoleCode as Role) && <ItemCard
            title="Expense Clearence"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("clearance")}
            amount={expenseClearance || 0}
          />
        }
      </MainContainer>
    </>
  );
};

export default ExpensePage;
