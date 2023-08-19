import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import { numberWithCommas } from "@/helper/helper";
import Paper from "@mui/material/Paper";
import {
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
export const ItemTable = () => {
  const { form, setForm, loading, bussinessPartner, Edit, isFetching }: any =
    useContext(FormOrderContext);

  let amountDue = form?.paymentMeans?.reduce(
    (accumulator: any, object: any) => {
      return accumulator + parseFloat(object.amount);
    },
    0
  );

  const currency =
    form?.paymenyMeansCurrency ||
    bussinessPartner?.DefaultCurrency ||
    form?.currency;
  const isAUD = currency === "AUD";
  if (!isAUD)
    amountDue = amountDue / parseFloat(form?.paymenyMeansExchangeRate || 0);

  return (
    <div className="ItemTable">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell width={150}>Selected</TableCell> */}
              <TableCell>Document No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Overdue Days</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Balance Due</TableCell>
              <TableCell>Blocked</TableCell>
              <TableCell>Cash Discount %</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Total Rounding Amount</TableCell>
              <TableCell>Total Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading || isFetching ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="text-center">
                    <CircularProgress size={20} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              form?.items?.map((row: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{row.DocNum}</TableCell>
                    <TableCell>{row.DocDate?.split("T")[0]}</TableCell>
                    <TableCell>{row?.OverDueDays || 0}</TableCell>
                    <TableCell>
                      {row?.DocCurrency}{" "}
                      {numberWithCommas((row?.DocTotal || 0))}
                    </TableCell>
                    <TableCell>
                      {row?.DocCurrency} {numberWithCommas(row?.BalanceDue || 0)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        type="number"
                        className="form-control h-[25px]"
                        value={parseFloat(row?.DiscountPercent || 0)}
                        readOnly={Edit ? true : false}
                        onChange={(e: any) => {
                          const items = form?.items
                            ?.map((i: any) => {
                              if (i.DocEntry !== row.DocEntry) return i;
                              const DiscountPercent =
                                e.target.value > 100
                                  ? 100
                                  : e.target.value || 0;
                              return {
                                ...i,
                                DiscountPercent,
                              };
                            })
                            ?.map((item: any) => {
                              // !item.checked ||
                              if (amountDue <= 0)
                                return {
                                  ...item,
                                  TotalPayment: 0,
                                };
                              const isItemAUD = item?.DocCurrency === "AUD";
                              const payment =
                                parseFloat(item?.BalanceDue) -
                                (parseFloat(item?.DiscountPercent) / 100) *
                                  parseFloat(item?.BalanceDue);
                              amountDue = amountDue - payment;
                              if (amountDue >= 0)
                                return {
                                  ...item,
                                  TotalPayment: isItemAUD
                                    ? payment
                                    : payment * (item?.DocRate || 0),
                                };
                              return {
                                ...item,
                                TotalPayment: isItemAUD
                                  ? payment + amountDue
                                  : (payment + amountDue) *
                                    (item?.DocRate || 0),
                              };
                            });

                          setForm({
                            ...form,
                            items,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>{row?.documentType}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        type="number"
                        className="form-control h-[25px]"
                        readOnly={Edit ? true : false}
                        value={parseFloat(row?.TotalPayment)}
                        onChange={(e: any) => {
                          const rows = form?.items?.map((i: any) => {
                            if (i.DocEntry !== row.DocEntry) return i;
                            return {
                              ...i,
                              TotalPayment: e.target.value,
                            };
                          });
                          setForm({
                            ...form,
                            items: rows,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
