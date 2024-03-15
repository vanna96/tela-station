import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";


export const useStockTransferFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
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
            DocumentStatus: 'bost_Open',
            StockTransferLines: []
        }
    });


    const onSubmit = async (payload: any) => {
        try {
            const fromBinId = payload.U_tl_fromBinId
            const toBinId = payload.U_tl_toBinId

            delete payload.U_tl_fromBinId;
            delete payload.U_tl_toBinId;
            delete payload.U_tl_sobincode;
            delete payload.U_tl_uobincode;
            delete payload.U_tl_transType;

            if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
                dialog.current?.error("Stock Transfer Lines must have at least one row.")
                return;
            }

            for (let index = 0; index < payload?.StockTransferLines?.length; index++) {
                payload['StockTransferLines'][index]['StockTransferLinesBinAllocations'][0]['BinAbsEntry'] = fromBinId
                payload['StockTransferLines'][index]['StockTransferLinesBinAllocations'][1]['BinAbsEntry'] = toBinId
            }

            setLoading(true);
            const url = edit ? `StockTransfers(${id})` : 'StockTransfers';
            const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
            setLoading(false)


            if (!response.data && typeof response !== 'string') {
                dialog.current?.error("Error")
                return;
            }

            dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
        } catch (e: any) {
            setLoading(false)
            dialog.current?.error(e?.message)
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
        if (!id) return;
        setLoading(true)
        request('GET', `StockTransfers(${id})`)
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
        setLoading,
        onInvalidForm,
        onSubmit,
        loading,
        id
    }
}