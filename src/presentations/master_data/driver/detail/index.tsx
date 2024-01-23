import React, { useEffect, useState } from "react";
import { withRouter } from "@/routes/withRouter";
import { arrayBufferToBlob, dateFormat } from "@/utilies";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import shortid from "shortid";
import request from "@/utilies/request";
import { fetchSAPFile, numberWithCommas, sysInfo } from "@/helper/helper";
import DocumentHeader from "@/components/DocumenHeader";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import { useQuery } from "react-query";
import PositionRepository from "@/services/actions/positionRepository";
import DepartmentRepository from "@/services/actions/departmentRepository";
import  ManagerRepository from '@/services/actions/ManagerRepository';
import TerminationReasonRepository from "@/services/actions/terminationReason";
import CountryRepository from "@/services/actions/countryReporitory";

function FormDetail(props: any) {
  const [state, setState] = useState({
    loading: true,
    isError: false,
    message: "",
    tapIndex: 0,
  });
  const [driver, setDriver] = useState({});
  const fetchData = async () => {
    const { id }: any = props?.match?.params || 0;
    if (id) {
      await request("GET", `EmployeesInfo(${id})`)
        .then((res: any) => {
        setDriver(res?.data)
          setState({
            ...state,
            loading: false,
          });
        })
        .catch((err: any) =>
          setState({ ...state, isError: true, message: err.message })
        );
    }
  };
console.log(driver);

  useEffect(() => {
    fetchData();
  }, []);
  const handlerChangeMenu = (index: number) => {
    setState({ ...state, tapIndex: index });
  };
  const HeaderTaps = () => {
    return (
      <>
        <MenuButton
          active={state.tapIndex === 0}
          onClick={() => handlerChangeMenu(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 1}
          onClick={() => handlerChangeMenu(1)}
        >
          Address
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Personal
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 3}
          onClick={() => handlerChangeMenu(3)}
        >
          Finance
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 4}
          onClick={() => handlerChangeMenu(4)}
        >
          Remarks
        </MenuButton>

        {/* ... Other menu buttons ... */}
      </>
    );
  };

  return (
    <>
      <DocumentHeader data={state} menuTabs={HeaderTaps} />

      <form
        id="formData"
        className="h-full w-full flex flex-col gap-4 relative"
      >
        {state.loading ? (
          <div className="w-full h-full flex item-center justify-center">
            <LoadingProgress />
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="grow  px-16 py-4 ">
                {state.tapIndex === 0 && <General data={driver} />}
                {state.tapIndex === 1 && <Address data={driver} />}
                {state.tapIndex === 2 && <Personal data={driver} />}
                {state.tapIndex === 3 && <Finance data={driver} />}
                {state.tapIndex === 4 && <Remark data={driver} />}
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
}

export default withRouter(FormDetail);

function General(props: any) {
  const { data }: any = props;
     const position:any = useQuery({
       queryKey: ["position"],
       queryFn: () => new PositionRepository().get(),
       staleTime: Infinity,
     });
  const manager: any = useQuery({
    queryKey: ["manager"],
    queryFn: () => new ManagerRepository().get(),
    staleTime: Infinity,
  });
  const reason: any = useQuery({
    queryKey: ["terminationReason"],
    queryFn: () => new TerminationReasonRepository().get(),
    staleTime: Infinity,
  });

  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          General
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> First Name</div>
                <div className="col-span-1 text-gray-900">
                  {data?.FirstName ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Last Name</div>
                <div className="col-span-1 text-gray-900">
                  {data?.LastName ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Middle name</div>
                <div className="col-span-1 text-gray-900">
                  {data?.MiddleName ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">
                  {" "}
                  Employees Code{" "}
                </div>
                <div className="col-span-1 text-gray-900">
                  {data?.EmployeeCode || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Position </div>
                <div className="col-span-1 text-gray-900">
                  {position?.data?.find(
                    (e: any) => e?.PositionID == data?.Position
                  ).Name || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Department </div>
                <div className="col-span-1 text-gray-900">
                  {new DepartmentRepository().find(data.Department)?.Name ||
                    "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Manager </div>
                <div className="col-span-1 text-gray-900">
                  {manager?.data?.find(
                    (e: any) => e?.EmployeeID === data?.Manager
                  )?.LastName +
                    " " +
                    manager?.data?.find(
                      (e: any) => e?.EmployeeID === data?.Manager
                    )?.FirstName}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">
                  {" "}
                  Branch Assignment{" "}
                </div>
                <div className="col-span-1 text-gray-900">
                  {data?.EmployeeBranchAssignment?.map(
                    (e: any) => e?.BPLID
                  ).join(" , ") || "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700">Mobile Phone</div>
                <div className="col-span-1  text-gray-900">
                  {data.MobilePhone ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Home Phone </div>
                <div className="col-span-1 text-gray-900">
                  {data?.HomePhone ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Email</div>
                <div className="col-span-1 text-gray-900">
                  {data.eMail ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">StartDate</div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(data.StartDate) ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Active</div>
                <div className="col-span-1 text-gray-900">
                  {data.Active.replace("t", "") ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Termination</div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(data.TerminationDate) ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">
                  Termination Reason
                </div>
                <div className="col-span-1 text-gray-900">
                  {reason?.data?.find(
                    (e: any) => e?.ReasonID === data.TreminationReason
                  )?.Name ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Address(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          Work Address
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-3">
                <div className="col-span-1 text-gray-700 ">Street</div>
                <div className="col-span-1 text-gray-900">
                  {data?.WorkStreet ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-3">
                <div className="col-span-1 text-gray-700 ">Street No</div>
                <div className="col-span-1 text-gray-900">
                  {data?.WorkStreetNumber ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">City</div>
                <div className="col-span-1 text-gray-900">
                  {data?.WorkCity ?? "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>

      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          Home Address
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-3">
                <div className="col-span-1 text-gray-700 ">Street</div>
                <div className="col-span-1 text-gray-900">
                  {data?.HomeStreet ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-3">
                <div className="col-span-1 text-gray-700 ">Street No</div>
                <div className="col-span-1 text-gray-900">
                  {data?.HomeStreetNumber ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">City</div>
                <div className="col-span-1 text-gray-900">
                  {data?.HomeCity ?? "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}

function Personal(props: any) {
  const { data }: any = props;
    const country: any = useQuery({
      queryKey: ["country"],
      queryFn: () => new CountryRepository().get(),
      staleTime: Infinity,
    });

  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          Personal
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Gender</div>
                <div className="col-span-1 text-gray-900">
                  {data?.Gender?.replace("gt_", "") ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Date Of Birth</div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(data?.DateOfBirth) ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">ID No.</div>
                <div className="col-span-1 text-gray-900">
                  {data?.IDNumber ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Martial Status</div>
                <div className="col-span-1 text-gray-900">
                  {(data?.MartialStatus).replace("mts_", "") || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 "> Blood Type </div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_CheckList || "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700">Citizenship</div>
                <div className="col-span-1  text-gray-900">
                  {country?.data?.find(
                    (e: any) => e?.Code === data.CitizenshipCountryCode
                  )?.Name ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Passport No. </div>
                <div className="col-span-1 text-gray-900">
                  {data?.PassportNumber ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">
                  Passport Expiration Date
                </div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(data.PassportExpirationDate) ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">
                  Passport Issued Date
                </div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(data.PassportIssueDate) ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">
                  {" "}
                  Passport Issuer
                </div>
                <div className="col-span-1 text-gray-900">
                  {data.PassportIssuer ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Finance(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          Personal
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Salary</div>
                <div className="col-span-1 text-gray-900">
                  {data?.Salary ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">SalaryUnit</div>
                <div className="col-span-1 text-gray-900">
                  {data?.SalaryUnit?.replace("scu_", "") ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Bank</div>
                <div className="col-span-1 text-gray-900">
                  {data?.BankCode ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Account No.</div>
                <div className="col-span-1 text-gray-900">
                  {data?.BankAccount ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Remark(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
          Personal
        </h2>
        <div className="py-4 px-10">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1 mb-2">
                <div className="col-span-1 text-gray-700 ">Remarks</div>
                <div className="col-span-1 text-gray-900">
                  {data?.Remarks ?? "N/A"}
                </div>
              </div>

          
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


