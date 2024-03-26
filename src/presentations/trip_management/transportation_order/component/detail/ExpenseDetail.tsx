import ExpenseCodeAutoComplete from "@/components/input/ExpenseCode";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import shortid from "shortid";

const USD = () => {
  return (
    <div className="text-[14.5px] mt-1 text-gray-500 w-[47px] pr-1 text-center">
      USD
    </div>
  );
};

export default function ExpenseDetail(props: any) {
  const expense: any[] = useMemo(() => {
    if (!props?.watch('TL_TO_EXPENSECollection')) return [];

    return props?.watch('TL_TO_EXPENSECollection');
  }, [props?.watch('TL_TO_EXPENSECollection')])

  const removeExpense = (index: number) => {
    console.log(index)
  }

  const onChangeExpense = (event: any, index: number) => {
    const state = [...expense];
    state[index]['U_Code'] = event?.Code;
    state[index]['U_Description'] = event?.Name;
    props?.setValue('TL_TO_EXPENSECollection', state)
  }

  const [selected, setSelected] = useState<number[]>([]);

  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let state = [...selected];
    if (selected.includes(index)) {
      state = state.filter((e) => e !== index);
    } else {
      state.push(index);
    }
    setSelected(state);
  };

  const handlerDelete = () => {
    if (selected.length === 0) return; // [1,2,3,5]
    let state = [...expense];
    state = state.filter((item, index) => !selected.includes(index));
    props?.setValue("TL_TO_EXPENSECollection", state);
    setSelected([]);
  };


  const onAddNewRow = () => {
    const state = [...expense, { U_Code: undefined, U_Description: undefined, U_Amount: undefined }];
    props?.setValue('TL_TO_EXPENSECollection', state)
  }

  const excludes = useMemo(() => {
    return expense?.map((e) => e?.U_Code) ?? []
  }, [expense]);


  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-3 pb-1 justify-between">
          <h2 className="mr-3 text-base">Expense</h2>
        </div>
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[50px] "></th>
              <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Expense Code

              </th>
              <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Amount

              </th>
              <th className=" text-left font-normal  py-2 text-[14px] text-gray-500">
                Desciption
              </th>
            </tr>
            <tbody>
              {expense.length === 0 ?
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 text-[14px] p-6">No records.</td>
                </tr>
                : expense?.map((e: any, index: number) => {
                  return (
                    <tr key={shortid.generate()}>
                      <td className={` py-4 flex justify-center gap-8 items-center`}> <span className="text-black">{index + 1}</span> </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_EXPENSECollection.${index}.U_Code`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <ExpenseCodeAutoComplete
                                excludes={excludes}
                                disabled={true}
                                onChange={(event) => onChangeExpense(event, index)}
                                // onChange={(e) => props?.setValue(`TL_TO_EXPENSECollection.${index}.U_Code`, e)}
                                value={field?.value}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_EXPENSECollection.${index}.U_Amount`}
                          control={props?.control}
                          render={({ field }) => <MUITextField
                            startAdornment={USD()}
                            disabled={true}
                            defaultValue={field.value}
                            onBlur={(event) => props?.setValue(`TL_TO_EXPENSECollection.${index}.U_Amount`, event.target.value)}
                            placeholder="Amount"
                            type="number"
                            inputProps={{
                              defaultValue: e?.U_Amount,
                              step: '0.1'
                            }}
                          />}
                        />
                      </td>
                      <td colSpan={2} className="pr-4">
                        <Controller
                          name={`TL_TO_EXPENSECollection.${index}.U_Description`}
                          control={props?.control}
                          render={({ field }) => <MUITextField
                            disabled={true}
                            placeholder="Description"
                            defaultValue={field.value}
                            onBlur={(event) => props?.setValue(`TL_TO_EXPENSECollection.${index}.U_Description`, event.target.value)}
                          />}
                        />

                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="font-medium text-lg mt-[50px] flex gap-x-3 items-center mb-3 pb-1">
          <h2 className="mr-3 text-[15px]">Fuel Expense</h2>
        </div>
        <table className="border w-full shadow-sm bg-white border-[#dadde0]">
          <tr className="border-[1px] border-[#dadde0]">
            <th className="w-[50px] "></th>
            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Fuel

            </th>
            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Amount

            </th>
            <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
              Description
            </th>
          </tr>
          <tbody>
            <tr >
              <td className="py-5 flex justify-center gap-5 items-center">
                <span className="text-gray-500">1</span>
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={true}
                  placeholder="Fuel"

                  inputProps={{ ...props?.register("U_Fuel") }}
                />
              </td>

              <td className="pr-4">
                <MUITextField
                  placeholder="Amount"
                  type="number"
                  disabled={true}
                  inputProps={{
                    ...props?.register("U_FuelAmount"),
                    step: '0.1',
                  }}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={true}
                  placeholder="Description"
                  inputProps={{ ...props?.register("U_FuelRemark") }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div >
    </>
  );
}
