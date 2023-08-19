import shortid from "shortid";
import Checkbox from "@mui/material/Checkbox";
import { LabelText } from "./Label";
import FormControlLabel from "@mui/material/FormControlLabel";
import { numberWithCommas } from "@/helper/helper";

type ContentsTabProps = {
  data?: {
    DocumentLines: any;
    DiscountPercent: any;
    TotalDiscount: any;
    Freight: any;
    VatSum: number;
    DocTotalSys: any;
    SalesPerson: any;
    DocumentsOwner: any;
    Comments: any;
    DocTotal: any;
    DocEntry: any;
    Rounding: any;
  };
  SalesPerson?: any;
  EmployeesInfo?: any;
};

export const ContentsTab = ({
  data,
  SalesPerson,
  EmployeesInfo,
}: ContentsTabProps) => {
  const TotalBeforeDiscount = (data?.VatSum || 0) * 10;
  const Owner = EmployeesInfo?.data?.value?.find(
    (e: any) => e.EmployeeID === data?.DocumentsOwner
  );

  return (
    <>
      <div>
        <table className="w-full table ">
          <thead>
            <tr>
              {[
                "No .",
                "Item No.",
                "Quantity",
                "UnitPrice",
                "Tax Code",
                "Total (LC)",
                "UoM Code",
              ].map((e) => (
                <th
                  key={e}
                  className="bg-gray-100 p-2 font-semibold text-sm text-left"
                >
                  {e}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.DocumentLines?.map((e: any, index: number) => {
              const total = e?.UnitPrice * (e?.Quantity || 1);
              return (
                <tr key={shortid.generate()} className="text-sm border">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{e?.ItemCode}</td>
                  <td className="p-2">{e?.Quantity || 1}</td>
                  <td className="p-2">{`${e.Currency} ${numberWithCommas(
                    e?.UnitPrice.toFixed(2)
                  )}`}</td>
                  <td className="p-2">{e?.VatGroup}</td>
                  <td className="p-2">{`${e.Currency} ${numberWithCommas(
                    total.toFixed(2)
                  )}`}</td>
                  <td className="p-2">{e?.UoMCode}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="my-3">
        <LabelText
          label="Sale Employee"
          text={SalesPerson?.data?.SalesEmployeeName}
        />
        <LabelText
          label="Owner"
          text={`${Owner?.LastName || ""} ${Owner?.FirstName || ""}`}
        />
        <LabelText
          label="Remarks"
          text={data?.Comments ? data?.Comments : "N/A"}
        />
        <div className="my-4"></div>
        <LabelText label="Total Before Discount" text={TotalBeforeDiscount} />
        <div className="my-4"></div>
        <LabelText label="Discount" text={data?.DiscountPercent} />
        <div className="my-4"></div>
        <LabelText label="Frieght" text={0} />
        <div className="my-4"></div>
        <div className="ml-[6px]">
          <FormControlLabel
            label="Rounding"
            control={
              <Checkbox
                disabled
                checked={data?.Rounding === "tYES"}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
              />
            }
          />
        </div>
        <div className="my-4"></div>
        <LabelText label="Tax" text={data?.VatSum} />
        <div className="my-4"></div>
        <LabelText label="Total Payment Due" text={data?.DocTotal} />
      </div>
    </>
  );
};
