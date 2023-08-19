import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import { UpdateDataSuccess } from "@/utilies/ClientError";
import Heading from "../components/Heading";
import BussinessPartnersRepository from "@/services/actions/bussinessPartnerRepositorys";
import General from "../components/General";
import ContactPerson from "../components/ContactPersons";
import Address from "../components/Address";
import PaymentTerm from "../components/PaymentTerm";
import PaymentRun from "../components/PaymentRun";
import Accounting from "../components/Accounting";
import Remark from "../components/Remarks";
import BusinessPatners from "@/models/BusinessPartner";
import CoreBusineesPartnerDocument from "@/components/core/CoreBusinessPartner";

class BusinessPartners extends CoreBusineesPartnerDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
    } as any;
    console.log(this.state);

    this.handlerSubmit = this.handlerSubmit.bind(this);
    
  }

  componentDidMount(): void {
    if (!this.props?.edit) {
      setTimeout(() => this.setState({ ...this.state, loading: false }), 500);
    }

    if (this.props.edit) {
      if (this.props.location.state) {
        const routeState = this.props.location.state;
        setTimeout(
          () =>
            this.setState({
              ...this.props.location.state,
              loading: false,
            }),
          500
        );
      } else {
        new BussinessPartnersRepository()
          .find(this.props.match.params.id)
          .then((res: any) => {
            this.setState({ ...res, loading: false });
          })
          .catch((e: Error) => {
            this.setState({ message: e.message });
          });
      }
    }

    DocumentSerieRepository.getDocumentSeries(
      BussinessPartnersRepository.documentSerie
    ).then((res: any) => {
      this.setState({ ...this.state, series: res, isLoadingSerie: false });
    });

    if (!this.props.edit) {
      DocumentSerieRepository.getDefaultDocumentSerie(
        BussinessPartnersRepository.documentSerie
      ).then((res: any) => {
        this.setState({
          ...this.state,
          serie: res?.Series,
          docNum: res?.NextNumber,
          isLoadingSerie: false,
        });
      });
    }
  }
  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params;

    await new BussinessPartnersRepository()
      .post(this.state, this.props?.edit, id)
      .then((res: any) => {
        const supplier = new BusinessPatners(res?.data);

        this.props.history.replace(
          this.props.location.pathname?.replace("create", supplier.id),
          supplier
        );
        this.dialog.current?.success("Create Successfully.");
      })
      .catch((e: any) => {
        if (e instanceof UpdateDataSuccess) {
          this.props.history.replace(
            this.props.location.pathname?.replace("/edit", ""),
            {
              ...this.state,
              isSubmitting: false,
            }
          );
          this.dialog.current?.success(e.message);
          // const query = this.props.query.query as QueryClient;
          return;
        }
        this.dialog.current?.error(e.message);
      })
      .finally(() => {
        this.setState({ ...this.state, isSubmitting: false });
      });
  }

  FormRender = () => {
    return (
      <>
        <form onSubmit={this.handlerSubmit} className="flex flex-col gap-4">
          <Heading
            handlerChange={(key, value) => this.handlerChange(key, value)}
            data={this.state}
            edit={this.props?.edit}
          />
          <General
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenProject={() => this.handlerOpenProject()}
            data={this.state}
          />
          <ContactPerson
            handlerRemoveItem={this.handlerDeleteItem}
            handlerUpdate={(value) => {
              const contacts = [...this.state.contactEmployees];
              const index = contacts.findIndex((e) => e.id === value.id);
              contacts[index] = value;

              this.setState({
                ...this.state,
                isOpenContactPerson: false,
                contactEmployees: contacts,
              });
            }}
            handlerChangeItem={this.handlerChangeItems}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenContactPerson={() => {
              this.handlerOpenContactPerson();
            }}
            data={this.state}
            open={false}
            onClose={function (): void {}}
            onOk={function (person: any): void {}}
          />
          <Address
            handlerUpdate={(value) => {
              const contacts = [...this.state.bPAddresses];
              const index = contacts.findIndex((e) => e.id === value.id);
              contacts[index] = value;

              this.setState({
                ...this.state,
                isOpenContactPerson: false,
                bPAddresses: contacts,
              });
            }}
            handlerRemoveItems={this.handlerDeleteItems}
            handlerChangeItems={this.handlerChangeItemss}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenAddress={() => {
              this.handlerOpenAddress();
            }}
            data={this.state}
            open={false}
            onClose={function (): void {}}
            onOk={function (person: any): void {}}
          />
          <PaymentTerm
            handlerChange={(key, value) => this.handlerChange(key, value)}
            data={this.state}
          />
          <PaymentRun
            handlerChange={(key, value) => this.handlerChange(key, value)}
            data={this.state}
          />
          <Accounting
            handlerChange={(key, value) => this.handlerChange(key, value)}
            data={this.state}
            handlerOpenAccount={() => this.handlerOpenAccount()}
         
            handlerOpenVendor2={() => {
              this.handlerOpenVendor("supplier");
            }}
            handlerOpenVendor={() => {
              this.handlerOpenVendor("customer");
            }}
          />
          <Remark
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <div className="sticky w-full bottom-4  mt-2">
            <div className="backdrop-blur-sm bg-slate-700 p-2 rounded-lg shadow z-[1000] flex justify-between gap-3 border">
              <div className="flex ">
                <LoadingButton
                  size="small"
                  sx={{ height: "25px" }}
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1">Copy To</span>
                </LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1">Save & New</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
}

export default withRouter(BusinessPartners);

// import { LoadingButton } from "@mui/lab";
// import React from "react";
// import Remark from "../components/Remarks";
// import Accounting from "../components/Accounting";
// import PaymentRun from "../components/PaymentRun";
// import PaymentTerms from "../components/PaymentTerm";
// import Address from "../components/Address";
// import General from "../components/General";
// import Heading from "../components/Heading";
// import BussinessPartnersRepository from "@/services/actions/bussinessPartnerRepositorys";
// import BusinessPatners from "@/models/BusinessPartner";
// import { UpdateDataSuccess } from "@/utilies/ClientError";
// import FormMessageModal from "@/components/modal/FormMessageModal";
// import { VendorModalType } from "@/components/modal/VendorModal";
// import ContactPersonModal from "../components/ContactPersonModal";
// import BusinessPartner from "@/models/BusinessParter";
// import ContactPerson from "../components/ContactPersons";
// import { withRouter } from "@/routes/withRouter";

// class BusinessPartnerForm extends React.Component<any, any> {

//   constructor(props: any) {
//     super(props);
//     this.state = {
//       ...this.state,
//       isOpenContactPerson: false,
//       contactpersons: [],

//     } as any;
//     console.log(this.props);

//     this.handlerConfirmContactPerson = this.handlerConfirmContactPerson.bind(this);
//     // this.handlerOpenContactPerson = this.handlerOpenContactPerson.bind(this);
//     this.handlerSubmit = this.handlerSubmit.bind(this);
//   }
//   componentDidMount(): void {

//     if (!this.props?.edit) {
//         setTimeout(() => this.setState({ ...this.state, loading: false, }), 500)
//     }

//     if (this.props.edit) {
//         if (this.props.location.state) {
//             const routeState = this.props.location.state;

//             setTimeout(() => this.setState({ ...this.props.location.state, isApproved: routeState?.status === 'A' || routeState?.status === 'T', loading: false, }), 500)
//         } else {
//             new BussinessPartnersRepository().find(this.props.match.params.id).then((res: any) => {
//                 this.setState({ ...res, loading: false, isApproved: res?.status === 'A' || res?.status === 'T', });
//             }).catch((e: Error) => {
//                 this.setState({ message: e.message });
//             })
//         }
//     }
// }

//   dialog = React.createRef<FormMessageModal>();
//   protected handlerChange(key: string, value: any) {
//     let temps: any = { ...this.state };
//     temps[key] = value;
//   }
//   protected handlerOpenVendor(type: VendorModalType) {
//     this.setState({ ...this.state, isOpenVendor: true, vendorType: type });
//   }
//   protected handlerOpenAccount() {
//     this.setState({ ...this.state, isOpenAccount: true });
//   }
//   protected handlerOpenItem() {
//     this.setState({ ...this.state, isOpenItem: true });
//   }
//   protected handlerConfirmContactPerson(record: BusinessPatners) {
//     this.setState({
//         ...this.state,
//         isOpenContactPerson: false,
//         cardCode: record.cardCode,

//     });
// }
//   handlerRemoveItem(code: string) {
//     let items = [...(this.state.items ?? [])];
//     const index = items.findIndex((e: any) => e?.CardCode === code);
//     items.splice(index, 1);
//     this.setState({ ...this.state, items: items });
//   }
//   handlerItemChange({ value, record, field }: any) {
//     let items = [...(this.state.items ?? [])];
//     let item = this.state.items?.find(
//       (e: any) => e?.itemCode === record?.itemCode
//     );

//     const index = items.findIndex((e: any) => e?.CardCode === record.cardCode);
//     if (index > 0) items[index] = item;
//     this.setState({ ...this.state, items: items });
//   }

//   async handlerSubmit(event: any) {
//     event.preventDefault();

//     this.setState({ ...this.state, isSubmitting: true });
//     const { id } = this.props?.match?.params

//     await new BussinessPartnersRepository().post(this.state, this.props?.edit, id).then((res: any) => {
//         const purchaseAgreement = new BusinessPatners(res?.data)

//         this.props.history.replace(this.props.location.pathname?.replace('create', purchaseAgreement.id), purchaseAgreement);
//         this.dialog.current?.success("Create Successfully.");
//     }).catch((e: any) => {
//         if (e instanceof UpdateDataSuccess) {
//             this.props.history.replace(this.props.location.pathname?.replace('/edit', ''), { ...this.state, isSubmitting: false,});
//             this.dialog.current?.success(e.message);
//             // const query = this.props.query.query as QueryClient;
//             return;
//         }
//         this.dialog.current?.error(e.message);
//     }).finally(() => {
//         this.setState({ ...this.state, isSubmitting: false })
//     });
// }
//   render() {
//     return (
//       <>
//         <form onSubmit={this.handlerSubmit} className="flex flex-col gap-4">
//           <Heading
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//             edit={this.props?.edit}
//           />
//           <General
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//           />
// <ContactPerson
//   handlerChange={(key, value) => this.handlerChange(key, value)}
//   open={this.state.isOpenContactPerson}
//   onClose={() => {}}
//   handlerAddItem={() => this.handlerOpenItem()}
//   handlerRemoveItem={this.handlerRemoveItem}
//   handlerChangeItem={this.handlerItemChange}
//   // handlerOpenContactperson={this.handlerOpenContactPerson}
//   onOk={(person: any) => {
//        this.setState({ contactpersons: [...this.state.contactpersons, person] });
//        console.log(person);

//      }}
//   data={this.state}

// />

//           {/* <ContactPersonModal
//             open={true}
//             onClose={() => {}}
//             onOk={(person: any) => {
//               this.setState({ contactpersons: [...this.state.contactpersons, person] });
//             }}
//           /> */}
//           <Address
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//           />
//           <PaymentTerms
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//           />
//           <PaymentRun
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//           />
//           <Accounting
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//             data={this.state}
//             handlerOpenAccount={() => this.handlerOpenAccount()}
//             handlerOpenVendor={() => {
//               this.handlerOpenVendor("customer");
//             }}
//             handlerOpenVendor2={() => {
//               this.handlerOpenVendor("supplier");
//             }}
//           />
//           <Remark
//             data={this.state}
//             handlerChange={(key, value) => this.handlerChange(key, value)}
//           />
//           <div className="sticky w-full bottom-4  mt-2">
//             <div className="backdrop-blur-sm bg-slate-700 p-2 rounded-lg shadow z-[1000] flex justify-between gap-3 border">
//               <div className="flex ">
//                 <LoadingButton
//                   size="small"
//                   sx={{ height: "25px" }}
//                   variant="contained"
//                   disableElevation
//                 >
//                   <span className="px-3 text-[11px] py-1">Copy To</span>
//                 </LoadingButton>
//               </div>
//               <div className="flex items-center">
//                 <LoadingButton
//                   type="submit"
//                   sx={{ height: "25px" }}
//                   className="bg-white"
//                   loading={false}
//                   size="small"
//                   variant="contained"
//                   disableElevation
//                 >
//                   <span className="px-3 text-[11px] py-1">Save & New</span>
//                 </LoadingButton>
//               </div>
//             </div>
//           </div>
//         </form>
//       </>
//     );
//   }
// }

// export default withRouter (BusinessPartnerForm);
