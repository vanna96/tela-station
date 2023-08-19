import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries, useQuery } from "react-query";
import loading from "../../../../assets/img/loading.gif";
import request from "@/utilies/request";
import { ContentsTab } from "./components/ContentsTab";
import { AttachmentTab } from "./components/AttachmentTab";
import { ViewDetailLayout } from "./components/ViewDetailLayout";
import { LabelText } from "./components/Label";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";

export default function Detail() {
  const route = useNavigate();
  const { id } = useParams();

  const { data }: any = useQuery(["incoming_payment", id], () =>
    new IncomingPaymentRepository().findByValue(id)
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

  const [
    SalesPerson,
    ShippingType,
    Attachment,
    EmployeesInfo,
    PaymentTermsTypes,
    Indicators,
  ]: any = useQueries([
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
    {
      queryKey: ["employees_info"],
      queryFn: async () => {
        const select = `$select=EmployeeID,FirstName,LastName`;
        const res = await request("GET", `/EmployeesInfo?${select}`)
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e);
          });

        return res;
      },
      enabled: data?.DocumentsOwner ? true : false,
    },
    {
      queryKey: "payment_terms_types",
      queryFn: async () => {
        const res = request("GET", "/PaymentTermsTypes")
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error));
        return res;
      },
      enabled: data?.PaymentGroupCode ? true : false,
    },
    {
      queryKey: "indicators",
      queryFn: async () => {
        const res = request("GET", "/FactoringIndicators")
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error));
        return res;
      },
      enabled: data?.Indicator ? true : false,
    },
  ]);

  const { data: customerInvoice } = useQuery({
    queryKey: ["customer_invoice", data?.CardCode],
    queryFn: async () => {
      const userType =
        (data?.DocType?.replace("r", "") || "Customer") === "Supplier"
          ? `Biz_InComingPayTest_A_P_B1SLQuery`
          : `Biz_InComingPayTest_A_R_B1SLQuery`;
      const invoices = await request(
        "GET",
        `view.svc/${userType}?$filter=BPCode eq '${data?.CardCode}' or CardParent eq '${data?.CardCode}'`
      )
        .then((res: any) => res?.data?.value)
        .catch((err: any) => console.log(err));
      return invoices;
    },
    enabled: data ? true : false,
  });

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
      <span onClick={() => route("/banking/incoming-payments")}>
        Incoming Payments
      </span>{" "}
      / <span className="text-blue-700">Detail</span>
    </>
  );

  const userType = data?.DocType.replace("r", "");
  const isAccount = userType === "Account";

  return (
    <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
      <Breadcrumb childBreadcrum={childBreadcrum} />
      <ViewDetailLayout
        taps={["Contents", "Attachment"]}
        items={[
          <ContentsTab
            data={data}
            SalesPerson={SalesPerson}
            EmployeesInfo={EmployeesInfo}
            customerInvoice={customerInvoice}
          />,
          <AttachmentTab Attachment={Attachment?.data} data={data} />,
        ]}
      >
        <h4 className="text-sm  text-gray-500">{userType} Details</h4>
        <hr className="my-3" />

        <LabelText label="Code " text={isAccount ? "" : data?.CardCode} />
        <LabelText label="Name " text={isAccount ? "" : data?.CardName} />
        <LabelText label="Bill To " text={isAccount ? "" : data?.Address} />
        <LabelText
          label="Contact Person "
          text={isAccount ? "" : bussinessPartner?.ContactPerson}
        />
        <LabelText
          label="Currency "
          text={
            data?.DocCurrency
              ? `${data?.DocCurrency} ${data?.DocRate || ""}`
              : "N/A"
          }
        />

        <div className="my-10" />
        <h4 className="text-sm  text-gray-500">Document Details</h4>
        <hr className="my-3" />
        <LabelText label="Document Number" text={data?.DocNum} />
        <LabelText label="Series Number " text={data?.Series} />
        <LabelText
          label="Status "
          text={data?.Status ? data?.Status : "OPEN"}
        />
        <LabelText label="Posting Date" text={data?.DocDate} />
        <LabelText label="Delivery Date" text={data?.DueDate} />
        <LabelText label="Document Date" text={data?.TaxDate} />
      </ViewDetailLayout>
    </div>
  );
}
