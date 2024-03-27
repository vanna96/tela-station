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
            TaxDate: new Date().toISOString()?.split('T')[0],
            BPLID: undefined,
            StockTransferLines: [],
            ToWarehouse: undefined,
        }
    });

    const onSubmit = async (payload: any) => {
        try {
            if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
                dialog.current?.error("Stock Transfer Lines must have at least one row.")
                return;
            }

            setLoading(true);

            for (let index = 0; index < payload.StockTransferLines.length; index++) {
                if (payload.StockTransferLines[index]['U_tl_toBinId']) continue;
                // 
                payload.StockTransferLines[index]['U_tl_toBinId'] = payload.U_tl_toBinId;

                if (!payload.StockTransferLines[index]['U_tl_toBinId'])
                    throw new Error('To Bin Code is required');
            }

            const url = edit ? `InventoryTransferRequests(${id})` : 'InventoryTransferRequests';
            const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
            setLoading(false)


            if (!response.data && typeof response !== 'string') {
                dialog.current?.error("Error")
                return;
            }

            dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
        } catch (error: any) {
            setLoading(false)
            dialog.current?.error(error?.message);
        }
    };

    const onInvalidForm = (e: any) => {
        if (e.StockTransferLines) {
            if (e.StockTransferLines?.length === 0) return;
            const key = Object.keys(e.StockTransferLines[0])[0]
            dialog.current?.error(e.StockTransferLines[0][key].message)
        }
    }

    useEffect(() => {
        setLoading(false)
        if (id) {
            setLoading(true)
            request('GET', `InventoryTransferRequests(${id})`)
                .then((res: any) => {
                    setLoading(false)
                    reset({ ...res.data }, {
                        keepDirtyValues: false,
                        keepErrors: false,
                        keepDirty: false,
                        keepDefaultValues: false,
                        keepIsSubmitted: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                        keepTouched: false,
                        keepValues: false,
                        keepIsSubmitSuccessful: false
                    })
                })
                .catch((e: any) => {
                    setLoading(false)
                    dialog.current?.error(e?.message)
                });
        }

    }, [id])


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
        setLoading,
        id,

    }
}