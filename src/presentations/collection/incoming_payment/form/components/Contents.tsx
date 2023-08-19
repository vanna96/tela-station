import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import { ItemTable } from "./ItemTable";
import { ServiceTable } from "./ServiceTable";

export default function Contents() {
  const { form }: any = useContext(FormOrderContext);
  return (
    <>
      <div className="grid grid-cols-1 mt-2 mr-3">
        <div className="relative overflow-x-auto">
          {(form?.useType || "Customer") !== "Account" ? (
            <ItemTable />
          ) : (
            <ServiceTable />
          )}
        </div>
      </div>
    </>
  );
}
