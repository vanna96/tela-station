import { MenuItem, Select } from "@mui/material";
import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import { ItemTable } from "./ItemTable";
import { ServiceTable } from "./ServiceTable";

export default function Contents() {
  const { form, setForm, Edit }: any = useContext(FormOrderContext);
  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-1">
          <div className="flex md:block px-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Item/Service Type
            </label>
            <Select
              readOnly={Edit ? true : false}
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setForm({
                  ...form,
                  itemServiceType: e.target.value,
                  items: [],
                });
              }}
              value={form?.itemServiceType || ""}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              <MenuItem value="Item">Item</MenuItem>
              <MenuItem value="Service">Service</MenuItem>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-10 mr-3 mb-12">
          <div className="relative overflow-x-auto">
            {form?.itemServiceType === "Item" ? (
              <ItemTable Edit={Edit} />
            ) : (
              <ServiceTable />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
