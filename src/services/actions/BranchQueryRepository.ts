import Repository from "@/astractions/repository";
import BranchQuery from "@/models/BranchQuery";
import BusinessPartner from "@/models/BusinessParter";
import request from "@/utilies/request";



export default class BranchQueryRepository extends Repository<BranchQuery> {
    url = '/sml.svc/TL_BP_BRANCH_QUERY';

    async get<BranchQuery>(query?: string | undefined): Promise<BranchQuery[]> {
        return await request('GET', this.url+ query).then((res: any) => res?.data?.value).catch((e) => {
            throw new Error(e);
        });
    }

    async find<T>(id: string, query?: string[]): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${query?.join(',')}`).then((res: any) => new BranchQuery(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
    }
    async findContactEmployee<T>(id: string): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${['EmailAddress', 'Phone1', 'ContactEmployees', 'BPAddresses', 'ShipToDefault'].join(',')}`).then((res: any) => new BusinessPartner(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
    }

    async findShipToAddress<T>(id: string): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${['BPAddresses', 'ShipToDefault'].join(',')}`).then((res: any) => new BusinessPartner(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
    }

    post(payload: any): Promise<BranchQuery> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<BranchQuery> {
        throw new Error("Method not implemented.");
    }
    delete(id: any): Promise<BranchQuery> {
        throw new Error("Method not implemented.");
    }

}