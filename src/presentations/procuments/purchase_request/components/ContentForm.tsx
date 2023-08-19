import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, Checkbox, TextField } from "@mui/material";
import MUITextField from "@/components/input/MUITextField";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { currencyFormat } from "@/utilies";
import FormCard from "@/components/card/FormCard";
import Formular from "@/utilies/formular";
import MUISelect from "@/components/selectbox/MUISelect";
import Owner from "@/components/selectbox/Owner";
import AccountTextField from "@/components/input/AccountTextField";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import VatGroup from "../../../../components/selectbox/VatGroup";
import UOMTextField from "@/components/input/UOMTextField";
import { getUOMGroupByCode } from "@/helpers";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BusinessPartnerTextField from "@/components/input/BusinessPartnerTextField";
import VatGroupTextField from "@/components/input/VatGroupTextField";
import { documentType, isItemType } from "@/constants";
import { useDocumentTotalHook } from "@/hook";

export interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: string) => void;
  handlerChange: (key: string, value: any) => void;
  handlerOpenGLAccount?: () => void;
  data: any;
}

export default function ContentForm({
  data,
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  handlerChange,
  handlerOpenGLAccount,
}: ContentFormProps) {
  const [tableKey, setTableKey] = React.useState(Date.now());

  const handlerChangeInput = (event: any, row: any, field: any) => {
    handlerChangeItem({ value: event?.target?.value ?? event, record: row, field });
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
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "ItemCode")
              }
              endAdornment={!data?.disable['DocumentLine'] ?? true}
              disabled={data?.disable['DocumentLine']}
              onClick={handlerAddItem}
            />
          );
        },
      },

      {
        accessorKey: "ItemName",
        header: "Description",
        Cell: ({ cell }: any) => <MUITextField value={cell.getValue()} disabled={data?.disable['DocumentLine']} />,
      },
      {
        accessorKey: "LineVendor",
        header: "Vendor",
        Cell: ({ cell }: any) => <MUITextField value={cell.getValue()} disabled={data?.disable['DocumentLine']} />
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={'q_' + cell.getValue()}
              defaultValue={cell.getValue()}
              type="number"
              name="Quantity"
              error={(cell.getValue() as number) <= 0}
              disabled={data?.disable['DocumentLine']}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "Quantity")
              }
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
              startAdornment={"USD"}
              type="number"
              key={'price_' + cell.getValue()}
              name="UnitPrice"
              disabled={data?.disable['DocumentLine']}
              error={(cell.getValue() as number) <= 0}
              defaultValue={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "UnitPrice")
              }
            />
          );
        },
      },
      {
        accessorKey: "PriceAfterVAT",
        header: "Gross Price",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              startAdornment={"USD"}
              type="number"
              disabled={true}
              value={cell.getValue()}
            />
          );
        },
      },
      {
        accessorKey: "DiscountPercent",
        header: "Discount %",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              type="number"
              disabled={data?.disable['DocumentLine']}
              onBlur={(event) =>
                handlerChangeInput(
                  event,
                  cell?.row?.original,
                  "DiscountPercent"
                )
              }
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
              startAdornment={"USD"}
              disabled={data?.disable['DocumentLine']}
              value={currencyFormat(cell.getValue())}
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
              onChange={(e) => handlerChangeInput(e.target.value, cell.row.original, 'VatGroup')}
              type="InputTax"
              disabled={data?.disable['DocumentLine']}
            />
          );
        },
      },
      {
        accessorKey: "UomGroupCode",
        header: "UoM Group",
        Cell: ({ cell }: any) => <MUITextField disabled={data?.disable['DocumentLine']} value={getUOMGroupByCode(cell.row.original.ItemCode)?.Code} />
      },
      {
        accessorKey: "UomCode",
        header: "UoM Code",
        Cell: ({ cell }: any) => (
          <UOMTextField
            // key={cell.getValue()}
            value={cell.getValue()}
            disabled={data?.disable['DocumentLine']}
            onChange={(event) => {
              return handlerChangeInput(event.target.value, cell?.row?.original, 'UomCode');
            }}
            data={getUOMGroupByCode(cell.row.original.ItemCode)?.Code} />
        ),
      },
      {
        accessorKey: "UnitsOfMeasurement",
        header: "Item Per Units",
        Cell: ({ cell }: any) => (
          <MUITextField
            type="number"
            disabled={data?.disable['DocumentLine']}
            value={cell.getValue()}
          />
        ),
      },
    ],
    [data?.DocType]
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
        header: "Description", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          // return ;
          return (
            <MUITextField
              key={cell.getValue()}
              defaultValue={cell.getValue()}
              onBlur={(event) => handlerChangeInput(event, cell?.row?.original, "ItemName")}
            />
          );
        },
      },
      {
        accessorKey: "RequiredDate",
        header: "Required Date", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return (
            <MUIDatePicker
              value={cell.getValue() ?? null}
              onChange={(event) => handlerChangeInput(event, cell?.row?.original, "RequiredDate")}
            />
          );
        },
      },
      {
        accessorKey: "LineVendor",
        header: "Vendor", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          return (
            <BusinessPartnerTextField
              value={cell.getValue()}
              onChange={(e) => handlerChangeInput(e.target.value?.cardCode, cell.row.original, 'LineVendor')}
              type={'supplier'}
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
              value={cell.getValue()}
              name="AccountNo"
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "AccountNo")
              }
            />
          );
        },
      },
      {
        accessorKey: "AccountName",
        header: "	G/L Account Name", //uses the default width from defaultColumn prop
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
              onChange={(e) => handlerChangeInput(e.target.value, cell?.row?.original, 'VatGroup')}
              value={cell.getValue()}
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
              startAdornment={"USD"}
              defaultValue={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "LineTotal")
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
        <div className="flex flex-col pb-4 sm:pb-2 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Item/Service Type
              </label>
              <div className="w-1/2">
                <MUISelect
                  items={documentType}
                  aliaslabel="label"
                  aliasvalue="value"
                  name="DocType"
                  value={data.DocType}
                  onChange={(e) => handlerChange("DocType", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <MaterialReactTable
          key={tableKey}
          // columns={itemColumns}
          columns={!isItemType(data?.DocType) ? serviceColumns : itemColumns}
          data={[...data?.Items, {}]}
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
        <div className="">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Owner
          </label>
          <Owner
            name="DocumentsOwner"
            value={data?.Owner}
            onChange={(e: any) => handlerChange("Owner", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Remarks
          </label>
          <div className="">
            <TextField
              size="small"
              multiline
              rows={4}
              fullWidth
              name="Comments"
              value={data?.Comments}
              onChange={(e: any) => handlerChange("Comments", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-[100%] gap-3">
          <MUITextField
            label="Total Before Discount"
            disabled={true}
            value={currencyFormat(docTotal)}
          />
        </div>
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <MUITextField label="Fright" name="" endAdornment />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[48%] gap-3">
            <MUITextField
              label="Tax:"
              disabled={true}
              value={currencyFormat(docTaxTotal)}
            />
          </div>
          <div className="w-[48%] gap-3">
            <MUITextField
              label="Total Payment Due"
              disabled={true}
              value={currencyFormat(parseFloat(docTotal.toString()) + parseFloat(docTaxTotal.toString()))}
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
}
