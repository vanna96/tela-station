import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import DepartmentSelect from "../../../../components/selectbox/Department";
import BranchSelect from "../../../../components/selectbox/Branch";
import Checkbox from "@mui/material/Checkbox";

export interface IHeadingFormProps {
  handlerOpenRequester: () => void;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  data: any;
}

export default function HeadingForm({
  handlerOpenRequester,
  handlerChange,
  data,
  edit
}: IHeadingFormProps) {
  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Requester Type
              </label>
              <div className="">
                <MUISelect
                  items={[
                    { name: "User", value: 12 },
                    { name: "Employee", value: 171 },
                  ]}
                  onChange={(e) => handlerChange("ReqType", e.target.value)}
                  value={data?.ReqType}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="ReqType"
                  disabled={data?.disable['ReqType']}
                />
              </div>
            </div>
            <MUITextField
              label="Requester"
              value={data?.CardCode}
              onClick={handlerOpenRequester}
              endAdornment={true}
              key={data?.CardCode}
              disabled={data?.disable['CardCode']}

            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Requester name
              </label>
              <div className="">
                <MUITextField name="CardName" value={data.CardName} key={data?.CardName}
                  disabled={data?.disable['CardCode']}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Department
              </label>
              <div className="mt-1">
                <DepartmentSelect
                  name="RequesterDepartment"
                  value={edit ? data?.RequesterDepartment : data.Department}
                  disabled={data?.disable['RequesterDepartment']}
                  onChange={edit ? (e) => handlerChange("RequesterDepartment", e.target.value) : (e) => handlerChange("Department", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Branch
              </label>
              <div className="">
                <BranchSelect
                  name="Branch"
                  value={edit ? data?.RequesterBranch : data.Branch}
                  disabled={data?.disable['RequesterBranch']}
                  onChange={edit ? (e) => handlerChange("RequesterBranch", e.target.value) : (e) => handlerChange("Branch", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <MUITextField
                label="Email"
                disabled={edit}
                value={edit ? data?.RequesterEmail : data?.Email}
                onChange={edit ? (e) => handlerChange("RequesterEmail", e.target.value) : (e) => handlerChange("Email", e.target.value)}
                name="RequesterEmail"
              />
            </div>
          </div>

          <div className="grid grid-cols- gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-1 text-sm">
                <Checkbox />
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Send E-Mail if PO or GPRO is Added
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              No
            </label>
            <div className="grid grid-cols-2 gap-3">
              <MUISelect
                items={data.SerieLists ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                loading={data?.isLoadingSerie}
                value={data?.Series}
                disabled={edit}
                onChange={(e: any) => handlerChange("Series", e.target.value)}
              />
              <div className="-mt-1">
                <MUITextField
                  size="small"
                  name="DocNum"
                  value={data?.DocNum}
                  disabled={edit}
                  placeholder="Document No"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <MUITextField label="Status" value={`${data?.DocumentStatus ?? 'Open'}${data?.Printed ? '; Printed' : ''}`} disabled={true} name="DocumentStatus" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Posting Date
              </label>
              <div className="">
                <MUIDatePicker
                  value={data.DocDate}
                  disabled={data?.disable['DocDate']}
                  onChange={(e: any) => handlerChange("DocDate", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Valid Until
              </label>
              <div className="">
                <MUIDatePicker
                  value={data.DocDueDate}
                  addOnDay={31}
                  disabled={data?.disable['DocDueDate']}
                  onChange={(e: any) => handlerChange("DocDueDate", e)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Document Date
              </label>
              <div className="">
                <MUIDatePicker
                  value={data.TaxDate}
                  disabled={data?.disable['TaxDate']}
                  onChange={(e: any) => handlerChange("TaxDate", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Required Date
              </label>
              <div className="">
                <MUIDatePicker
                  value={data.RequriedDate ?? null}
                  disabled={data?.disable['RequriedDate']}
                  onChange={(e: any) => handlerChange("RequriedDate", e)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className='col-span-2'></div> */}
      </FormCard>
    </>
  );
}
