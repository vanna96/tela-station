import MainContainer from "@/components/MainContainer"
import ItemCard from "@/components/card/ItemCart"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineFileProtect } from "react-icons/ai"
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository"

const SaleMasterPage = () => {
  const navigate = useNavigate()
  const [count, setCount]: any = useState()
  const goTo = (route: string) => navigate("/banking/" + route)
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
      <MainContainer title="Banking">
        {/* <ItemCard
          title="Incoming Payments"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("incoming-payments")}
          amount={count?.incomingPayment || 0}
        />
        <ItemCard
          title="Outgoing Payments"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("outgoing-payment")}
          amount={count?.incomingPayment || 0}
        /> */}
        <ItemCard
          title="Settle Receipt"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("settle-receipt")}
          amount={count?.settleReceipt || 0}
        />
        <ItemCard
          title="Payment on Account"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("payment-account")}
          amount={count?.paymentAccount || 0}
        />
        <ItemCard
          title="Direct to Account"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("direct-account")}
          amount={count?.directAccount || 0}
        />
      </MainContainer>
    </>
  )
}

export default SaleMasterPage
