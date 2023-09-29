import MainContainer from "@/components/MainContainer"
import ItemCard from "@/components/card/ItemCart"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineFileProtect } from "react-icons/ai"
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository"

const ExpensePage = () => {
  const navigate = useNavigate()
  const [count, setCount]: any = useState()
  const goTo = (route: string) => navigate("/expense/" + route)
  const getCount = async () => {
    const settleReceipt = await new IncomingPaymentRepository().getCount({
      params: {
        $filter: `DocType eq 'rCustomer'`,
      },
    })
    const paymentAccount = await new IncomingPaymentRepository().getCount({
      params: {
        $filter: `DocType eq 'rCustomer'`,
      },
    })
    const directAccount = await new IncomingPaymentRepository().getCount({
      params: {
        $filter: `DocType eq 'rAccount'`,
      },
    })

    setCount({
      ...count,
      settleReceipt,
      paymentAccount,
      directAccount
    })
  }

  useEffect(() => {
    getCount()
  }, [])

  return (
    <>
      <MainContainer title="Expense Log">
        <ItemCard
          title="Expense Log"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("log")}
          amount={0}
        />
        <ItemCard
          title="Expense Clearence"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("clearance")}
          amount={0}
        />
      </MainContainer>
    </>
  )
}

export default ExpensePage
