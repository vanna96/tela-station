import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LabelText } from "./Label";

type AccountingTabProps = {
  data?: any;
};

export const AccountingTab = ({ data }: AccountingTabProps) => {
  return (
    <div>
      <div>
        {/* <TitleField label="Account Preference" /> */}

        <LabelText
          readOnly
          label="Journal Remark:"
          name="JournalRemark"
          text={data?.JournalMemo}
        />

        <LabelText name="PaymentTerms" label="Payment Terms:" />
        <LabelText
          name="PaymentMethod"
          text={data?.PaymentMethod}
          label="Payment Method:"
        />
        <LabelText
          name="CentralBankInd"
          text={data?.CentralBankIndicator}
          label="Central Bank Ind:"
        />
        {/* <div className="text-gray-500">Manually Rcalculate Due Date:</div>
          <div className="flex w-full mt-3">
            <div className="w-[45%]">
              <LabelText />
            </div>
            <div className="w-[10%] ml-5">
              <LabelText defaulttext="0" />
            </div>
            <div className="text-gray-500 ml-5">Month +</div>
            <div className="w-[10%] ml-5">
              <LabelText defaulttext="0" />
            </div>
            <div className="ml-5 mb-4">Days</div>
          </div> */}
        <LabelText
          name="CashDiscountDateOffset"
          text={data?.CashDiscountDateOffset}
          label="Cash Discount Date Offset:"
        />
      </div>
      <div>
        <LabelText
          name="CashDiscountDateOffset"
          text={data?.CashDiscountDateOffset}
          label="Bussiness Partner Projec:"
        />
        <div className="ml-2">
          <FormControlLabel
            label="Use Shipped Good Account"
            checked={true}
            control={
              <Checkbox
                disabled
                value={data?.UseShpdGoodsAct}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
              />
            }
          />
        </div>
        <LabelText label="Create QR Code From:" text={data?.CreateQRCodeFrom} />
        <LabelText
          name="CancellationDate"
          text={data?.CancelDate}
          label="Cancellation Date:"
        />
        <LabelText
          name="RequiredDate"
          text={data?.RequriedDate}
          label="Required Date:"
        />
        <LabelText name="Indicator" text={data?.Indicator} label="Indicator:" />
        <LabelText
          name="FederalTaxID"
          text={data?.FederalTaxID}
          label="RFederal Tax ID:"
        />
        <LabelText
          name="OrderNumber"
          text={data?.ImportFileNum}
          label="Order Number:"
        />
      </div>
    </div>
  );
};
