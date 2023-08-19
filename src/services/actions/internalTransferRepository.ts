import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import InternalTransfer from "../../models/InternalTransfer";
import BusinessPartner from "@/models/BusinessParter";
import BusinessPartnerRepository from "./bussinessPartnerRepository";
import PurchaseAgreement from "@/models/PurchaseAgreement";

export default class InternalTransferRepository extends Repository<InternalTransfer> {
  url: string = "/InventoryTransferRequests";
  query: string = "?$filter=U_TRANSTYPE eq 'I'";

  public static documentSerie = {
    Document: "1470000113",
  };

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new InternalTransfer(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }

  // async find<T>(id: any): Promise<any> {
  //   const InternalTransfer = await request("GET", `${this.url}(${id})`)
  //     .then((res: any) => new InternalTransfer(res.data))
  //     .catch((e: Error) => {
  //       throw new Error(e.message);
  //     });

  //   return InternalTransfer;
  // }

  async find<T>(id: any): Promise<any> {
    const internalTransfer = await request('GET', `${this.url}(${id})`).then((res: any) => new InternalTransfer(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(internalTransfer.cardCode!);

    // internalTransfer.email = businessPartner.email;
    // internalTransfer.phone = businessPartner.phone;
    // internalTransfer.contactPersonList = businessPartner.contactEmployee ?? [];
    // internalTransfer.shippingType = businessPartner.bpAddress ?? []
    // console.log(businessPartner.bpAddress)

    return internalTransfer;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        InternalTransfer.toUpdate(payload)
      );

    return await request("POST", this.url, InternalTransfer.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, InternalTransfer.toUpdate(payload));
  }

  async delete(id: any): Promise<InternalTransfer> {
    throw new Error("Method not implemented.");
  }
}
