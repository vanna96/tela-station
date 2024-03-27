import DocumentNumberAutoComplete from "@/presentations/trip_management/component/DocumentNumberAutoComplete";
import MUITextField from "@/components/input/MUITextField";
import { useMemo } from "react";
import { Controller } from "react-hook-form";


export default function CompartmentDetail(props: any) {

  const compartment = useMemo(() => {
    if (!props?.watch('TL_TO_COMPARTMENTCollection')) return [];

    return props?.watch('TL_TO_COMPARTMENTCollection');
  }, [props?.watch('TL_TO_COMPARTMENTCollection')])


  const sources = useMemo(() => {
    return props?.documents?.filter((e: any) => e?.U_DocType !== 'S') ?? [];
  }, [props?.documents])


  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3 text-[15px]">Compartments</h2>
        </div>
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            {/* Table header */}
            <thead>
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[50px] "></th>
                <th className="w-[20rem] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Document Number
                </th>
                <th className=" text-left font-normal  py-2 text-[14px] text-gray-500">
                  Product
                </th>
                <th className="w-[150px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Volume Litre
                </th>
                <th className="w-[150px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Comp. Number
                </th>
                <th className="w-[100px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Bottom Hatch
                </th>
                <th className="w-[100px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Top Hatch
                </th>
              </tr>
            </thead>
            <tbody>
              {compartment?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-[16px] text-gray-400"
                  >
                    No Record
                  </td>
                </tr>
              ) : (
                compartment.map((e: any, index: number) => (
                  <>
                    <tr key={e?.id}>
                      <td className="py-5 flex justify-center gap-5 items-center">
                        <span className="text-gray-500">{index + 1}</span>
                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_DocNum`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <DocumentNumberAutoComplete
                                disabled={true}
                                document={sources}
                                {...field}
                                onChange={(e) => {
                                  // props?.setValue(`TL_TO_COMPARTMENTCollection.${index}.U_DocNum`, e?.U_DocNum);

                                }}
                                value={field.value}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_ItemCode`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <MUITextField
                                disabled={true}
                                placeholder="Item Code"
                                value={field.value}
                              />
                            );
                          }}
                        />

                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_Volume`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <MUITextField
                                disabled={true}
                                placeholder="Volume Litre"
                                startAdornment={'L'}
                                value={field.value}
                              />
                            );
                          }}
                        />

                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_Compartment`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <MUITextField
                                disabled={true}
                                placeholder="Compartment Number"
                                value={field.value}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_BottomHatch`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <MUITextField
                                disabled={true}
                                placeholder="Bottom Hatch"
                                value={field.value}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <Controller
                          name={`TL_TO_COMPARTMENTCollection.${index}.U_TopHatch`}
                          control={props?.control}
                          render={({ field }) => {
                            return (
                              <MUITextField
                                disabled={true}
                                placeholder="Top Hatch"
                                value={field.value}
                              />
                            );
                          }}
                        />
                      </td>
                    </tr>
                    {e?.U_Children?.map((e: any, indexC: number) => {
                      return (
                        <>
                          <tr className="bg-zinc-50 border-t border-[#dadde0]">
                            <th></th>
                            <th className="w-[200px] text-left font-normal  py-2 pt-3 text-[14px] text-gray-500">
                              Seal Number
                            </th>
                            <th
                              colSpan={5}
                              className="w-[200px] text-left font-normal  py-2 pt-3 text-[14px] text-gray-500"
                            >
                              Seal Reference
                            </th>
                          </tr>
                          <tr className="bg-zinc-50">
                            <td></td>
                            <td className="pr-4">
                              <Controller
                                name={`TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealNumber`}
                                control={props?.control}
                                render={({ field }) => {
                                  return (
                                    <MUITextField
                                      disabled={true}
                                      placeholder="Seal Number"
                                      onBlur={(event) => props?.setValue(`TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealNumber`, event.target.value)}
                                      inputProps={{
                                        defaultValue: field.value,
                                      }}
                                    />
                                  );
                                }}
                              />
                            </td>
                            <td colSpan={5}>
                              <Controller
                                name={`TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealReference`}
                                control={props?.control}
                                render={({ field }) => {
                                  return (
                                    <MUITextField
                                      disabled={true}
                                      placeholder="Seal Reference"
                                      onBlur={(event) => props?.setValue(`TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealReference`, event.target.value)}
                                      inputProps={{
                                        defaultValue: field.value,
                                      }}
                                    />
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </>
                ))
              )}
            </tbody>
          </table>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
