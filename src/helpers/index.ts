import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";

const uomGroupRepo = new UnitOfMeasurementGroupRepository();

export const getUOMGroupByCode = (code: any) => {
    const session = JSON.parse(sessionStorage.getItem('REACT_QUERY_OFFLINE_CACHE') ?? '{}');
    const items = session['clientState']['queries']?.find((e: any) => e?.queryKey?.includes('items'))?.state?.data ?? [];
    return uomGroupRepo.find(items?.find((e: any) => e?.ItemCode === code)?.UoMGroupEntry);
}   