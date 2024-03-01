import MainContainer from "@/components/MainContainer"
import ItemCard from "@/components/card/ItemCart"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineFileProtect } from "react-icons/ai"
import request from "@/utilies/request"
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext"

const TripManagementPage = () => {
  const navigate = useNavigate()
  const [count, setCount]: any = useState()
  const goTo = (route: string) => navigate("/trip-management/" + route)
  const getCount = async () => {
    // const logs = await request("GET", "TL_ExpLog/$count").then((res:any) => res.data)
    // const clearance = await request("GET", "TL_ExpClear/$count").then((res:any) => res.data)

    setCount({
      ...count,
      // logs,
      // clearance
    })
  }

  useEffect(() => {
    getCount()
  }, [])

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <>
      <MainContainer title="Trip Management">
        {
          ['UG001', 'UG002', 'UG003'].includes(getRoleCode as Role) && <ItemCard
            title="Transportation Request"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("transportation-request")}
            amount={count?.request || 0}
          />
        }
        {
          ['UG001', 'UG002', 'UG003'].includes(getRoleCode as Role) && <ItemCard
            title="Transportation Order"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("transportation-order")}
            amount={count?.order || 0}
          />
        }
        {
          ['UG001', 'UG002', 'UG003'].includes(getRoleCode as Role) && <ItemCard
            title="Bulk Seal Allocation"
            icon={<AiOutlineFileProtect />}
            onClick={() => goTo("bulk-Seal-allocation")}
            amount={count?.allocation || 0}
          />
        }

      </MainContainer>
    </>
  )
}

export default TripManagementPage
