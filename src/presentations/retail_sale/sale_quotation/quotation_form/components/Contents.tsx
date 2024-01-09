import * as React from "react";
import { MenuItem, Select } from "@mui/material";
import { ContactContext } from "../context/ContentFormContext";
import { ContentItemTable } from "./ContentItemTable";
import { ContentServiceTable } from "./ContentServiceTable";

type ContentsProps = {
  Edit?: any;
};

export default function Contents({ Edit }: ContentsProps) {
  const { data, formContent, setFormContent }: any =
    React.useContext(ContactContext);

  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-1">
          <div className="flex md:block px-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Item/Service Type
            </label>
            <Select
              disabled={Edit ? true : false}
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setFormContent({
                  ...formContent,
                  itemServiceType: e.target.value,
                  items: [],
                });
              }}
              value={formContent?.itemServiceType || ""}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              <MenuItem value="Item">Item</MenuItem>
              <MenuItem value="Service">Service</MenuItem>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-10 mr-3 mb-12">
          <div className="relative overflow-x-auto">
            {formContent?.itemServiceType === "Item" ? (
              <ContentItemTable
                data={data}
                contentType={formContent?.itemServiceType}
                Edit={Edit}
              />
            ) : (
              <ContentServiceTable />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
