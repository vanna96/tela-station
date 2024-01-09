import { createContext, useContext, useEffect, useState } from "react";
import { GeneralContact } from "./GeneralFormContext";
type GeneralProps = { children: any; Edit?: any };

export const LogisticContext = createContext({});
export const LogisticProvider = ({ children, Edit }: GeneralProps) => {
  const { bussinessPartner }: any = useContext(GeneralContact);
  const [formLogistic, setFormLogistic]: any = useState();

  useEffect(() => {
    setFormLogistic({
      ...setFormLogistic,
      shipTo: Edit?.ShipToCode || bussinessPartner?.ShipToDefault,
      shipToValue: Edit?.Address2 || bussinessPartner?.MailAddress,
      payTo: Edit?.PayToCode || bussinessPartner?.BilltoDefault,
      payToValue: Edit?.Address || bussinessPartner?.Address,
      pickAndPackRemark: Edit?.PickRemark,
    });
  }, [bussinessPartner]);

  return (
    <LogisticContext.Provider value={{ formLogistic, setFormLogistic }}>
      {children}
    </LogisticContext.Provider>
  );
};
