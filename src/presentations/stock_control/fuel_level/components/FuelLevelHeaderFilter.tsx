


import MUIDatePicker from '@/components/input/MUIDatePicker'
import MUITextField from '@/components/input/MUITextField'
import { Button } from '@mui/material'
import FuelLevelBranchAutoComplete from './FuelLevelBranchAutoComplete'
import { Controller, useForm } from 'react-hook-form'
import { QueryOptionAPI } from '@/lib/filter_type'
import { conditionString } from '@/lib/utils'


export type FuelLevelHeaderFilterProps = { queryParams: QueryOptionAPI, onFilter?: (values: (string | undefined)[], query: string) => void }

export default function FuelLevelHeaderFilter(
    { queryParams, onFilter }: FuelLevelHeaderFilterProps
) {

    const {
        handleSubmit,
        setValue,
        control,
    } = useForm({
        defaultValues: {
            U_tl_doc_date_$eq: undefined,
            U_tl_bplid_$eq: undefined,
            DocNum_$eq_number: undefined
        }
    });


    function onSubmit(data: any) {
        const queryString: (string | undefined)[] = [];
        for (const [key, value] of Object.entries(data)) {
            if (!value) continue;

            queryString.push('and');
            queryString.push(conditionString(key, value as any))
        }

        // if (queryString.length === 0) return;

        queryString.splice(0, 1);
        const query = queryString.join(' ');

        if (onFilter) onFilter(queryString, query);
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-3 mb-5 mt-2 mx-1 rounded-md  ">
            <div
                className="grow"
            >
                <div className="grid grid-cols-10  space-x-4">
                    <div className="col-span-2 2xl:col-span-3">
                        <Controller
                            name="DocNum_$eq_number"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <MUITextField
                                        label="Document No."
                                        placeholder="Document No."
                                        className="bg-white"
                                        type="number"
                                        inputProps={{
                                            defaultValue: undefined,
                                            onBlur: (e) => setValue('DocNum_$eq_number', e.target.value)
                                        }}
                                    />
                                );
                            }}
                        />

                    </div>

                    <div className="col-span-2 2xl:col-span-3">
                        <Controller
                            name="U_tl_doc_date_$eq"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <MUIDatePicker
                                        label="Posting Date"
                                        key={field.value}
                                        value={field.value}
                                        onChange={(e: any) => {
                                            const val: any =
                                                e?.toLowerCase() ===
                                                    "Invalid Date".toLocaleLowerCase()
                                                    ? undefined
                                                    : e;
                                            setValue('U_tl_doc_date_$eq', val)
                                        }}
                                    />
                                );
                            }}
                        />
                    </div>

                    <div className="col-span-2 2xl:col-span-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Branch
                            </label>
                            <Controller
                                name="U_tl_bplid_$eq"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <FuelLevelBranchAutoComplete
                                            onChange={(e) => setValue('U_tl_bplid_$eq', e?.BPLID ?? null)}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="flex justify-end items-center align-center space-x-2 mt-4">
                    <div className="">
                        <Button
                            type='submit'
                            variant="contained"
                            size="small"
                        >
                            Go
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
