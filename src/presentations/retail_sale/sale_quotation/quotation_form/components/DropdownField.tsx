import React, { useEffect } from "react";
// import { Select } from "antd";
import shortid from "shortid";

// const { Option } = Select;

export const DropdownField = ({ props }: any) => {
  const [state, setstate] = React.useState("");

  useEffect(() => {
    setstate(props?.defaultValue ?? "");
  }, []);

  return (
    <>
      <div
        className={`grid  ${
          props?.label ? "grid-cols-3 mb-3 sm:mb-2" : "grid-cols-1"
        } lg:grid-cols-1  gap-3 sm:gap-1 `}
      >
        {props?.label ? (
          <>
            <div className={`w-full  text-sm text-gray-500 font-base`}>
              <div
                className={`" text-sm ${
                  props?.labelOnTop ? "" : "text-sm text-gray-500 font-base"
                }"`}
              >
                {props.label}
              </div>
            </div>
          </>
        ) : null}
        <div className={`w-full col-span-2`}>
          <Select
            mode={props?.mode}
            size={props?.size ?? "small"}
            fieldNames={props?.fieldNames}
            showSearch
            disabled={props?.disabled ?? false}
            loading={props?.loading ?? false}
            allowClear
            style={{
              width: "100%",
              border: "none",
            }}
            onChange={(e:any) => {
              //
              setstate(e);
              if (props?.onChange) {
                props?.onChange(e);
              }
            }}
            defaultValue={props?.defaultValue ?? ""}
            placeholder={props?.placeholder}
            value={props?.value}
            optionFilterProp="children"
            options={props?.options}
            filterOption={(input: any, option: any) =>
              option.children.includes(input)
            }
            filterSort={
              props?.filterSort
                ? (optionA: any, optionB: any) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                : null
            }
          >
            {props?.options
              ? null
              : props?.items?.map((e: any) => (
                  <Option key={shortid.generate()} value={e?.value}>
                    {e?.name}
                  </Option>
                ))}
          </Select>
          <input type="hidden" name={props?.name ?? ""} value={state} />
        </div>
      </div>
    </>
  );
};
