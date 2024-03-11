

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
    onChange: (val: OnChangeProp) => void
}

const getUOMGroup = (id?: number | undefined) => {
    if (!id) return []

    return request('GET', `UnitOfMeasurementGroups(${id})`).then((res: any) => res.data);
}

export const fractionDigits = (value: number, digit?: number) => {
    const formater = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digit ?? 4,
        maximumFractionDigits: digit ?? 4,
    });

    return formater.format(value).replace(/,/g, "");
};

const calculateUOM = (
    baseQty: number,
    alternativeQty: number,
    qty: number
): any => {
    let totalQty: any = fractionDigits(baseQty / alternativeQty, 6);
    totalQty = fractionDigits(qty * totalQty, 4);
    return totalQty;
};

export default function UomSelect(props: UomSelectProp) {
    const [selected, setSelected] = useState<string>('');

    const group = useQuery({ queryKey: [`uom_group_lists_${props.id}`], queryFn: () => getUOMGroup(props.id) })
    const uomList = useQuery({ queryKey: ['uom_lists'], queryFn: () => request('GET', 'UnitOfMeasurements?$select=Code,Name,AbsEntry') });


    const data: any[] = useMemo(() => {
        if (!uomList.data || !group.data) return [];

        const uomGroups: number[] = group.data?.UoMGroupDefinitionCollection?.map((e: any) => e.AlternateUoM)
        return (uomList.data as any).data.value?.filter((e: any) => uomGroups?.includes(e.AbsEntry))
    }, [uomList.data, group.data])


    // useEffect(() => {
    //     if (props.value) {
    //         setSelected(props.value)
    //     } else {
    //         setSelected(group.data?.BaseUoM)
    //     }
    // }, [props.value, group.data])


    const onSelectChange = (event: any,) => {
        setSelected(event.target.value)
        // 
        const selectedUoM = group.data?.UoMGroupDefinitionCollection?.find((e: any) => e.AlternateUoM === event.target.value);
        const value = data.find((e) => e.AbsEntry === event.target.value)

        props.onChange({ AbsEntry: value.AbsEntry, Code: value.Code, Quantity: calculateUOM(selectedUoM.BaseQuantity, selectedUoM.AlternateQuantity, 1) } as OnChangeProp)
    }


    return <MUISelect
        value={selected}
        items={data}
        onChange={onSelectChange}
        aliaslabel='Code'
        aliasvalue='AbsEntry'
    />
}
