import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { ServiceModal } from "./ServiceModal";
import { Alert, Collapse, IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import FormattedInputs from "@/components/input/NumberFormatField";
interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading: any;
}

export default function ContentForm({
  data,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const updateRef = React.createRef<ItemModal>();
  const serviceModalRef = React.createRef<ServiceModal>();
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (row: any, e: any) => {
    const index = row?.index || 0;
    const items: any = data?.Items?.map((item: any, indexItem: number) => {
      if (index === indexItem)
        return {
          ...item,
          ...e,
        };
      return item;
    });
    onChange("Items", items);
  };

  const [total, TotalFc]: any = useDocumentTotalHook(data);

  const handlerAddSequence = () => {
    if (data.Items.length <= 0 || total <= 0) return;
    let paymentMean = total;

    paymentMean = paymentMean / parseFloat(data?.ExchangeRate || 0) || 0;
    const newData = data.Items?.map((item: any) => {
      if (paymentMean < 0)
        return {
          ...item,
          TotalPayment: 0,
        };

      const payment =
        parseFloat(item?.DocBalance) -
        (parseFloat(item?.Discount || 0) / 100) * parseFloat(item?.DocBalance);
      paymentMean = paymentMean - payment;
      if (paymentMean >= 0)
        return {
          ...item,
          TotalPayment: (payment * (item?.DocRate || 0)).toFixed(2),
        };

      return {
        ...item,
        TotalPayment: ((payment + paymentMean) * (item?.DocRate || 0)).toFixed(
          2
        ),
      };
    });
    onChange("Items", newData);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "DocumentNo",
        header: "Document No.",
        visible: true,
      },
      {
        accessorKey: "TransTypeName",
        header: "Document Type",
        visible: true,
      },
      {
        accessorKey: "DueDate",
        header: "Date",
        visible: false,
      },
      {
        accessorKey: "DocTotal",
        header: "Total",
        visible: true,
        Cell: ({ cell }: any) => {
          const row = cell?.row?.original;
          return `${row?.FCCurrency} ${numberWithCommas(
            (row?.DocTotalFC || row?.DocTotal).toFixed(2)
          )}`;
        },
      },
      {
        accessorKey: "DocBalance",
        header: "Balance Due",
        visible: true,
        Cell: ({ cell }: any) => {
          const row = cell?.row?.original;
          return `${row?.FCCurrency} ${numberWithCommas(
            (row?.DocBalanceFC || row?.DocBalance || 0).toFixed(2)
          )}`;
        },
      },
      {
        accessorKey: "Discount",
        header: "Cash Discount",
        visible: true,
        Cell: ({ cell }: any) => (
          <MUITextField
            type="number"
            onInput={(e: any) => {
              const inputValue = e.target.value;
              if (inputValue > 100) {
                e.target.value = "100"; // Set the value to 100 if it's greater than 100
              }
            }}
            key={"discount_" + cell.getValue() + cell?.row?.id}
            defaultValue={cell?.row?.original.Discount}
            onBlur={(e: any) =>
              handlerUpdateRow(cell?.row, {
                Discount: e.target.value,
              })
            }
            disabled={data?.edit}
          />
        ),
      },
      {
        accessorKey: "OverDueDays",
        header: "OverDue Days",
        visible: true,
      },
      {
        accessorKey: "TotalPayment",
        header: "Total Payment",
        visible: true,
        Cell: ({ cell }: any) => (
          <FormattedInputs
            name="totalPayment_"
            disabled={data?.edit}
            defaultValue={cell?.row?.original.TotalPayment}
            key={"totalPayment_" + cell.getValue() + cell?.row?.id}
            onBlur={(e: any) =>
              handlerUpdateRow(cell?.row, {
                TotalPayment: e.target.value,
              })
            }
          />
        ),
      },
    ],
    [updateRef, data?.Items]
  );

  const onUpdateByItem = (item: any) => onChangeItemByCode(item);
  const onClose = React.useCallback(() => setCollapseError(false), []);
  const isNotAccount = data?.DocType !== "rAccount";

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
        key={key}
        columns={itemColumns}
        items={[...data?.Items]}
        isNotAccount={isNotAccount}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {
          handlerAddSequence();
          setKey(shortid.generate());
        }}
      />
      <ServiceModal ref={serviceModalRef} onSave={onUpdateByItem} />
    </>
  );
}
