import { withRouter } from "@/routes/withRouter";
import React, { Component, useEffect } from "react";
import Taps from "@/components/button/Taps";
import Modal from "@/components/modal/Modal";
import { CircularProgress } from "@mui/material";
import EmployeeRepository from "@/services/actions/employeeRepository";
import Employees from "@/models/Employee";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import { dateFormat } from "../../../../utilies/index";
import BuyerRepository from "@/services/actions/BuyerRepository";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchRepository from "@/services/actions/branchRepository";
import UsersRepository from "@/services/actions/usersRepository";
import CountryRepository from "@/services/actions/countryReporitory";
import TerminationReasonRepository from "@/services/actions/terminationReason";
import StatusRepository from "@/services/actions/statusRepository";
import PositionRepository from "@/services/actions/positionRepository";
import OwnerRepository from "@/services/actions/ownerRepository";
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository";

class EmployeeDetail extends Component<any, any> {
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
    const data = this.props.location.state as Employees;
    console.log(data);

    if (data) {
      setTimeout(() => {
        let employee = data;
        employee as Employees;
        if ("") {
        } else {
          this.setState({ ...employee, loading: false });
        }
      }, 500);
    } else {
      new EmployeeRepository()
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
          onClose={() => {}}
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
                  <span className="w-4/12 text-gray-500">First Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.firstName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Middle Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.lastName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Last Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.lastName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Job Title</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.jobTitle}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Position</span>
                  <span className="w-8/12 font-medium">
                  : {new PositionRepository().find(this.state.position)?.name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Department</span>
                  <span className="w-8/12 font-medium">
                  : {new DepartmentRepository().find(this.state.department)?.Name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Branch</span>
                  <span className="w-8/12 font-medium">
                  : {new BranchRepository().find(this.state.branch)?.Name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Manager</span>
                  <span className="w-8/12 font-medium">
                  : {new OwnerRepository().find(this.state.manager)?.name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">User Code</span>
                  <span className="w-8/12 font-medium">
                  : {new UsersRepository().find(this.state.applicationUserID)?.name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Sales Employee</span>
                  <span className="w-8/12 font-medium">
                  : {new BuyerRepository().find(this.state.salesPersonCode)?.name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Cost Center</span>
                  <span className="w-8/12 font-medium">
                  : {new DistributionRuleRepository().find(this.state.costCenterCode)?.FactorDescription ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">License</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.u_DRIVERLICN || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Employee Code</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.employeeCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Ext.Employee No.</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.externalEmployeeNumber}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Office Phone</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.officePhone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Ext.</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.officeExtension ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Mobile Phone</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.mobilePhone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Pager</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.pager}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Home Phone</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.homePhone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Fax</span>
                  <span className="w-8/12 font-medium">: {this.state.fax}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Email</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.eMail}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Linked Vendor</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.linkedVendor || "N/A"}
                  </span>
                </div>
               
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">License Expired</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.u_DRIVERLICEXD) || "N/A"}
                  </span>
                </div>
               
              </div>
            </div>
            <div className="grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white">
              <Taps
                items={[
                  "Address",
                  "Admistrator",
                  "Personal",
                  "Finance",
                  "Remarks",
                ]}
              >
                <Address data={this.state} />
                <Administration data={this.state} />
                <Personal data={this.state} />
                <Finance data={this.state} />
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

export default withRouter(EmployeeDetail);

function Address(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Street</span>
            <span className="col-span-2 font-medium">
              : {data.workStreet ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Street Number</span>
            <span className="col-span-2 font-medium">
              : {data.workStreetNumber ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Block</span>
            <span className="col-span-2 font-medium">
              : {data.workBlock ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Building/Floor/Room</span>
            <span className="col-span-2 font-medium">
              : {data.workBuildingFloorRoom ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Zip Code</span>
            <span className="col-span-2 font-medium">
              : {data.workZipCode ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">City</span>
            <span className="col-span-2 font-medium">
              : {data.workCity ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Country</span>
            <span className="col-span-2 font-medium">
              : {data.workCounty ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">State</span>
            <span className="col-span-2 font-medium">
              : {data.workStateCode ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Country/Region</span>
            <span className="col-span-2 font-medium">
            : {new CountryRepository().find(data.workCountryCode)?.Name ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Street</span>
            <span className="col-span-2 font-medium">
              : {data.homeStreet ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Street Number</span>
            <span className="col-span-2 font-medium">
              : {data.homeStreetNumber ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Block</span>
            <span className="col-span-2 font-medium">
              : {data.homeBlock ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Building/Floor/Room</span>
            <span className="col-span-2 font-medium">
              : {data.homeBuildingFloorRoom ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Zip Code</span>
            <span className="col-span-2 font-medium">
              : {data.homeZipCode ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">City</span>
            <span className="col-span-2 font-medium">
              : {data.homeCity ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Country</span>
            <span className="col-span-2 font-medium">
              : {data.homeCounty ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">State</span>
            <span className="col-span-2 font-medium">
              : {data.homeState ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Country/Region</span>
            <span className="col-span-2 font-medium">
            : {new CountryRepository().find(data.homeCountry)?.Name ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Administration(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">StartDate</span>
            <span className="col-span-2 font-medium">
              : {dateFormat(data.startDate)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Termination Date</span>
            <span className="col-span-2 font-medium">
              : {dateFormat(data.terminationDate)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Status</span>
            <span className="col-span-2 font-medium">
            : {new StatusRepository().find(data.statusCode)?.name ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Termination Reaon</span>
            <span className="col-span-2 font-medium">
            : {new TerminationReasonRepository().find(data.treminationReason)?.name ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Personal(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Gender</span>
            <span className="col-span-2 font-medium">
              : {(data.gender ?? "N/A")?.split("gt_")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Date of Birth</span>
            <span className="col-span-2 font-medium">
              : {dateFormat(data.dateOfBirth)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Country/Region Of Bir</span>
            <span className="col-span-2 font-medium">
            : {new CountryRepository().find(data.countryOfBirth)?.Name ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Marital Status</span>
            <span className="col-span-2 font-medium">
              : {(data.martialStatus ?? "N/A")?.split("mts_")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">No. of Children</span>
            <span className="col-span-2 font-medium">
              : {data.numOfChildren ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">ID No.</span>
            <span className="col-span-2 font-medium">
              : {data.idNumber ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Citizenship</span>
            <span className="col-span-2 font-medium">
            : {new CountryRepository().find(data.citizenshipCountryCode)?.Name ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Passport No.</span>
            <span className="col-span-2 font-medium">
              : {data.passportNumber ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Passport Expiration Date</span>
            <span className="col-span-2 font-medium">
              : {dateFormat(data.passportExpirationDate)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Passport Issue Date</span>
            <span className="col-span-2 font-medium">
              : {dateFormat(data.passportIssueDate)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Passport Issuer:</span>
            <span className="col-span-2 font-medium">
              : {data.passportIssuer ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Finance(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Salary</span>
            <span className="col-span-2 font-medium">
              : {data.salary ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Salary Unit</span>
            <span className="col-span-2 font-medium">
              : {(data.salaryUnit ?? "N/A")?.split("scu_")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Employee Costs</span>
            <span className="col-span-2 font-medium">
              : {data.employeeCosts ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Employee Costs Unit</span>
            <span className="col-span-2 font-medium">
              : {(data.employeeCostUnit ?? "N/A")?.split("scu_")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Bank</span>
            <span className="col-span-2 font-medium">
              : {data.bankCode ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Account NO.</span>
            <span className="col-span-2 font-medium">
              : {data.bankAccount ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Branch</span>
            <span className="col-span-2 font-medium">
              : {data.bankBranch ?? "N/A"}
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
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Remarks</span>
            <span className="col-span-2 font-medium">
              : {data.remarks ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
