// import React, { useEffect, useState } from "react";
// import { withRouter } from "@/routes/withRouter";
// import { arrayBufferToBlob, dateFormat } from "@/utilies";
// import MenuButton from "@/components/button/MenuButton";
// import LoadingProgress from "@/components/LoadingProgress";
// import shortid from "shortid";
// import request from "@/utilies/request";
// import { fetchSAPFile, numberWithCommas, sysInfo } from "@/helper/helper";
// import DocumentHeader from "@/components/DocumenHeader";
// import BranchBPLRepository from "@/services/actions/branchBPLRepository";
// import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository";
// import GLAccountRepository from "@/services/actions/GLAccountRepository";
// import { useQuery } from "react-query";
// import PositionRepository from "@/services/actions/positionRepository";
// import DepartmentRepository from "@/services/actions/departmentRepository";
// import  ManagerRepository from '@/services/actions/ManagerRepository';
// import TerminationReasonRepository from "@/services/actions/terminationReason";
// import CountryRepository from "@/services/actions/countryReporitory";

// function VehicleDetail(props: any) {
//   const [state, setState] = useState({
//     loading: true,
//     isError: false,
//     message: "",
//     tapIndex: 0,
//   });
//   const [driver, setDriver] = useState({});
//   const fetchData = async () => {
//     const { id }: any = props?.match?.params || 0;
//     if (id) {
//       await request("GET", `EmployeesInfo(${id})`)
//         .then((res: any) => {
//         setDriver(res?.data)
//           setState({
//             ...state,
//             loading: false,
//           });
//         })
//         .catch((err: any) =>
//           setState({ ...state, isError: true, message: err.message })
//         );
//     }
//   };
// console.log(driver);

//   useEffect(() => {
//     fetchData();
//   }, []);
//   const handlerChangeMenu = (index: number) => {
//     setState({ ...state, tapIndex: index });
//   };
//   const HeaderTaps = () => {
//     return (
//       <>
//         <MenuButton
//           active={state.tapIndex === 0}
//           onClick={() => handlerChangeMenu(0)}
//         >
//           General
//         </MenuButton>
//         <MenuButton
//           active={state.tapIndex === 1}
//           onClick={() => handlerChangeMenu(1)}
//         >
//           Address
//         </MenuButton>
//         <MenuButton
//           active={state.tapIndex === 2}
//           onClick={() => handlerChangeMenu(2)}
//         >
//           Personal
//         </MenuButton>
//         <MenuButton
//           active={state.tapIndex === 3}
//           onClick={() => handlerChangeMenu(3)}
//         >
//           Finance
//         </MenuButton>
//         <MenuButton
//           active={state.tapIndex === 4}
//           onClick={() => handlerChangeMenu(4)}
//         >
//           Remarks
//         </MenuButton>

//         {/* ... Other menu buttons ... */}
//       </>
//     );
//   };

//   return (
//     <>
//       <DocumentHeader data={state} menuTabs={HeaderTaps} />

//       <form
//         id="formData"
//         className="h-full w-full flex flex-col gap-4 relative"
//       >
//         {state.loading ? (
//           <div className="w-full h-full flex item-center justify-center">
//             <LoadingProgress />
//           </div>
//         ) : (
//           <>
//             <div className="relative">
//               <div className="grow  px-16 py-4 ">
//                 {state.tapIndex === 0 && <General data={driver} />}
//                 {state.tapIndex === 1 && <Address data={driver} />}
//                 {state.tapIndex === 2 && <Personal data={driver} />}
//                 {state.tapIndex === 3 && <Finance data={driver} />}
//                 {state.tapIndex === 4 && <Remark data={driver} />}
//               </div>
//             </div>
//           </>
//         )}
//       </form>
//     </>
//   );
// }

// export default VehicleDetail;

// function General(props: any) {
//   const [branchId , setBranhId] = useState();
//   const { data }: any = props;
//      const position:any = useQuery({
//        queryKey: ["position"],
//        queryFn: () => new PositionRepository().get(),
//        staleTime: Infinity,
//      });
//   const manager: any = useQuery({
//     queryKey: ["manager"],
//     queryFn: () => new ManagerRepository().get(),
//     staleTime: Infinity,
//   });
//   const reason: any = useQuery({
//     queryKey: ["terminationReason"],
//     queryFn: () => new TerminationReasonRepository().get(),
//     staleTime: Infinity,
//   });
//    const branchAss: any = useQuery({
//     queryKey: ["branchAss"],
//     queryFn: () => new BranchBPLRepository().get(),
//     staleTime: Infinity,
//   });
// useEffect(() => {
//     data?.EmployeeBranchAssignment?.forEach((e:any)=> setBranhId(e?.BPLID))
// }, [data])
// console.log(branchAss);

//   return (
//     <>
//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           General
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> First Name</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.FirstName ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Last Name</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.LastName ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Middle name</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.MiddleName ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">
//                   {" "}
//                   Employees Code{" "}
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.EmployeeCode || "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Position </div>
//                 <div className="col-span-1 text-gray-900">
//                   {position?.data?.find(
//                     (e: any) => e?.PositionID == data?.Position
//                   )?.Name || "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Department </div>
//                 <div className="col-span-1 text-gray-900">
//                   {new DepartmentRepository()?.find(data?.Department)?.Name ||
//                     "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Manager </div>
//                 <div className="col-span-1 text-gray-900">

//                   {manager?.data?.find(
//                     (e: any) => e?.EmployeeID === data?.Manager
//                   )?.LastName +
//                     " " +
//                     manager?.data?.find(
//                       (e: any) => e?.EmployeeID === data?.Manager
//                     )?.FirstName}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1">
//                 <div className="col-span-1 text-gray-700 ">
//                   {" "}
//                   Branch Assignment{" "}
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {branchAss?.data?.find((e:any)=>e?.BPLID === branchId)?.BPLName || "N/A"}
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2"></div>
//             <div className="col-span-5 ">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700">Mobile Phone</div>
//                 <div className="col-span-1  text-gray-900">
//                   {data.MobilePhone ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Home Phone </div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.HomePhone ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Email</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data.eMail ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">StartDate</div>
//                 <div className="col-span-1 text-gray-900">
//                   {dateFormat(data.StartDate) ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Active</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data.Active === "tYES" ? "Active":"Inactive" ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Termination</div>
//                 <div className="col-span-1 text-gray-900">
//                   {dateFormat(data.TerminationDate) ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">
//                   Termination Reason
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {reason?.data?.find(
//                     (e: any) => e?.ReasonID === data.TreminationReason
//                   )?.Name ?? "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function Address(props: any) {
//   const { data }: any = props;
//   return (
//     <>
//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           Work Address
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-3">
//                 <div className="col-span-1 text-gray-700 ">Street</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.WorkStreet ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-3">
//                 <div className="col-span-1 text-gray-700 ">Street No</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.WorkStreetNumber ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1">
//                 <div className="col-span-1 text-gray-700 ">City</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.WorkCity ?? "N/A"}
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2"></div>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           Home Address
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-3">
//                 <div className="col-span-1 text-gray-700 ">Street</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.HomeStreet ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-3">
//                 <div className="col-span-1 text-gray-700 ">Street No</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.HomeStreetNumber ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1">
//                 <div className="col-span-1 text-gray-700 ">City</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.HomeCity ?? "N/A"}
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2"></div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function Personal(props: any) {
//   const { data }: any = props;
//     const country: any = useQuery({
//       queryKey: ["country"],
//       queryFn: () => new CountryRepository().get(),
//       staleTime: Infinity,
//     });

//   return (
//     <>
//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           Personal
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Gender</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.Gender?.replace("gt_", "") ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Date Of Birth</div>
//                 <div className="col-span-1 text-gray-900">
//                   {dateFormat(data?.DateOfBirth) ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">ID No.</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.IDNumber ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Martial Status</div>
//                 <div className="col-span-1 text-gray-900">
//                   {(data?.MartialStatus).replace("mts_", "") || "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 "> Blood Type </div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.U_CheckList || "N/A"}
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2"></div>
//             <div className="col-span-5 ">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700">Citizenship</div>
//                 <div className="col-span-1  text-gray-900">
//                   {country?.data?.find(
//                     (e: any) => e?.Code === data.CitizenshipCountryCode
//                   )?.Name ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Passport No. </div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.PassportNumber ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">
//                   Passport Expiration Date
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {dateFormat(data.PassportExpirationDate) ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">
//                   Passport Issued Date
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {dateFormat(data.PassportIssueDate) ?? "N/A"}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">
//                   {" "}
//                   Passport Issuer
//                 </div>
//                 <div className="col-span-1 text-gray-900">
//                   {data.PassportIssuer ?? "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function Finance(props: any) {
//   const { data }: any = props;
//   return (
//     <>
//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           Personal
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Salary</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.Salary ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">SalaryUnit</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.SalaryUnit?.replace("scu_", "") ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1">
//                 <div className="col-span-1 text-gray-700 ">Bank</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.BankCode ?? "N/A"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 py-1">
//                 <div className="col-span-1 text-gray-700 ">Account No.</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.BankAccount ?? "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function Remark(props: any) {
//   const { data }: any = props;
//   return (
//     <>
//       <div className="overflow-auto w-full bg-white shadow-lg border p-[30px] rounded-lg mb-6">
//         <h2 className="col-span-2 border-b pb-6 mb-4 font-bold text-lg">
//           Personal
//         </h2>
//         <div className="py-4 px-10">
//           <div className="grid grid-cols-12 ">
//             <div className="col-span-5">
//               <div className="grid grid-cols-2 py-1 mb-2">
//                 <div className="col-span-1 text-gray-700 ">Remarks</div>
//                 <div className="col-span-1 text-gray-900">
//                   {data?.Remarks ?? "N/A"}
//                 </div>
//               </div>

          
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { withRouter } from "@/routes/withRouter";
import request from "@/utilies/request";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";

import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "@/components/modal/FormMessageModal";
import LoadingProgress from "@/components/LoadingProgress";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import Address from "../component/SpecDetail";
import General from "../component/General";
import Personal from "../component/Engine";
import Finance from "../component/Tyres";
import Remarks from "../component/Commercial";
import SpecDetail from "../component/SpecDetail";
import Engine from "../component/Engine";
import Tyres from "../component/Tyres";
import Commercial from "../component/Commercial";
import { log } from "util";
let dialog = React.createRef<FormMessageModal>();
export type UseFormProps = {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  control?: any;
  defaultValues?:
    | Readonly<{
        [x: string]: any;
      }>
    | undefined;
  setBranchAss?: any;
  branchAss?: any;
  header?: any;
  setHeader?: any;
};
// const { id } = useParams();
const VehicleForm = (props: any) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,

    formState: { errors, defaultValues },
  } = useForm();
  const { id }: any = props?.match?.params || 0;

  const [state, setState] = useState({
    loading: false,
    isSubmitting: false,
    tapIndex: 0,
    isError: false,
    message: "",
    showCollapse: true,
    DocNum: id,
  });
  const [header, setHeader] = useState({
    firstName: null,
    lastName: null,
    gender: null,
    department: null,
    branch: null,
  });

  const [branchAss, setBranchAss] = useState([]);
  const [vehicle, setVehicle] = React.useState<any>();
  React.useEffect(() => {
    fetchData();
    if (vehicle) {
      reset({ ...vehicle });
    }
  }, [vehicle]);

  const arr = vehicle?.TL_VH_COMMERCIALCollection;
  const [commer, setCommer] = useState<any[]>([arr]);

  const fetchData = async () => {
    if (id) {
      setState({
        ...state,
        loading: true,
      });
      await request("GET", `TL_VEHICLE(${id})`)
        .then((res: any) => {
          setVehicle(res?.data);
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


  const handlerChangeMenu = useCallback(
    (index: number) => {
      setState((prevState) => ({
        ...prevState,
        tapIndex: index,
      }));
    },
    [state]
  );

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
          Spac Detail
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 2}
          onClick={() => handlerChangeMenu(2)}
        >
          Engine / Transmission
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 3}
          onClick={() => handlerChangeMenu(3)}
        >
          Tyres
        </MenuButton>
        <MenuButton
          active={state.tapIndex === 4}
          onClick={() => handlerChangeMenu(4)}
        >
          Commercial
        </MenuButton>

        {/* ... Other menu buttons ... */}
      </>
    );
  };

  const Left = ({ header, data }: any) => {
    return (
      <div className="w-[100%] mt-2 pl-[25px] h-[150px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">First Name </span>
          </div>
          <div>
            <span className="">Last Name </span>
          </div>
          <div>
            <span className="">Gender </span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span>{data?.FirstName || header?.firstName || "_"}</span>
          </div>
          <div>
            <span>{data?.LastName || header?.lastName || "_"}</span>
          </div>
          <div>
            <span>
              {data?.Gender?.replace("gt_", "") ||
                header?.gender?.replace("gt_", "") ||
                "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const Right = ({ header, data }: any) => {
    const branchAss: any = useQuery({
      queryKey: ["branchAss"],
      queryFn: () => new BranchBPLRepository().get(),
      staleTime: Infinity,
    });
    return (
      <div className="w-[100%] h-[150px] mt-2 flex py-5 px-4">
        <div className="w-[55%] text-[15px] text-gray-500 flex items-end flex-col h-full">
          <div>
            <span className="mr-10 mb-[27px] inline-block">Department</span>
          </div>
          <div>
            <span className="mr-10">Branch</span>
          </div>
        </div>
        <div className="w-[35%] text-[15px] items-end flex flex-col h-full">
          <div>
            <span className="mb-[27px] inline-block">
              {new DepartmentRepository()?.find(data?.Department)?.Name ||
                header?.department ||
                "_"}
            </span>
          </div>
          <div>
            <span>
              {branchAss?.data?.find((e: any) => e?.BPLID === data?.BPLID)
                ?.BPLName ||
                header?.branch ||
                "_"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // console.log(state)

  return (
    <>
      {state.loading ? (
        <div className="w-full h-full flex item-center justify-center">
          <LoadingProgress />
        </div>
      ) : (
        <>
          <DocumentHeaderComponent
            data={state}
            menuTabs={<HeaderTaps />}
            HeaderCollapeMenu={
              <>
                <Left header={header} data={vehicle} />
                <Right header={header} data={vehicle} />
                {/* <TotalSummaryRightSide data={this.state} /> */}
              </>
            }
            leftSideField={undefined}
            rightSideField={undefined}
          />
          <Backdrop
            sx={{
              color: "#fff",
              backgroundColor: "rgb(251 251 251 / 60%)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={state.isSubmitting}
          >
            <CircularProgress />
          </Backdrop>
          <FormMessageModal ref={dialog} />
          <form
            id="formData"
            className="h-full w-full flex flex-col gap-4 relative"
            onSubmit={handleSubmit(onSubmit)}
          >
            {state.tapIndex === 0 && (
              <h1>
                <General
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  setBranchAss={setBranchAss}
                  branchAss={branchAss}
                  header={header}
                  setHeader={setHeader}
                />
              </h1>
            )}
            {state.tapIndex === 1 && (
              <h1>
                <SpecDetail setValue={setValue} register={register} />
              </h1>
            )}
            {state.tapIndex === 2 && (
              <h1>
                <Engine
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                  header={header}
                  setHeader={setHeader}
                />
              </h1>
            )}
            {state.tapIndex === 3 && (
              <h1>
                <Tyres
                  register={register}
                  setValue={setValue}
                  control={control}
                  defaultValues={defaultValues}
                />
              </h1>
            )}
            {state.tapIndex === 4 && (
              <div className="m-5">
                <Commercial
                  commer={commer}
                  control={control}
                  setCommer={setCommer}
                  data={vehicle}
                />
              </div>
            )}
            {/* ... Other form fields ... */}
            <div className="absolute w-full bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
                <div className="flex ">
                  <LoadingButton
                    size="small"
                    sx={{ height: "25px" }}
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-3 text-[11px] py-1 text-white">
                      Cancel
                    </span>
                  </LoadingButton>
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingButton
                    type="submit"
                    sx={{ height: "25px" }}
                    className="bg-white"
                    loading={state.isSubmitting}
                    size="small"
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      {props.edit ? "Update" : "Save"}
                    </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default VehicleForm;
