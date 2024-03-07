import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";


export const useFuelLevelFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
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
        defaultValues: {
            U_tl_doc_date: new Date().toISOString()?.split('T')[0],
            U_tl_bplid: undefined,
            TL_FUEL_LEVEL_LINESCollection: []
        }
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
        // 
        onInvalidForm,
        onSubmit,
        loading,
    }
}