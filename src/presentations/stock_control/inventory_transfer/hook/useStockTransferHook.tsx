import FormMessageModal from "@/components/modal/FormMessageModal";
import { delay, useQueryParams } from "@/lib/utils";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { calculateUOM } from "../../components/UomSelectByItem";
import { useGetStockTransferSeriesHook } from "./useGetStockTransferSeriesHook";
import { useGetWhsTerminalAssignHook } from "@/hook/useGetWhsTerminalAssignHook";

export type TransferType = 'Internal' | 'External';


export interface PostInventoryTransfer {
    DocDate: string | undefined;
    BPLID: number | undefined,
    DocumentStatus: string | undefined,
    U_tl_attn_ter: string | undefined,
    ToWarehouse: string | undefined,
    Series: number | undefined,
    FromWarehouse: string | undefined,
    DocNum: number | undefined,
    Comments: string | undefined,
    StockTransferLines: any[],
    DocumentReferences: any[],
    U_tl_fromBinId: number | undefined,
    U_tl_toBinId: number | undefined,
    U_tl_sobincode: number | undefined,
    U_tl_transType: TransferType | undefined,
}

const defaultValues: PostInventoryTransfer = {
    U_tl_transType: 'Internal',
    DocDate: new Date().toISOString()?.split('T')[0],
    BPLID: undefined,
    DocumentStatus: 'bost_Open',
    U_tl_attn_ter: undefined,
    ToWarehouse: undefined,
    Series: undefined,
    FromWarehouse: undefined,
    DocNum: undefined,
    Comments: undefined,
    U_tl_fromBinId: undefined,
    U_tl_toBinId: undefined,
    U_tl_sobincode: undefined,
    StockTransferLines: [],

    DocumentReferences: [],
}


export const getMappingStockTransferRequestToStockTransfer = (id: any): Promise<PostInventoryTransfer> => {
    return new Promise((resolve, reject) => {

        if (!id) reject(new Error('Can not find reference from stock transfer request'));

        request('GET', `/InventoryTransferRequests(${id})`)
            .then(async (res: any) => {

                var payload: PostInventoryTransfer = {
                    U_tl_transType: 'External',
                    DocDate: new Date().toISOString()?.split('T')[0],
                    BPLID: res?.data?.BPLID,
                    DocumentStatus: 'bost_Open',
                    U_tl_attn_ter: res?.data?.U_tl_attn_ter,
                    ToWarehouse: res?.data?.ToWarehouse,
                    Series: undefined,
                    FromWarehouse: res?.data?.FromWarehouse,
                    DocNum: undefined,
                    Comments: `Based On Inventory Transfer Request ${res?.data?.DocNum}.`,
                    U_tl_fromBinId: undefined,
                    U_tl_toBinId: undefined,
                    U_tl_sobincode: res?.data?.U_tl_sobincode,
                    StockTransferLines: [],
                    DocumentReferences: [
                        {
                            "RefDocEntr": res?.data?.DocEntry,
                            "RefDocNum": res?.data?.DocNum,
                            "RefObjType": "rot_InventoryTransferRequest"
                        }
                    ]
                }

                for (const item of (res?.data?.StockTransferLines ?? [])) {
                    const response: any = await request('GET', `Items('${item?.ItemCode}')?$select=ItemWarehouseInfoCollection,UoMGroupEntry`);

                    if (!response?.data)
                        reject(new Error('Internal Errro (1).'))

                    const defaultBin = response?.data?.ItemWarehouseInfoCollection?.find((e: any) => e?.WarehouseCode === item?.FromWarehouseCode)?.DefaultBin;
                    const uomGroupsResponse: any = await request('GET', `UnitOfMeasurementGroups(${response?.data?.UoMGroupEntry})`);

                    if (!uomGroupsResponse?.data)
                        reject(new Error('Internal Errro (1).'))

                    const uom = uomGroupsResponse?.data?.UoMGroupDefinitionCollection?.find((e: any) => e?.AlternateUoM === item?.UoMEntry);

                    if (!uom)
                        reject(new Error('Internal Errro (1).'))

                    let bins: any = {};
                    if (res?.data?.U_tl_toBinId) {
                        bins = await request('GET', `BinLocations?$select=AbsEntry,Warehouse,BinCode&$filter=BinCode eq '${res?.data?.U_tl_sobincode}'`);
                        if (!bins)
                            reject(new Error('Internal Errro (1).'))
                    }

                    payload['StockTransferLines'].push({
                        ItemCode: item?.ItemCode,
                        ItemDescription: item?.ItemDescription,
                        Quantity: item?.Quantity,
                        UoMCode: item?.UoMCode,
                        UoMEntry: item?.UoMEntry,
                        UseBaseUnits: "tNO",
                        StockTransferLinesBinAllocations: [
                            {
                                BinAbsEntry: defaultBin,
                                Quantity: calculateUOM(uom?.BaseQuantity, uom?.AlternateQuantity, item?.Quantity),
                                AllowNegativeQuantity: "tNO",
                                SerialAndBatchNumbersBaseLine: -1,
                                BinActionType: "batFromWarehouse"
                            },
                            {
                                BinAbsEntry: res?.data?.U_tl_toBinId ?? bins?.data?.value?.at(0)?.AbsEntry,
                                Quantity: calculateUOM(uom?.BaseQuantity, uom?.AlternateQuantity, item?.Quantity),
                                AllowNegativeQuantity: "tNO",
                                SerialAndBatchNumbersBaseLine: -1,
                                BinActionType: "batToWarehouse"
                            }
                        ],
                    })
                }

                resolve(payload)
            }).catch((e) => {
                reject(e)
            })
    })
}


export const useStockTransferFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
    const [loading, setLoading] = useState(false);


    const { series } = useGetStockTransferSeriesHook()
    const warehouese = useGetWhsTerminalAssignHook(false);

    const { id } = useParams();

    const queryParams = useQueryParams();

    const {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues
    });


    const onSubmit = async (payload: any) => {
        try {
            let fromBinId = payload.U_tl_fromBinId
            const toBinId = payload.U_tl_toBinId

            payload.U_tl_fromBinId;
            payload.U_tl_toBinId;
            payload.U_tl_sobincode;
            delete payload.U_tl_uobincode;
            setLoading(true);

            if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
                dialog.current?.error("Stock Transfer Lines must have at least one row.")
                return;
            }


            for (let index = 0; index < payload?.StockTransferLines?.length; index++) {
                if (!fromBinId) {
                    const response: any = await request('GET', `Items('${payload?.StockTransferLines[index]?.ItemCode}')?$select=ItemWarehouseInfoCollection,UoMGroupEntry`);
                    const defaultBin = response?.data?.ItemWarehouseInfoCollection?.find((e: any) => e?.WarehouseCode === payload?.FromWarehouse);
                    fromBinId = defaultBin?.DefaultBin;
                }


                if (fromBinId) payload['StockTransferLines'][index]['StockTransferLinesBinAllocations'][0]['BinAbsEntry'] = fromBinId
                if (toBinId) payload['StockTransferLines'][index]['StockTransferLinesBinAllocations'][1]['BinAbsEntry'] = toBinId
            }

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
        console.log(e)

        if (e.StockTransferLines) {
            if (e.StockTransferLines?.length === 0) return;
            const key = Object.keys(e.StockTransferLines[0])[0]
            dialog.current?.error(e.StockTransferLines[0][key].message)
        }
    }

    const onChangeBranch = (series: any, value: any) => {

        const period = new Date().getFullYear();
        const serie = series?.data?.find((e: any) => e?.PeriodIndicator === period.toString() && e?.BPLID === value?.BPLID);

        const git_wsh = warehouese.data?.filter((e: any) => e?.BusinessPlaceID === value?.BPLID && e.U_tl_git_whs === 'Y');
        setValue("FromWarehouse", queryParams.get('type') === 'external' ? git_wsh?.at(0)?.WarehouseCode : undefined);
        setValue("ToWarehouse", undefined);
        setValue("U_tl_attn_ter", undefined);
        setValue("DocNum", serie?.NextNumber);
        setValue('BPLID', value?.BPLID)
    }

    const onCopyFrom = (id: number | undefined) => {
        try {
            setLoading(true);
            getMappingStockTransferRequestToStockTransfer(id)
                .then((res) => {
                    reset({ ...res })
                    onChangeBranch(series, { BPLID: res?.BPLID })
                })
                .catch((err) => {
                    dialog.current?.error(err?.message)
                }).finally(() => {
                    setLoading(false)
                })
        } catch (error: any) {
            dialog.current?.error(error?.message ?? '')
        }
    }

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        request('GET', `StockTransfers(${id})`)
            .then((res: any) => {
                setLoading(false)
                console.log(res.data)
                reset({ ...res.data }, { keepValues: false })
            })
            .catch((e: any) => {
                setLoading(false)
                dialog.current?.error(e?.message)
            });
    }, [id, edit])

    useEffect(() => {
        if (queryParams.get('id') && queryParams.get('type')) {
            setLoading(true);
            getMappingStockTransferRequestToStockTransfer(queryParams.get('id'))
                .then((res) => {
                    reset({ ...res });
                    onChangeBranch(series, { BPLID: res?.BPLID })

                })
                .catch((err) => {
                    dialog.current?.error(err?.message)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }, [queryParams.get('id'), queryParams.get('type')])

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
        id,
        queryParams,
        onCopyFrom,
        onChangeBranch
    }
}