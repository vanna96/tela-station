import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { POSTTransporationOrder, TOStatus } from "../../type";
import { useGetTOSeriesHook } from "./useGetTOSeriesHook";

const allStatus = [
    { label: "Initiated", value: "I" },
    { label: "Planned", value: "P" },
    { label: "Seal Number", value: "S" },
    { label: "Dispatched", value: "D" },
    { label: "Released", value: "R" },
    { label: "Completed", value: "CP" },
    { label: "Cancelled", value: "C" },
];

export const getTextStatus = (key: TOStatus | undefined): string | undefined => {
    switch (key) {
        case 'I': return allStatus[0]?.label;
        case 'P': return allStatus[1]?.label;
        case 'S': return allStatus[2]?.label;
        case 'D': return allStatus[3]?.label;
        case 'R': return allStatus[4]?.label;
        case 'CP': return allStatus[5]?.label;
        case 'C': return allStatus[6]?.label;
        default:
            return '';
    }
}


const defaultValues: POSTTransporationOrder = {
    U_DocDate: new Date().toISOString()?.split('T')[0],
    U_Status: 'I',
    TL_TO_COMPARTMENTCollection: [],
    TL_TO_EXPENSECollection: [],
    TL_TO_ORDERCollection: [],

}

export const useTransportationOrderFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
    const [loading, setLoading] = useState(false);

    const { id } = useParams()

    const {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues: defaultValues
    });


    const documents: any[] = useMemo(() => {
        if (!watch('TL_TO_ORDERCollection')) return []

        const data: any[] = [];
        for (let index = 0; index < (watch('TL_TO_ORDERCollection') ?? []).length; index++) {
            const value: any = watch('TL_TO_ORDERCollection')[index];
            const mapped = value?.TL_TO_DETAIL_ROWCollection?.map((e: any, rowIndex: number) => ({ ...e, ParentIndex: index, Index: rowIndex, Type: value?.U_DocType }))
            data.push(...mapped);
        }

        return data;
    }, [watch('TL_TO_ORDERCollection')])

    const onSubmit = async (payload: any) => {
        try {
            if (!payload.TL_TO_ORDERCollection || payload.TL_TO_ORDERCollection.length === 0) {
                dialog.current?.error("DocumentsLines must have at least one row.")
                return;
            }

            setLoading(true);
            const url = edit ? `/script/test/transportation_order(${id})` : 'script/test/transportation_order';
            const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
            setLoading(false)

            if (!response.data && typeof response !== 'string') {
                dialog.current?.error("Error")
                return;
            }

            dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
        } catch (error: any) {
            dialog.current?.error(error?.message ?? '')
        }
    };

    const onInvalidForm = (e: any) => {
        if (e.TL_FUEL_LEVEL_LINESCollection) {
            if (e.TL_FUEL_LEVEL_LINESCollection?.length === 0) return;
            const key = Object.keys(e.TL_FUEL_LEVEL_LINESCollection[0])[0]
            dialog.current?.error(e.TL_FUEL_LEVEL_LINESCollection[0][key].message)
        }

        // dialog.current?.error(
        //     invalids[Object.keys(invalids)[0]]?.message?.toString() ??
        //     "Oop something wrong!",
        //     "Invalid Value"
        // );
    }

    const onSelectChangeDocuments = (value: any[]) => {
        const state = [...watch('TL_TO_ORDERCollection'), ...value];
        setValue('TL_TO_ORDERCollection', state)
    }

    const series = useGetTOSeriesHook(id === undefined)

    useEffect(() => {
        if (id) {
            setLoading(true)
            request('GET', `/script/test/transportation_order(${id})`)
                .then((res: any) => {
                    setLoading(false)
                    reset({ ...res.data }, { keepValues: false })
                })
                .catch((e: any) => {
                    setLoading(false)
                    dialog.current?.error(e?.message)
                });
        } else {

        }
    }, [id, edit]);

    useEffect(() => {
        if (!id && !watch('DocNum')) {
            setValue('Series', series?.defaultSerie?.data?.Series)
            setValue('DocNum', series?.defaultSerie?.data?.NextNum)
        }

    }, [series.defaultSerie, watch('DocNum')])


    return {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
        onInvalidForm,
        onSubmit,
        loading,
        allStatus,
        onSelectChangeDocuments,
        documents,
        series: series?.series,
        defaultSerie: series?.defaultSerie,
        edit,
    }
}