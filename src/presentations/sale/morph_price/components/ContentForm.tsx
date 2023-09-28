import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import { currencyFormat } from "@/utilies";
import ItemGroupRepository from "../../../../services/actions/itemGroupRepository";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { TbEdit } from "react-icons/tb";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { Alert, Collapse, IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import UnitOfMeasurementGroupRepository from '../../../../services/actions/unitOfMeasurementGroupRepository';
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import WareBinLocationRepository from "@/services/whBinLocationRepository";
import wareBinRepository from "@/services/actions/WareBinRepository";
import WarehouseRepository from "@/services/warehouseRepository";


interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
}

export default function ContentForm({
  data,
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
}: ContentFormProps) {
  
  const updateRef = React.createRef<ItemModal>();
  const itemGroupRepo = new ItemGroupRepository();
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerChangeInput = (event: any, row: any, field: any) => {
    if (data?.isApproved) return;

    let value = event?.target?.value ?? event;
    handlerChangeItem({ value: value, record: row, field });
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        Header: (header: any) => (
          <label>
            Item No <span className="text-red-500">*</span>
          </label>
        ),
        header: "Item No", //uses the default width from defaultColumn prop
        visible: true,
        size: 120,
        Cell: ({ cell }: any) => (
          /* if (!cell.row.original?.ItemCode)*/ /*     return <div role="button" className="px-4 py-2 text-inherit rounded hover:bg-gray-200 border shadow-inner" onClick={handlerAddItem}>Add Row</div>*/ <MUITextField
            value={cell.getValue()}
            disabled={data?.isStatusClose || false}
            onBlur={(event) =>
              handlerChangeInput(event, cell?.row?.original, "ItemCode")
            }
            endAdornment={!(data?.isStatusClose || false)}
            onClick={() => {
              if (cell.getValue() === "") {
                handlerAddItem();
              } else {
                updateRef.current?.onOpen(cell.row.original);
              }
            }}
            endIcon={
              cell.getValue() === "" ? null : <TbEdit className="text-lg" />
            }
            readOnly={true}
          />
        ),
      },
      {
        accessorKey: "ItemName",
        header: "Description",
        visible: true,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return cell.getValue();
        },
        size: 120,
      },
      {
        accessorKey: "ItemGroup",
        header: "Item Group",
        size: 80,
        visible: false,
        Cell: ({ cell }: any) => (
          <MUITextField
            readOnly={true}
            disabled={data.disable["DocumentLine"]}
            value={itemGroupRepo.find(cell.getValue())?.GroupName}
          />
        ),
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        Header: (header: any) => (
          <label>
            Quantity <span className="text-red-500">*</span>
          </label>
        ),

        visible: true,
        size: 80,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return cell.getValue();
        },
      },
      {
        accessorKey: "GrossPrice",
        header: "Gross Price",
        visible: true,
        size: 80,
        Header: (header: any) => (
          <label>
            Gross Price <span className="text-red-500">*</span>
          </label>
        ),

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        visible: true,
        size: 80,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return cell.getValue();
        },
      },
    
      {
        accessorKey: "TotalGross",
        header: "Total",
        size: 80,
        visible: true,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "UomAbsEntry",
        header: "Uom Code",
        visible: true,
        size: 80,
        Cell: ({ cell }: any) => {
          return (new UnitOfMeasurementRepository().find(cell.getValue())?.Name);
          // return new WarehouseRepository()?.find(cell.getValue())?.name;

        },
      },
      {
        accessorKey: "UomGroup",
        header: "Uom Group",
        visible: false,
        size: 80,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "WarehouseCode",
        header: "Warehouse",
        visible: true,
        size: 80,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          // return new WarehouseRepository()?.find(cell.getValue())?.WarehouseName;
          return cell.getValue();
        },
      },
      {
        accessorKey: "BinAbsEntry",
        header: "Bin Location",
        visible: true,
        size: 80,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return new WareBinLocationRepository().find(cell.getValue())?.BinCode ?? "N/A"


        },
      },

      {
        accessorKey: "UnitOfMeasure",
        header: "Item Per Group",

        visible: false,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "Dimesion1",
        header: "Dimesion 1",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "Dimesion2",
        header: "Dimesion 2",

        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "Dimesion3",
        header: "Dimesion 3",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "Dimesion4",
        header: "Dimesion 4",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
      {
        accessorKey: "Dimesion5",
        header: "Dimesion 5",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null;
          return currencyFormat(cell.getValue());
        },
      },
    ],
    [updateRef]
  );

  const onUpdateByItem = (item: any) => onChangeItemByCode(item);
  const onClose = React.useCallback(() => setCollapseError(false), []);

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className="mb-3"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <MdOutlineClose fontSize="inherit" />
            </IconButton>
          }
        >
          {data?.error["Items"]}
        </Alert>
      </Collapse>
      <ContentComponent
        columns={
          data?.DocType === "dDocument_Items" ? itemColumns : itemColumns
        }
        items={data?.Items ?? []}
        data={data}
        LineOfBusiness={data?.LineofBusiness}
        onChange={onChange}
        labelType={"Item / Service Type"}
        type={data?.DocType ?? "dDocument_Items"}
        typeLists={[
          { name: "Item", value: "dDocument_Items" },
          { name: "Service", value: "dDocument_Items" },
        ]}
        onRemoveChange={handlerRemoveItem}
      />
      <ItemModal
        ref={updateRef}
        onSave={onUpdateByItem}
        columns={itemColumns}
      />
    </>
  );
}
