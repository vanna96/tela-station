import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { POSTTransporationOrder, TOStatus } from "../../type";

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


    const onSubmit = async (payload: any) => {
        if (!payload.TL_FUEL_LEVEL_LINESCollection || payload.TL_FUEL_LEVEL_LINESCollection.length === 0) {
            dialog.current?.error("Fuel Level Collection must have at least one row.")
            return;
        }

        setLoading(true);
        const url = edit ? `TL_FUEL_LEVEL(${id})` : 'TL_FUEL_LEVEL';
        const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
        setLoading(false)


        if (!response.data && typeof response !== 'string') {
            dialog.current?.error("Error")
            return;
        }

        dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
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

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        request('GET', `TL_FUEL_LEVEL(${id})`)
            .then((res: any) => {
                setLoading(false)
                reset({ ...res.data }, { keepValues: false })
            })
            .catch((e: any) => {
                setLoading(false)
                dialog.current?.error(e?.message)
            });
    }, [id, edit])

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
        onSelectChangeDocuments
    }
}