import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import request from "../../../utilies/request";
import AuthLogin from "../../../models/AuthLogin";
import ItemGroupRepository from "../../../services/actions/itemGroupRepository";
import UnitOfMeasurementRepository from "../../../services/actions/unitOfMeasurementRepository";
import DepartmentRepository from "@/services/actions/departmentRepository";
import PaymentMethodRepository from "../../../services/actions/paymentMethodRepository";
import PaymentTermTypeRepository from "../../../services/actions/paymentTermTypeRepository";
import OwnerRepository from "@/services/actions/ownerRepository";
import ShippingTypeRepository from "../../../services/actions/shippingTypeRepository";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import VatGroupRepository from "@/services/actions/VatGroupRepository";
import BranchRepository from "../../../services/actions/branchRepository";
import WarehouseRepository from "@/services/warehouseRepository";
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository";
import PriceListRepository from "@/services/actions/pricelistRepository";
import CustomsGroupRepository from "@/services/actions/customsGroupRepository";
import ManufacturerRepository from "@/services/actions/manufacturerRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import GetCurrentUserRepository from "../repository/getCurrencyUserRepository";
import MUITextField from "@/components/input/MUITextField";
import TelaCover from "../../../assets/img/tela-cover.jpg";
import BizLogo from "../../../assets/img/big-logo.png";
import { BASE_BG_COLOR } from "@/configs";
import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository";
import ProjectRepository from "@/services/actions/projectRepository";
import { Alert, AlertTitle, TextField } from "@mui/material";
import WareBinLocationRepository from '../../../services/whBinLocationRepository';

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["sessionId", "user"]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  const company = React.useRef("TLTELA_LIVE");
  const username = React.useRef("manager");
  const password = React.useRef("Admin@tela");

  const onSubmit = async () => {
    try {
      setLoading(true);
      const auth = new AuthLogin(
        company.current,
        username.current,
        password.current
      );
      // const auth = new AuthLogin("SBODemoAU", "manager", "manager");
      const response: any = await request("POST", "/Login", auth.toJson());
      setCookie("sessionId", response?.data?.SessionId, { maxAge: 2000 });
      const user = await GetCurrentUserRepository.post();
      setCookie("user", user, { maxAge: 2000 });
      await fetchAllDate();
      navigate("/");
    } catch (e: any) {
      console.log(e);
      setMessage(e?.message);
      // setMessage("Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event: any, field: string) => {
    switch (field) {
      case "company":
        company.current = event.target.value;
        break;
      case "password":
        password.current = event.target.value;
        break;
      default:
        username.current = event.target.value;
    }
  };

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
      await new WareBinLocationRepository().get()
    ]);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[90vh] bg-gray-100">
        {/* <div className="w-full">
          <div className="ml-20 mt-0 mb-12 sticky">
            <img
              src={BizLogo}
              className="w-[16%] h-[16%]"
              alt="Business Logo"
            />
          </div>
        </div> */}

        <div className="flex items-center justify-center w-full mt-4">
          <div className="w-4/6 h-[60vh] bg-white border border-gray-300 shadow-xl flex rounded-xl p-2">
            <div className="w-8/12 lg:w-6/12 md:hidden sm:hidden bg-cover p-4 rounded-xl">
              <img
                className="rounded-l-lg rounded-r-sm"
                src={TelaCover}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt="Background"
              />
            </div>
            <div className="w-4/12 lg:w-6/12 md:w-full sm:w-full p-6 flex flex-col justify-center ">
              <div className="flex flex-col space-y-4">
                <h1 className="text-xl font-semibold">Sign In</h1>
                {/* <MUITextField
                  label="Company"
                  id="outlined-size-small"
                  size="small"
                  hidden
                  defaultValue={company.current}
                  onChange={(event) => onChange(event, "company")}
                /> */}
                <input
                  hidden
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
                {message ? (
                  <Alert severity="error">
                    <strong>{message}</strong> Incorrect username or password
                  </Alert>
                ) : (
                  ""
                )}
                <div className="pt-0 w-full">
                  <LoadingButton
                    fullWidth
                    sx={{ backgroundColor: `${BASE_BG_COLOR} !important` }}
                    className="text-white"
                    variant="contained"
                    loading={loading}
                    onClick={onSubmit}
                  >
                    Login
                  </LoadingButton>
                </div>
                {/* <div className="mt-2 text-xs text-center text-[#656565]">
                  <p> If you forgot your Username, please call</p>
                  <p className="font-medium "> +855 (0) 23 925 333</p>
                </div> */}

                <div className="mt-2 text-xs text-center text-[#656565]">
                <p>© 2023 BIZDIMENSION Co., LTD. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
