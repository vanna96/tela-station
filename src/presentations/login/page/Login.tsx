import React from "react"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import Alert from "@mui/material/Alert"
import request from "../../../utilies/request"
import AuthLogin from "../../../models/AuthLogin"
import ItemGroupRepository from "../../../services/actions/itemGroupRepository"
import UnitOfMeasurementRepository from "../../../services/actions/unitOfMeasurementRepository"
import DepartmentRepository from "@/services/actions/departmentRepository"
import PaymentMethodRepository from "../../../services/actions/paymentMethodRepository"
import PaymentTermTypeRepository from "../../../services/actions/paymentTermTypeRepository"
import OwnerRepository from "@/services/actions/ownerRepository"
import ShippingTypeRepository from "../../../services/actions/shippingTypeRepository"
import SalePersonRepository from "@/services/actions/salePersonRepository"
import GLAccountRepository from "@/services/actions/GLAccountRepository"
import VatGroupRepository from "@/services/actions/VatGroupRepository"
import BranchRepository from "../../../services/actions/branchRepository"
import WarehouseRepository from "@/services/warehouseRepository"
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository"
import PriceListRepository from "@/services/actions/pricelistRepository"
import UsersRepository from "@/services/actions/usersRepository"
import CustomsGroupRepository from "@/services/actions/customsGroupRepository"
import ManufacturerRepository from "@/services/actions/manufacturerRepository"
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository"
import GetCurrentUserRepository from "../repository/getCurrencyUserRepository"
import MUITextField from "@/components/input/MUITextField"

// import sapLog from "../../../assets/sap_logo.png"
import BizLogo from "../../../assets/img/big-logo.png"
import { Collapse } from "@mui/material"
import { BASE_BG_COLOR } from "@/configs"
import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository"
import ProjectRepository from "@/services/actions/projectRepository"

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["sessionId", "user"])
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const navigate = useNavigate()

  const company = React.useRef("TMCT")
  const username = React.useRef("manager")
  const password = React.useRef("Admin@123")

  const onSubmit = async () => {
    try {
      setLoading(true)
      // const auth = new AuthLogin(company.current, username.current, password.current);
      const auth = new AuthLogin("SBODemoAU", "manager", "manager")
      const response: any = await request("POST", "/Login", auth.toJson())
      setCookie("sessionId", response?.data?.SessionId, { maxAge: 2000 })
      const user = await GetCurrentUserRepository.post()
      setCookie("user", user, { maxAge: 2000 })
      await fetchAllDate()
      navigate("/")
    } catch (e: any) {
      console.log(e)
      setMessage(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const onChange = (event: any, field: string) => {
    switch (field) {
      case "company":
        company.current = event.target.value
        break
      case "password":
        password.current = event.target.value
        break
      default:
        username.current = event.target.value
    }
  }

  async function fetchAllDate(): Promise<void> {
    Promise.all([
      await new ItemGroupRepository().get(),
      await new UnitOfMeasurementRepository().get(),
      await new UnitOfMeasurementGroupRepository().get(),
      await new DepartmentRepository().get(),
      await new PaymentMethodRepository().get(),
      await new PaymentTermTypeRepository().get(),
      await new OwnerRepository().get(),
      await new ShippingTypeRepository().get(),
      await new SalePersonRepository().get(),
      await new GLAccountRepository().get(),
      await new VatGroupRepository().get(),
      await new BranchRepository().get(),
      await new WarehouseRepository().get(),
      await new DistributionRuleRepository().get(),
      await new PriceListRepository().get(),
      // await new UsersRepository().get(),
      await new DistributionRuleRepository().get,
      await new CustomsGroupRepository().get(),
      await new ManufacturerRepository().get(),

      // vanna new modified
      await new ChartOfAccountsRepository().get(),
      await new ProjectRepository().get(),
    ])
  }

  return (
    <div className="w-full h-full flex justify-center items-center dark-theme">
      <div className="w-[30rem] h-[60vh] flex flex-col justify-between gap-2 p-10 pb-0 rounded-xl shadow-xl border bg-white">
        <div className="grow">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl ">TELA Station</h2>

            <img src={BizLogo} className="w-[12rem]" />
          </div>

          <div className="h-10"></div>
          <h2 className="font-bold text-2xl my-3">SIGN ME IN</h2>
          <Collapse in={message !== ""}>
            <div className="my-2">
              {message && (
                <Alert severity="error" onClose={() => setMessage("")}>
                  {message}
                </Alert>
              )}
            </div>
          </Collapse>

          <div className="flex flex-col gap-2">
            <MUITextField
              label="Company"
              id="outlined-size-small"
              size="small"
              defaultValue={company.current}
              onChange={(event) => onChange(event, "company")}
            />
            <MUITextField
              label="Username"
              id="outlined-size-small"
              size="small"
              defaultValue={username.current}
              onChange={(event) => onChange(event, "username")}
            />
            <MUITextField
              label="Password"
              type="password"
              id="outlined-size-small"
              size="small"
              defaultValue={password.current}
              onChange={(event) => onChange(event, "password")}
            />
          </div>
        </div>

        <div className="h-20 w-full">
          <LoadingButton
            fullWidth
            sx={{ backgroundColor: `${BASE_BG_COLOR} !important` }}
            className="text-white"
            variant="contained"
            disableElevation
            loading={loading}
            onClick={onSubmit}
          >
            <span className="font-bold">Login</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
