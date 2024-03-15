

import { useEffect, useMemo, useState } from 'react'
import MUISelect from '@/components/selectbox/MUISelect'
import { useQuery } from 'react-query'
import request from '@/utilies/request'

export type OnChangeProp = {
    AbsEntry: number,
    Code: string,
    Quantity: number,
}

export type UomSelectProp = {
    id?: number | undefined,
    value?: any,
    onChange: (val: OnChangeProp) => void,
    item?: string | undefined
    quantity?: number | undefined,
    disabled?: boolean | undefined
}

const getUOMGroup = async (item?: string | undefined) => {
    if (!item) return [];

    const response: any = await request('GET', `/Items('${item}')?$select=UoMGroupEntry`);
    if (!response?.data) return [];

    return request('GET', `UnitOfMeasurementGroups(${response?.data?.UoMGroupEntry})`).then((res: any) => res.data);
}

export const fractionDigits = (value: number, digit?: number) => {
    const formater = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digit ?? 4,
        maximumFractionDigits: digit ?? 4,
    });

    return formater.format(value).replace(/,/g, "");
};

export const calculateUOM = (
    baseQty: number,
    alternativeQty: number,
    qty: number
): any => {
    let totalQty: any = fractionDigits(baseQty / alternativeQty, 6);
    totalQty = fractionDigits(qty * totalQty, 4);
    return totalQty;
};

export default function UomSelectByItem(props: UomSelectProp) {
    const [selected, setSelected] = useState<string>();

    const group = useQuery({ queryKey: [`uom_group_lists_${props.item}`], queryFn: () => getUOMGroup(props.item) })
    const uomList = useQuery({ queryKey: ['uom_lists'], queryFn: () => request('GET', 'UnitOfMeasurements?$select=Code,Name,AbsEntry') });

    const data: any[] = useMemo(() => {
        if (!props.item) return []

        if (!uomList.data || !group.data) return [];

        const uomGroups: number[] = group.data?.UoMGroupDefinitionCollection?.map((e: any) => e.AlternateUoM)
        return (uomList.data as any).data.value?.filter((e: any) => uomGroups?.includes(e.AbsEntry))
    }, [uomList.data, group.data, props.item])


    useEffect(() => {
        const val = data?.find((e) => e?.AbsEntry === props?.value)
        setSelected(val?.AbsEntry)
    }, [props.value, data])



    const onSelectChange = (event: any,) => {
        setSelected(event.target.value)
        // 
        const selectedUoM = group.data?.UoMGroupDefinitionCollection?.find((e: any) => e.AlternateUoM === event.target.value);
        const value = data.find((e) => e.AbsEntry === event.target.value)

        props.onChange({ AbsEntry: value.AbsEntry, Code: value.Code, Quantity: calculateUOM(selectedUoM.BaseQuantity, selectedUoM.AlternateQuantity, props?.quantity ?? 0) } as OnChangeProp)
    }


    return <MUISelect
        value={selected}
        items={data}
        onChange={onSelectChange}
        aliaslabel='Code'
        aliasvalue='AbsEntry'
        loading={group.isLoading}
        disabled={props.disabled}
    />
}
