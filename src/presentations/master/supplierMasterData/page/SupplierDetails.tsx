import { withRouter } from "@/routes/withRouter";
import React, { Component, useEffect, useMemo } from "react";
import Taps from "@/components/button/Taps";
import Modal from "@/components/modal/Modal";
import { CircularProgress } from "@mui/material";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import BusinessPatners from "@/models/BusinessPartner";
import BussinessPartnersRepository from "@/services/actions/bussinessPartnerRepositorys";
import BusinessPartnerGroupsRepository from "@/services/actions/businessPartnerGroups";
import CurrencyRepository from "@/services/actions/currencyRepository";
import { currencyFormat } from "@/utilies";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import FactoringIndicatorRepository from "@/services/actions/factoringIndicatorRepository";
import IndustryRepository from "@/services/actions/industries";
import BuyerRepository from "@/services/actions/buyerRepository";
import Territory from "@/models/Territory";
import TerritoryRepository from "@/services/actions/territoryRepository";
import Industry from "@/models/Industry";
import CountryRepository from "@/services/actions/countryReporitory";
import { functionalUpdate } from "react-query/types/core/utils";
import PaymentTermTypeRepository from "@/services/actions/paymentTermTypeRepository";
import PriceListRepository from "@/services/actions/pricelistReporitory";
import PriorityRepository from "@/services/actions/priorityReposiroty";
import HolidayRepository from "@/services/actions/holidaysRepository";
import BankRepository from "@/services/actions/bankRepository";
import PaymentBlockRepository from "@/services/actions/paymentBlockReporitory";
import BankChargesAllocationCodesSelect from "@/components/selectbox/BankChargesAllocationCodes";
import BankChargesAllocationCodeRepository from "../../../../services/actions/bankChargesAllocationCodeRepository";
import HousebankAccountRepository from "@/services/actions/houseBankAccountRepository";
import MaterialReactTable from "material-react-table";
import moment from "moment";
class SupplierDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
    };

    this.initData = this.initData.bind(this);
  }

  componentDidMount(): void {
    this.initData();
  }

  initData() {
    const { id } = this.props.match.params;
    const data = this.props.location.state as BusinessPatners;
    console.log(data);

    if (data) {
      setTimeout(() => {
        let supplier = data;
        supplier as BusinessPatners;
        if ("") {
        } else {
          this.setState({ ...supplier, loading: false });
        }
      }, 500);
    } else {
      new BussinessPartnersRepository()
        .find(id)
        .then((res: any) => {
          this.setState({ ...res, loading: false });
        })
        .catch((e: Error) => {
          this.setState({ isError: true, message: e.message });
        });
    }
  }

  render() {
    return (
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <DocumentHeaderComponent data={this.state} />

        <Modal
          open={this.state.isError}
          title="Oop"
          onClose={() => { }}
          onOk={() => console.log(this.props.history.goBack())}
        >
          <span>{this.state?.message}</span>
        </Modal>

        {this.state.loading ? (
          <div className="grow flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="min-h-[18rem] grid grid-cols-2 gap-3 w-full shadow-sm rounded-lg bg-white text-[12px] p-6">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Card Code</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.cardCode ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Card Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.cardName ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Foreign Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.cardForeignName ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Group</span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {new BusinessPartnerGroupsRepository().find(
                      this.state.groupCode
                    )?.name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Currency</span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {new CurrencyRepository().find(this.state.currency)?.name ??
                      "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Federal Tax ID</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.federalTaxID ?? "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Account Balance</span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {currencyFormat(this.state.currentAccountBalance ?? "N/A")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">
                    Goods Receipt POs
                  </span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {currencyFormat(
                      this.state.openDeliveryNotesBalance ?? "N/A"
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Purchase Orders</span>
                  <span className="w-8/12 font-medium">
                    : {currencyFormat(this.state.openOrdersBalance ?? "N/A")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white">
              <Taps
                items={[
                  "General",
                  "Contact Persons",
                  "Addresses",
                  "Payment Terms",
                  "Payment Run",
                  "Accountting",
                  "Remarks",
                ]}
              >
                <General data={this.state} />
                <ContactPerson data={this.state} />
                <Address data={this.state} />
                <Paymentterms data={this.state} />
                <PaymentRun data={this.state} />
                <Accounting data={this.state} />
                <Remarks data={this.state} />
                <PreviewAttachment
                  attachmentEntry={this.state.attachmentEntry}
                />
              </Taps>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(SupplierDetail);

function General(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Tel 1</span>
            <span className="w-8/12 font-medium">
              : {data?.phone1 ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Tel 2</span>
            <span className="w-8/12 font-medium">
              : {data?.phone2 ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Mobile Phone</span>
            <span className="w-8/12 font-medium">
              : {data?.cellular ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Fax</span>
            <span className="w-8/12 font-medium">: {data?.fax ?? "N/A"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">E-Mail</span>
            <span className="w-8/12 font-medium">
              : {data?.emailAddress ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Website</span>
            <span className="w-8/12 font-medium">
              : {data?.website ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Shipping Type</span>:{" "}
            {new ShippingTypeRepository().find(data?.shippingType)?.Name ??
              "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Password</span>
            <span className="w-8/12 font-medium">
              : {data?.password ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Factoring Indicator</span>
            <span className="w-8/12 font-medium">
              : {data?.indicator ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">
              Business Partner Project
            </span>
            <span className="w-8/12 font-medium">
              : {data?.projectCode ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Industry</span>:{" "}
            {new IndustryRepository().find(data?.industry)?.name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Type Of Business</span>
            <span className="w-8/12 font-medium">
              {" "}
              : {BusinessPatners.getCompany(data.companyPrivate)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Alias Name</span>
            <span className="w-8/12 f2ont-medium">
              : {data?.aliasName ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Contact Person</span>
            <span className="w-8/12 font-medium">
              : {data?.contactPerson ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">ID No. 2</span>
            <span className="w-8/12 font-medium">
              : {data?.additionalID ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">unified Federal Tax ID</span>
            <span className="w-8/12 font-medium">
              : {data?.unifiedFederalTaxID ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Remarks</span>
            <span className="w-8/12 font-medium">: {data?.notes ?? "N/A"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Buyer</span>:{" "}
            {new BuyerRepository().find(data?.salesPersonCode)?.name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Teritory</span>:{" "}
            {new TerritoryRepository().find(data?.territory)?.name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">GLN</span>
            <span className="w-8/12 font-medium">
              : {data?.globalLocationNumber ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
function ContactPerson(props: any) {
  const { data } = props;
  const itemColumn = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Contact ID", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 120,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        Cell: ({ cell }: any) => cell.getValue(),
        size: 150,
      },
      {
        accessorKey: "middleName",
        header: "	Middle Name",
        enableClickToCopy: true,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "title",
        header: "Title",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "position",
        header: "Position",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "address",
        header: "Address",
        Cell: ({ cell }: any) => cell.getValue(),
        enableClickToCopy: true,
      },
      {
        accessorKey: "phone1",
        header: "TelePhone 1",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "phone2",
        header: "TelePhone 2",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "mobilePhone",
        header: "Mobile Phone",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "fax",
        header: "Fax",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "e_Mail",
        header: "E_Mail",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "emailGroupCode",
        header: "E-mail GroupCode",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "pager",
        header: "Pager",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "remarks1",
        header: "Remark1",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "remarks2",
        header: "Remark2",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "password",
        header: "Password",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "placeOfBirth",
        header: "Country/Region Of Birth",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date Of Birth ",
        Cell: ({ cell }: any) => (
          <>{moment(cell.getValue()).format("DD-MM-YYYY")}</>
        ),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        Cell: ({ cell }: any) => cell.getValue()?.split("gt_"),
      },
      {
        accessorKey: "profession",
        header: "Profession",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "cityOfBirth",
        header: "City Of Birth",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "connectedAddressName",
        header: "Connected Address",
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  );
  console.log(data);

  return (
    <div className="data-table text-inherit  border-none p-0 mt-3">
      <MaterialReactTable
        columns={itemColumn}
        data={data?.contactEmployees ?? []}
        enableHiding={true}
        initialState={{ density: "compact" }}
        enableDensityToggle={false}
        enableColumnResizing
        enableStickyHeader={true}
        enableStickyFooter={true}
        enableTableHead={true}
        enableTopToolbar={false}
        enableColumnActions={false}
        enableGlobalFilter={false}
        enableFilters={false}
        enableFullScreenToggle={false}
        enablePagination={false}
        getRowId={(row: any) => row.DocEntry}
        state={
          {
            // isLoading: true,
          }
        }
      />
    </div>
  );
}

function Address(props: any) {
  const { data } = props;
  const itemColumn = useMemo(
    () => [
      {
        accessorKey: "addressName",
        header: "Address ID", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 120,
      },
      {
        accessorKey: "addressName2",
        header: "Address Name 2 ",
        Cell: ({ cell }: any) => cell.getValue(),
        size: 150,
      },
      {
        accessorKey: "addressName3",
        header: "	Address Name 3",
        enableClickToCopy: true,
      },
      {
        accessorKey: "street",
        header: "Street / PO Box",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "block",
        header: "Block",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "city",
        header: "City",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
        Cell: ({ cell }: any) => cell.getValue(),
        enableClickToCopy: true,
      },
      {
        accessorKey: "county",
        header: "County",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "state",
        header: "State",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "country",
        header: "Country/Region",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "streetNo",
        header: "Street No.",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "buildingFloorRoom",
        header: "Building/Floor/Room",
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  );
  console.log(data);

  return (
    <div className="data-table text-inherit  border-none p-0 mt-3">
      <MaterialReactTable
        columns={itemColumn}
        data={data.bPAddresses ?? []}
        enableHiding={true}
        initialState={{ density: "compact" }}
        enableDensityToggle={false}
        enableColumnResizing
        enableStickyHeader={true}
        enableStickyFooter={true}
        enableTableHead={true}
        enableTopToolbar={false}
        enableColumnActions={false}
        enableGlobalFilter={false}
        enableFilters={false}
        enableFullScreenToggle={false}
        enablePagination={false}
        getRowId={(row: any) => row.DocEntry}
        state={
          {
            // isLoading: true,
          }
        }
      />
    </div>
  );
}
function Paymentterms(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="w-5/12 text-gray-500">Payment Terms</span>
            <span className="w-7/12 font-medium">
              :{" "}
              {new PaymentTermTypeRepository().find(data?.payTermsGrpCode)
                ?.PaymentTermsGroupName ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Interest On Arrears %</span>
            <span className="w-8/12 font-medium">
              : {currencyFormat(data?.intrestRatePercent)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Price List</span>:
            {new PriceListRepository().find(data?.priceListNum)
              ?.PriceListName ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Total Discount %</span>
            <span className="w-8/12 font-medium">
              : {currencyFormat(data?.discountPercent)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Credit limit</span>
            <span className="w-8/12 font-medium">
              : {currencyFormat(data?.creditLimit)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Commitment limit</span>
            <span className="w-8/12 font-medium">
              : {currencyFormat(data?.maxCommitment)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">
              Effective Discount Groups
            </span>
            <span className="w-8/12 font-medium">
              : {BusinessPatners.getEffectiveDiscount(data.effectiveDiscount)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Effective Price</span>
            <span className="w-8/12 font-medium">
              : {BusinessPatners.getEffectivePrice(data.effectivePrice)}
            </span>
          </div>
          <span className="text-black text-[18px]">Business Partner Bank</span>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Bank Country/Region</span>:
            {new CountryRepository().find(data?.bankCountry)?.Name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Bank Name</span>:
            {new BankRepository().find(data?.defaultBankCode)?.BankName ??
              "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Bank Name</span>:
            {new BankRepository().find(data?.defaultBankCode)?.BankCode ??
              "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Account</span>
            <span className="w-8/12 font-medium">
              : {data?.defaultAccount ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">BIC/SWIFT Code</span>
            <span className="w-8/12 font-medium">
              : {data?.bICSwiftCode ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Bank Account Name</span>
            <span className="w-8/12 font-medium">
              : {data?.defaultBankCode ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Branch</span>
            <span className="w-8/12 font-medium">
              : {data?.defaultBranch ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">ControlKey</span>
            <span className="w-8/12 font-medium">
              : {data?.controlKey ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">IBAN</span>
            <span className="w-8/12 font-medium">: {data?.iBAN ?? "N/A"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Mandate ID</span>
            <span className="w-8/12 font-medium">
              : {data?.mandateID ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Date Of Signature</span>
            <span className="w-8/12 font-medium">
              : {data?.signatureDate ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Average Delay</span>
            <span className="w-8/12 font-medium">
              : {data?.avarageLate ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Price List</span>:{" "}
            {new PriorityRepository().find(data?.priority)?.name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Default IBAN</span>
            <span className="w-8/12 font-medium">: {data?.iBAN ?? "N/A"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Holiday</span>:
            {new HolidayRepository().find(data?.priority)?.name ?? "N/A"}
          </div>
        </div>
      </div>
    </>
  );
}
function PaymentRun(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Country/Region</span>:
            {new CountryRepository().find(data?.houseBankCountry)?.Name ??
              "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Bank</span>:
            {new BankRepository().find(data?.houseBank)?.BankName ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Account</span>
            <span className="w-8/12 font-medium">
              : {data?.houseBankAccount ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Branch</span>
            <span className="w-8/12 font-medium">
              : {data?.houseBankBranch ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">IBAN</span>
            <span className="w-8/12 font-medium">
              : {data?.HouseBankIBAN ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">BIC/SWIFT Code</span>
            <span className="w-8/12 font-medium">
              : {data?.bICSwiftCode ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Control No.</span>
            <span className="w-8/12 font-medium">
              : {data?.controlKey ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">DME identification</span>
            <span className="w-8/12 font-medium">: {data?.dME ?? "N/A"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Instrction Key</span>
            <span className="w-8/12 font-medium">
              : {data?.instructionKey ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Reference Details</span>
            <span className="w-8/12 font-medium">
              : {data?.referenceDetails ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Payment Block</span>:
            {new PaymentBlockRepository().find(data?.paymentBlockDescription)
              ?.name ?? "N/A"}
          </div>
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">
              Bank Charges Allocation Code
            </span>
            :
            {new BankChargesAllocationCodeRepository().find(
              data?.bankChargesAllocationCode
            )?.name ?? "N/A"}
          </div>
        </div>
      </div>
    </>
  );
}
function Accounting(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <span className=" font-bold">General</span>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Consolidating Business</span>
            <span className="w-7/12 font-medium">
              : {data?.fatherCard ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Account payable</span>
            <span className="w-7/12 font-medium">
              : {data?.debitorAccount ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">
              Down Payment Clearing Account
            </span>
            <span className="w-7/12 font-medium">
              : {data?.downPaymentClearAct ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">
              Down Payment Interim Account
            </span>
            <span className="w-7/12 font-medium">
              : {data?.downPaymentInterimAccount ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Connected Customer</span>
            <span className="w-7/12 font-medium">
              : {data?.linkedBusinessPartner ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Planning Group</span>
            <span className="w-7/12 font-medium">
              : {data?.planningGroup ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className=" font-bold">Tax</span>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Tax Status</span>
            <span className="w-7/12 font-medium">
              : {data?.vatLiable ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">Tax Group</span>
            <span className="w-7/12 font-medium">
              : {data?.vatGroup ?? "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-5/12 text-gray-500">EORI Number</span>
            <span className="w-7/12 font-medium">
              : {data?.eORINumber ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
function Remarks(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="w-4/12 text-gray-500">Remarks</span>
            <span className="w-8/12 font-medium">
              : {data?.freeText ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
