import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import WareBinLocationRepository from "@/services/whBinLocationRepository";
import { FormControl, MenuItem, Select } from "@mui/material";
import shortid from "shortid";

interface WarehouseProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
  label?: string;
  error?: boolean;
  Whse?: string;
  itemCode?: string;
  items?: any[];
  // bPAddresses: any[],
  loading?: boolean;
  className?: string;
  aliasvalue?: string | undefined;
  aliaslabel?: string | undefined;
  filteredData?: any;
}

function WareBinLocation(props: WarehouseProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["ware-BinLocation"],
    queryFn: () => new WareBinLocationRepository().get(),
    staleTime: Infinity,
  });

  const filteredData = data?.filter(
    (e: any) => e?.ItemCode === props.itemCode && e?.WhsCode === props.Whse
  );
  if (props.filteredData) {
    filteredData(filteredData);
  }

  // console.log(filteredData);
  const disabled = filteredData <= 0;
  return (
    // <MUISelect
    //   {...props}
    //   aliaslabel="BinCode"
    //   aliasvalue="BinAbsEntry"
    //   loading={isLoading}
    //   items={filteredData}
    //   // value= {filteredData}
    //   disabled={filteredData <= 0}
    //   label={props?.label ?? "Bin Location"}
    //   value={props?.value ?? filteredData[0]?.BinAbsEntry}
    // />
    <FormControl error={props.error} fullWidth>
      <div className="w-full mui-select bg-inherit flex flex-col gap-2">
        {props?.label && (
          <label
            htmlFor={props.label}
            className={`text-inherit text-[14px] xl:text-[13px] ${
              props.error ? "text-red-700" : "text-[#656565]"
            } `}
          >
            {props.label}
          </label>
        )}
        {/* <Select
          value={props.value === -1 ? "-1" : props.value ?? ""}
          // defaultValue={props.defaultValue ?? ""}
          defaultValue={filteredData ? filteredData[0]?.BinAbsEntry : null}
          // value={props.value ? filteredData[0]?.BinAbsEntry : null}
          className={`w-full ${props.className} ${
            props.disabled ? "bg-gray-100" : ""
          } `}
          name={props.name}
          onChange={props.onChange}
          disabled={filteredData<=0}
        >
          {filteredData?.length > 0 ? (
            filteredData?.map((entry: any) => {
              return (
                <MenuItem key={shortid.generate()} value={entry.BinAbsEntry}>
                  {entry?.BinCode}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem value="">No Item</MenuItem>
          )}
        </Select> */}
        <Select
          value={props.value}
          className={`w-full ${disabled ? "bg-gray-100" : ""}`}
          name={props.name}
          onChange={props.onChange}
          disabled={disabled}
        >
          {filteredData?.length > 0 ? (
            filteredData?.map((entry: any) => {
              return (
                <MenuItem key={shortid.generate()} value={entry.BinAbsEntry}>
                  {entry?.BinCode}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem value="">No Item</MenuItem>
          )}
        </Select>
      </div>
    </FormControl>
  );
}

export default WareBinLocation;
