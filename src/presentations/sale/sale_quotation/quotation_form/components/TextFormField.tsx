import React from "react";
// import { Input, Button } from "antd";
// import { CopyOutlined } from "@ant-design/icons";

type TextFormFieldProps = {
  pClass?: any;
  label?: any;
  className?: any;
  type?: any;
  defaultValue?: any;
  prefix?: any;
  bordered?: any;
  placeholder?: any;
  name?: any;
  value?: any;
  onChange?: any;
  onBlur?: any;
  required?: any;
  readOnly?: any;
  addonAfter?: any;
  onClick?: any;
  size?: any;
  min?: any;
  max?: any;
};

export const TextFormField = ({
  pClass,
  label,
  className,
  type,
  defaultValue,
  prefix,
  bordered,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  required,
  readOnly,
  addonAfter,
  onClick,
  size,
  min,
  max,
}: TextFormFieldProps) => {
  return (
    <>
      <div
        className={`grid ${
          label ? "grid-cols-3 mb-3" : "grid-cols-1"
        } lg:grid-cols-1 gap-3  sm:gap-1  sm:mb-2 ${pClass}`}
      >
        {label ? (
          <>
            <div className="w-full text-gray-900">
              <div
                // className={`text-sm text-gray-500 font-base ${props?.className}`}
                className={`text-sm text-gray-500 font-base whitespace-nowrap ${className}`}
              >
                {label}
              </div>
            </div>
          </>
        ) : null}
        <div className={`w-full col-span-2 font-normal`}>
          {/* <Input
            type={type}
            defaultValue={defaultValue ?? ""}
            prefix={prefix}
            prefixCls=""
            bordered={bordered ? false : true}
            size={size ?? "small"}
            style={{ width: "full" }}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required ?? false}
            readOnly={readOnly ?? false}
            min={min}
            max={max}
            suffix={
              addonAfter && addonAfter === true ? (
                <Button
                  block
                  type="link"
                  size="small"
                    icon={
                      <CopyOutlined
                        style={{ marginLeft: "8px", color: "#346187" }}
                      />
                    }
                  onClick={onClick}
                />
              ) : null
            }
          /> */}
        </div>
      </div>
    </>
  );
};
