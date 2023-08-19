import {
  Autocomplete,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useState } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import toast, { Toaster } from "react-hot-toast";

export const ModalPaymentMeans = ({ openModal, setOpenModal }: any) => {
  const { form, setForm, Edit, ContentService, bussinessPartner }: any =
    useContext(FormOrderContext);

  const defaultMeans = form?.paymentMeans || [
    {
      type: "Check",
      account: "",
      amount: "0",
    },
    {
      type: "Bank Transfer",
      account: "",
      amount: "0",
    },
    {
      type: "Credit Card",
      account: "",
      amount: "0",
    },
    {
      type: "Cash",
      account: "",
      amount: "0",
    },
  ];

  const [amountMeansRefs, setAmountMeansRefs] = useState(defaultMeans);

  const currency =
    Edit?.DocCurrency ||
    form?.paymenyMeansCurrency ||
    bussinessPartner?.DefaultCurrency ||
    form?.currency ||
    "AUD";

  const handleClickOk = () => {
    if (Edit) return setOpenModal(false);
    const isAUD = currency === "AUD";
    let totalAmountDue = amountMeansRefs?.reduce(
      (accumulator: any, object: any) => {
        return accumulator + parseFloat(object.amount);
      },
      0
    );

    const confirmOk = amountMeansRefs.find(
      ({ amount, type, account }: any) =>
        parseFloat(amount) > 0 && type !== "Credit Card" && account === ""
    );
    if (confirmOk) return toast.error("G/L Account is required!");

    if (!isAUD)
      totalAmountDue =
        totalAmountDue / parseFloat(form?.paymenyMeansExchangeRate || 0) || 0;

    const items = form?.items.map((item: any) => {
      const isItemAUD = item?.DocCurrency === "AUD";
      if (item?.DocBalance < 0 || totalAmountDue <= 0)
        return {
          ...item,
          TotalPayment: 0,
        };

      const payment =
        parseFloat(item?.DocBalance) -
        (parseFloat(item?.DiscountPercent) / 100) *
          parseFloat(item?.DocBalance);

      totalAmountDue = totalAmountDue - payment;
      if (totalAmountDue >= 0)
        return {
          ...item,
          TotalPayment: isItemAUD ? (payment).toFixed(2) : (payment * (item?.DocRate || 0)).toFixed(2),
        };

      return {
        ...item,
        TotalPayment: isItemAUD
          ? (payment + totalAmountDue).toFixed(2)
          : ((payment + totalAmountDue) * (item?.DocRate || 0)).toFixed(2),
      };
    });

    setForm({ ...form, paymentMeans: amountMeansRefs, items });
    setOpenModal(false);
  };

  const handleClickCancel = () => {
    setOpenModal(false);
    setAmountMeansRefs(defaultMeans);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white rounded-md mt-[10%] max-w-[50%] max-h-[70%] overflow-y-scroll m-auto p-4">
          <p className="font-semi-bold text-xl mb-4">Payment Means</p>
          <div className="grid grid-cols-1 lg:block mb-5 p-2 pb-4 border-[1px] border-gray-200">
            <div className="flex md:block items-center px-3 mt-3">
              <div className="ItemTable">
                <TableContainer component={Paper}>
                  <Table sx={{ width: "100%" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "20%" }}>
                          <b>Desc</b>
                        </TableCell>
                        <TableCell style={{ width: "65%" }}>
                          <b>G/L Account</b>
                        </TableCell>
                        <TableCell>
                          <b>Amount</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(Edit ? form?.paymentMeans : amountMeansRefs)?.map(
                        (payment: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell width={300}>{payment.type}</TableCell>
                              <TableCell width={500}>
                                <Autocomplete
                                  loading={ContentService === undefined}
                                  value={payment?.account || null}
                                  className="w-[100%] lg:w-[100%]"
                                  readOnly={Edit ? true : false}
                                  onChange={(e: any) => {
                                    const rows = amountMeansRefs.map(
                                      (j: any, i: number) => {
                                        if (i !== index) return j;
                                        return {
                                          ...j,
                                          account: e.target.innerText,
                                        };
                                      }
                                    );
                                    setAmountMeansRefs(rows);
                                  }}
                                  sx={{
                                    display: "inline-block",
                                    "& input": {
                                      bgcolor: "background.paper",
                                      borderRadius: 1,
                                      color: (theme) =>
                                        theme.palette.getContrastText(
                                          theme.palette.background.paper
                                        ),
                                    },
                                  }}
                                  options={ContentService?.map((e: any) => {
                                    return {
                                      id: e.Code,
                                      label: `${e.Code} - ${e.Name}`,
                                    };
                                  })}
                                  renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                      <input
                                        type="text"
                                        {...params.inputProps}
                                      />
                                    </div>
                                  )}
                                />
                              </TableCell>
                              <TableCell width={300}>
                                <input
                                  type="number"
                                  readOnly={Edit ? true : false}
                                  className="form-control h-[25px]"
                                  value={parseFloat(
                                    payment?.amount || 0
                                  ).toFixed(2)}
                                  onChange={(e: any) => {
                                    const rows = amountMeansRefs.map(
                                      (j: any, i: number) => {
                                        if (i !== index) return j;
                                        return {
                                          ...j,
                                          amount: e.target.value,
                                        };
                                      }
                                    );
                                    setAmountMeansRefs(rows);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="flex space-x-5 mt-4 justify-end">
                  <b>Total Paid ({currency})</b>
                  <input
                    readOnly
                    value={(
                      amountMeansRefs?.reduce(
                        (accumulator: any, object: any) =>
                          accumulator + parseFloat(object.amount),
                        0
                      ) || 0
                    ).toFixed(2)}
                    className="form-control h-[25px] mb-4"
                  />
                </div>
                <div className="space-x-2 text-right mt-4">
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOk}
                  >
                    Ok
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={handleClickCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
