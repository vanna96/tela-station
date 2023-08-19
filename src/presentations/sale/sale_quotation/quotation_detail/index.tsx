import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries, useQuery } from "react-query";
import SalesQuotationRepository from "@/services/actions/SalesQuotationRepository";
import { LabelText } from "./components/Label";
import { ViewDetailLayout } from "./components/ViewDetailLayout";
import loading from "../../../../assets/img/loading.gif";
import { ContentsTab } from "./components/ContentsTab";
import request from "@/utilies/request";
import { LogisticsTab } from "./components/LogisticsTab";
import { AccountingTab } from "./components/AccountingTab";
import { AttachmentTab } from "./components/AttachmentTab";

export default function SaleQuotationDetail() {
  const route = useNavigate();
  const { id } = useParams();

  const { data }: any = useQuery(["sales_quotation", id], () =>
    new SalesQuotationRepository().findByValue(id)
  );

  const { data: bussinessPartner }: any = useQuery(
    ["business_partner", data?.CardCode],
    async () => {
      const res = await request(
        "GET",
        `/BusinessPartners('${data?.CardCode}')?$select=ContactEmployees,BPAddresses,PeymentMethodCode,ShippingType`
      )
        .then((res: any) => {
          const contactEmployee = res?.data?.ContactEmployees.find(
            (e: any) => e.InternalCode === data.ContactPersonCode
          );
          return {
            ShippingType: res?.data?.ShippingType,
            ContactPerson: contactEmployee?.Name,
          };
        })
        .catch((e) => {
          throw new Error(e);
        });

      return res;
    },
    { enabled: data?.CardCode ? true : false }
  );

  const [SalesPerson, ShippingType, Attachment] = useQueries([
    {
      queryKey: ["sales_person", data?.SalesPersonCode],
      queryFn: async () => {
        const res = await request(
          "GET",
          `/SalesPersons(${data?.SalesPersonCode})?$select=SalesEmployeeName`
        )
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e);
          });

        return res;
      },
      enabled: data?.SalesPersonCode ? true : false,
    },
    {
      queryKey: ["shipping_type", bussinessPartner?.ShippingType],
      queryFn: async () => {
        const res = await request(
          "GET",
          `/ShippingTypes(${bussinessPartner?.ShippingType})`
        )
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e);
          });

        return res;
      },
      enabled: bussinessPartner?.ShippingType ? true : false,
    },
    {
      queryKey: ["attachment", data?.DocEntry],
      queryFn: async () => {
        const res = await request(
          "GET",
          `/Attachments2(${data?.AttachmentEntry})`
        )
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e);
          });

        return res;
      },
      enabled: data?.AttachmentEntry ? true : false,
    },
  ]);

  // const isLoading = results.some((result) => result.isLoading);

  if (!data)
    return (
      <div className="w-full h-full m-auto flex justify-center items-center">
        <img
          className="bg-transparent w-[150px]"
          src={loading}
          alt="loading..."
        />
      </div>
    );

  const childBreadcrum = (
    <>
      {" "}
      /{" "}
      <span onClick={() => route("/sale/sales-quotation")}>
        Sales Quotation
      </span>{" "}
      / <span className="text-blue-700">Detail</span>
    </>
  );

  return (
    <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
      <Breadcrumb childBreadcrum={childBreadcrum} />
      <ViewDetailLayout
        taps={["Contents", "Logistics", "Accounting", "Attachment"]}
        items={[
          <ContentsTab data={data} SalesPerson={SalesPerson} />,
          <LogisticsTab data={data} ShippingType={ShippingType?.data} />,
          <AccountingTab data={data} />,
          <AttachmentTab Attachment={Attachment?.data} />,
        ]}
      >
        <h4 className="text-sm  text-gray-500">Vendor Details</h4>
        <hr className="my-3" />

        <LabelText label="Customer " text={data?.CardCode} />
        <LabelText label=" Name" text={data?.CardName} />
        <LabelText
          label="Contact Person"
          text={bussinessPartner?.ContactPerson}
        />
        <LabelText
          label="Customer Ref. Number"
          text={data?.NumAtCard ? data?.NumAtCard : "N/A"}
        />
        <LabelText
          label="Currency"
          text={data?.DocCurrency ? data?.DocCurrency : "N/A"}
        />

        <div className="my-10" />
        <h4 className="text-sm  text-gray-500">Document Details</h4>
        <hr className="my-3" />
        <LabelText label="Document Number" text={data?.DocEntry} />
        <LabelText label="Series Number " text={data?.Series} />
        <LabelText
          label="Vendor Ref. Number"
          text={data?.Reference1 ? data?.Reference1 : "N/A"}
        />
        <LabelText
          label="Status "
          text={data?.Status ? data?.Status : "OPEN"}
        />
        <LabelText label="Posting Date" text={data?.CreationDate} />
        <LabelText label="Delivery Date" text={data?.DocDueDate} />
        <LabelText label="Document Date" text={data?.DocDate} />
      </ViewDetailLayout>
    </div>
  );
}
