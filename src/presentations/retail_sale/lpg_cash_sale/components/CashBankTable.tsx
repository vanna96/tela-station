import React from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import MUITextField from "@/components/input/MUITextField";
import FormattedInputs from "@/components/input/NumberFormatField";
import MUISelect from "@/components/selectbox/MUISelect";
import ClearIcon from "@mui/icons-material/Clear";
import CurrencySelect from "@/components/selectbox/Currency";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("cashBankData", [
      ...(data?.cashBankData || []),
      {
        type: "cash" || "bank",
        currency: "USD",
        amount: 0,
      },
    ]);
  };

  console.log(data);

  const handlerRemoveCheck = (key: number) => {
    const newData = (data?.cashBankData || []).filter(
      (item: any, index: number) => index !== key
    );
    console.log(newData.length);
    if (newData.length < 1) return;
    onChange("cashBankData", newData);
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.cashBankData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("cashBankData", newData);
  };

  const columns = [
    {
      size: 25,
      minSize: 25,
      maxSize: 25,
      accessorKey: "deleteButton", // New accessor key for the delete button column
      header: "", // Empty header for the delete button column
      Cell: ({ cell }: any) => (
        <ClearIcon
          className="text-red-500 cursor-pointer"
          onClick={() => handlerRemoveCheck(cell?.row?.index)}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      Cell: ({ cell }: any) => (
        <>
          <MUISelect
            key={"type" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.type || ""}
            disabled={data?.edit}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                type: e.target.value,
              });
            }}
            items={[
              { value: "cash", label: "Cash" },
              { value: "bank", label: "Bank" },
            ]}
          />
        </>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      Cell: ({ cell }: any) => (
        <CurrencySelect
          key={"currency" + cell.getValue() + cell?.row?.id}
          value={cell.row.original?.currency || 0}
          onChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              currency: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"amount" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.amount || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              amount: e.target.value,
            });
          }}
          name={"amount"}
          value={cell.row.original?.amount || ""}
          startAdornment={cell.row.original?.currency}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex space-x-4 text-[25px] justify-end mb-2">
        {!data?.edit && (
          <>
            <AiOutlinePlus
              className="text-blue-700 cursor-pointer"
              onClick={handlerAddCheck}
            />
          </>
        )}
      </div>
      <MaterialReactTable
        columns={[...columns]}
        data={[...data?.cashBankData]}
        enableStickyHeader={true}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={false}
        enableSorting={false}
        enableTopToolbar={false}
        enableColumnResizing={true}
        enableColumnFilterModes={false}
        enableDensityToggle={false}
        enableFilters={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableHiding={true}
        enablePinning={true}
        enableStickyFooter={false}
        enableMultiRowSelection={true}
        initialState={{
          density: "compact",
          rowSelection,
        }}
        state={{
          rowSelection,
          isLoading: props.loading,
          showProgressBars: props.loading,
          showSkeletons: props.loading,
        }}
        muiTableBodyRowProps={() => ({
          sx: { cursor: "pointer" },
        })}
        icons={{
          ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
        }}
        enableTableFooter={true}
        // muiTableFooter= {<AddIcon />}
      />
    </>
  );
}
