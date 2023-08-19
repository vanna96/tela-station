import React from "react";
import MaterialReactTable from "material-react-table";
import { Checkbox, TextField } from "@mui/material";
import MUITextField from "../../../../components/input/MUITextField";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { currencyFormat } from "@/utilies";
import FormCard from "@/components/card/FormCard";
import MUISelect from "@/components/selectbox/MUISelect";
import Owner from "@/components/selectbox/Owner";
import AccountTextField from "../../../../components/input/AccountTextField";
import BuyerSelect from "@/components/selectbox/buyer";
import VatGroupTextField from "@/components/input/VatGroupTextField";
import UOMTextField from "@/components/input/UOMTextField";
import { getUOMGroupByCode } from "@/helpers";
import { documentType, isItemType } from "@/constants";
import { useDocumentTotalHook } from "@/hook";

export interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: string) => void;
  handlerChange: (key: string, value: any) => void;
  handlerOpenGLAccount?: () => void;
  data: any;
  edit: boolean;
}

export default function ContentForm({
  data,
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  handlerChange,
  edit,
}: ContentFormProps) {
  const [tableKey, setTableKey] = React.useState(Date.now());

  const handlerChangeInput = (event: any, row: any, field: any) => {
    handlerChangeItem({
      value: event.target.value ?? event,
      record: row,
      field,
    });
  };

  const handlerRemoveRow = (row: any) => {
    handlerRemoveItem(row.ItemCode);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 40,
        enableResizing: false,
        Cell: ({ cell }: any) => {
          return (
            <div role="button" className="flex justify-center items-center">
              <button
                type="button"
                className="border border-gray-200 p-1 rounded-sm"
                onClick={() => handlerRemoveRow(cell.row.original)}
              >
                <AiOutlineDelete />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "ItemCode",
        header: "Item No", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          // return ;
          return (
            <MUITextField
              value={cell.getValue()}
              // onChange={(event) => handlerChangeInput(event, cell?.row?.original, "ItemCode")}
              endAdornment={!data?.disable['DocumentLine'] && !edit}
              onClick={() => handlerAddItem()}

              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },

      {
        accessorKey: "ItemName",
        header: "Description",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        Cell: ({ cell }: any) => {
          console.log(cell.getValue());
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              key={cell?.row?.original?.ItemCode + "_q" + cell.getValue()}
              type="number"
              error={(cell.getValue() as number) <= 0}
              // disabled={edit}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "Quantity")
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },
      {
        accessorKey: "DiscountPercent",
        header: "Discount",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              key={cell?.row?.original?.ItemCode + "_d" + cell.getValue()}
              startAdornment={"%"}
              type="number"
              // disabled={data?.DocumentDtatus}
              onBlur={(event) =>
                handlerChangeInput(
                  event,
                  cell?.row?.original,
                  "DiscountPercent"
                )
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },
      {
        accessorKey: "UnitPrice",
        header: "Unit Price",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              key={cell?.row?.original?.ItemCode + "_u" + cell.getValue()}
              startAdornment={"$"}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "UnitPrice")
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        Cell: ({ cell }: any) => {
          return (
            <VatGroupTextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "VatGroup")
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}

              type="InputTax"
            />
          );
        },
      },
      {
        accessorKey: "LineTotal",
        header: "Total",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              // disabled={data?.isApproved}
              startAdornment={"$"}
              value={cell.getValue()}
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          );
        },
      },
      {
        accessorKey: "UomGroupCode",
        header: "UoM Group",
        Cell: ({ cell }: any) => (
          <MUITextField
            value={getUOMGroupByCode(cell.row.original.ItemCode)?.Code}
            disabled={data.DocumentStatus === "bost_Close" ? true : false}
          />
        ),
      },
      {
        accessorKey: "UomCode",
        header: "UoM Code",
        Cell: ({ cell }: any) => (
          <UOMTextField
            // key={cell.getValue()}
            value={cell.getValue()}
            onChange={(event) =>
              handlerChangeInput(event, cell?.row?.original, "UomCode")
            }
            data={getUOMGroupByCode(cell.row.original.ItemCode)?.Code}
            // disabled={false}
            disabled={data.DocumentStatus === "bost_Close" ? true : false}
          />
        ),
      },
      {
        accessorKey: "UnitsOfMeasurement",
        header: "Item Per Units",
        Cell: ({ cell }: any) => (
          <MUITextField
            type="number"
            value={cell.getValue()}
            disabled={data.DocumentStatus === "bost_Close" ? true : false}
          />
        ),
      },
    ],
    []
  );

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 40,
        enableResizing: false,
        Cell: ({ cell }: any) => {
          return (
            <div role="button" className="flex justify-center items-center">
              <button
                type="button"
                className="border border-gray-200 p-1 rounded-sm"
                onClick={() => handlerRemoveRow(cell.row.original)}
              >
                <AiOutlineDelete />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "ItemName",
        header: "Descriptions", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          // return ;
          return (
            <MUITextField
              key={cell.getValue()}
              defaultValue={cell.getValue()}
              name="ItemDescription"
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "ItemName")
              }
            />
          );
        },
      },
      {
        accessorKey: "AccountNo",
        header: "G/L Account", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return (
            <AccountTextField
              name="AccountNo"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "AccountNo")
              }
              disabled={false}
            />
          );
        },
      },
      {
        accessorKey: "AccountNameD",
        header: "G/L Account Name", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        Cell: ({ cell }: any) => {
          return (
            <VatGroupTextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell.row.original, "VatGroup")
              }
              type="InputTax"
            />
          );
        },
      },
      {
        accessorKey: "LineTotal",
        header: "Total (LC)", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "LineTotal")
              }
            />
          );
        },
      },
      {
        accessorKey: "BlanketAgreementNumber",
        header: "	Blanket Agreement No.", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event: any) =>
                handlerChangeInput(
                  event,
                  cell?.row?.original,
                  "BlanketAgreementNumber"
                )
              }
            />
          );
        },
      },
    ],
    []
  );

  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({ Total: false, ItemsGroupName: false, UoMGroupName: false });

  const [docTotal, docTaxTotal] = useDocumentTotalHook(data?.Items);

  console.log(data?.Items)

  return (
    <FormCard title="Content">
      <div className="col-span-2 data-table">
        <div className="my-4 w-[30%]">
          <label
            htmlFor="AgreementMethod"
            className="text-gray-500 text-[14px]"
          >
            Item/Service Type
          </label>
          <div className="">
            <MUISelect
              items={documentType}
              aliaslabel="label"
              aliasvalue="value"
              name="DocType"
              disabled={edit}
              value={data.DocType}
              onChange={(e) => handlerChange("DocType", e.target.value)}
            />
          </div>
        </div>

        <MaterialReactTable
          key={tableKey}
          // columns={itemColumns}
          columns={isItemType(data?.DocType) ? itemColumns : serviceColumns}
          data={[...data.Items, { ItemCode: "" }]}
          enableStickyHeader={true}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnResizing={true}
          enableColumnFilterModes={false}
          enableDensityToggle={false}
          enableFilters={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={false}
          enableHiding={true}
          onColumnVisibilityChange={setColVisibility}
          initialState={{
            density: "compact",
            columnVisibility: colVisibility,
          }}
          state={{
            columnVisibility: colVisibility,
          }}
          icons={{
            ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
          }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Buyer
            </label>
            <BuyerSelect
              value={data?.SalesPersonCode}
              onChange={(e) => handlerChange("SalesPersonCode", e.target.value)}
            />
          </div>
          <div className="w-[48%]">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Owner
            </label>
            <Owner
              onChange={(e) => handlerChange("DocumentsOwner", e.target.value)}
              value={data?.DocumentsOwner}
              name="DocumentsOwner"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Remarks
          </label>
          <div className="">
            {data.documentStatus === "bost_Open" ? (
              <TextField
                size="small"
                multiline
                rows={4}
                fullWidth
                name="Comments"
                className="w-full "
                defaultValue={data?.Comments}
              />
            ) : (
              <TextField
                size="small"
                multiline
                rows={4}
                disabled={edit}
                fullWidth
                name="Comments"
                className="w-full "
                defaultValue={data?.Comments}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-[100%] gap-3">
          <MUITextField
            label="Total Before Discount:"
            value={currencyFormat(docTotal)}
            disabled
          />
        </div>
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <MUITextField
              label="Discount:"
              startAdornment={"%"}
              value={data?.DocDiscountPercent}
              onChange={(e) =>
                handlerChange("DocDiscountPercent", e.target.value)
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}

            />
          </div>
          <div className="w-[48%] gap-3 mt-5">
            <MUITextField
              label=""
              startAdornment={data?.currency ?? "AUD"}
              value={data?.DocDiscountPrice}
              onChange={(e) =>
                handlerChange("DocDiscountPrice", e.target.value)
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}

            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <MUITextField label="Fright:" value={""} disabled />
          </div>

          <div className="w-[48%] gap-3 mt-5">
            <div className="flex items-center gap-1 text-sm">
              <Checkbox
                name="Renewal"
                checked={data.Renewal}
                onChange={(e) => handlerChange("Renewal", !data.Renewal)}
              />
              <label htmlFor="Renewal" className="text-gray-500 text-[14px]">
                Rounding
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <MUITextField label="Tax:" value={currencyFormat(docTaxTotal)} disabled />
          </div>

          <div className="w-[48%] gap-3">
            <MUITextField
              label="Total Payment Due:"
              value={currencyFormat(docTaxTotal + docTotal)}
              disabled={data.DocumentStatus === "bost_Close" ? true : false}

            />
          </div>
        </div>
      </div>
    </FormCard>
  );
}


