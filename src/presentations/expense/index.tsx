import MainContainer from "@/components/MainContainer"
import ItemCard from "@/components/card/ItemCart"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineFileProtect } from "react-icons/ai"
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository"
import request from "@/utilies/request"

const ExpensePage = () => {
  const navigate = useNavigate()
  const [count, setCount]: any = useState()
  const goTo = (route: string) => navigate("/expense/" + route)
  const getCount = async () => {
    const logs = await request("GET", "TL_ExpLog/$count").then((res:any) => res.data)
    const clearance = await request("GET", "TL_ExpClear/$count").then((res:any) => res.data)
    
    setCount({
      ...count,
      logs,
      clearance
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
          amount={count?.logs || 0}
        />
        <ItemCard
          title="Expense Clearence"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("clearance")}
          amount={count?.clearance || 0}
        />
      </MainContainer>
    </>
  )
}

export default ExpensePage
