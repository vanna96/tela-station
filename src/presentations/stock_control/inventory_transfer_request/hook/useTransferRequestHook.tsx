import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const getGITWarehouestByBranch = (id: any) => {
    return request('GET', `/Warehouses?$select=WarehouseCode,WarehouseName,U_tl_attn_ter,U_tl_whsclear,DefaultBin,BusinessPlaceID,U_tl_git_whs&$filter=BusinessPlaceID eq ${id} and U_tl_git_whs eq 'Y'`)
        .then((res: any) => res?.data?.value?.at(0)?.WarehouseCode)
        .catch((e) => undefined)
}

export const useTransferRequestFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
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
            DocDate: new Date().toISOString()?.split('T')[0],
            BPLID: undefined,
            StockTransferLines: []
        }
    });


    const onSubmit = async (payload: any) => {
        if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
            dialog.current?.error("Stock Transfer Lines must have at least one row.")
            return;
        }

        setLoading(true);
        const url = edit ? `InventoryTransferRequests(${id})` : 'InventoryTransferRequests';
        const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
        setLoading(false)


        if (!response.data && typeof response !== 'string') {
            dialog.current?.error("Error")
            return;
        }

        dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
    };

    const onInvalidForm = (e: any) => {
        if (e.StockTransferLines) {
            if (e.StockTransferLines?.length === 0) return;
            const key = Object.keys(e.StockTransferLines[0])[0]
            dialog.current?.error(e.StockTransferLines[0][key].message)
        }
    }

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        request('GET', `InventoryTransferRequests(${id})`)
            .then((res: any) => {
                setLoading(false)
                reset({ ...res.data }, { keepValues: false })
            })
            .catch((e: any) => {
                setLoading(false)
                dialog.current?.error(e?.message)
            });
    }, [id, edit])

    // const getGITWarehouese = useQuery({ queryKey: ['git_warehouest_bplid' + (watch('BPLID') ?? '')], queryFn: () => getGITWarehouestByBranch(watch('BPLID')) });

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