import { dateFormat } from '../utilies';
import { ContactEmployee } from './BusinessParter';
import Model from './Model';
import { MasterDocument, DocumentLine } from './interface/index';
import moment from 'moment';

export interface EmployeeProps {
    id: any;
    employeeID?: number;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    jobTitle?: string;
    department?: string;
    branch?: number;
    manager?: string;
    applicationUserID?: number;
    salesPersonCode?: string;
    costCenterCode?: string;
    employeeCode?: number;
    externalEmployeeNumber?: number;
    officePhone?: number;
    position?: string;
    officeExtension?: string;
    mobilePhone?: number;
    homePhone?: number;
    fax?: string;
    eMail?:string;
    linkedVendor?:string;
    workStreet?: string;
    workStreetNumber?: number;
    workBuildingFloorRoom?: string
    workCity?: string;
    workCountryCode?: string;
    workStateCode?: number;
    workBlock?: number;
    workZipCode?: number;
    homeStreet?: string;
    homeStreetNumber?: number;
    homeBuildingFloorRoom?: string;
    homeCity?: string;
    homeCounty?: string;
    homeState?: number;
    homeCountry?: string;
    homeBlock?: number;
    homeZipCode?: number;
    startDate?: number;
    terminationDate?: number;
    statusCode?: number;
    treminationReason?: string;
    gender?: string;
    dateOfBirth?: number
    countryOfBirth?: string;
    martialStatus?: string;
    numOfChildren?: number;
    idNumber?: number;
    citizenshipCountryCode?: string;
    passportNumber?: number;
    passportExpirationDate?: string;
    passportIssueDate?: string;
    passportIssuer?: string
    salary?: number;
    salaryUnit?: number;
    employeeCosts?: string;
    employeeCostUnit?: string;
    bankCode?: number;
    bankAccount?:number;
    bankBranch?: string;
    remarks?: string;
    pager?: string;
    workCounty?: string;
}


export default class Employees extends Model {
    id: any;
    employeeID?: number;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    jobTitle?: string;
    department?: string;
    branch?: number;
    manager?: string;
    applicationUserID?: number;
    salesPersonCode?: string;
    costCenterCode?: string;
    employeeCode?: number;
    externalEmployeeNumber?: number;
    officePhone?: number;
    position?: string;
    officeExtension?: string;
    mobilePhone?: number;
    homePhone?: number;
    fax?: string;
    eMail?:string;
    linkedVendor?:string;
    workStreet?: string;
    workStreetNumber?: number;
    workBuildingFloorRoom?: string
    workCity?: string;
    workCountryCode?: string;
    workStateCode?: number;
    workCountry?: number
    workBlock?: number;
    workZipCode?: number;
    homeStreet?: string;
    homeStreetNumber?: number;
    homeBuildingFloorRoom?: string;
    homeCity?: string;
    homeCounty?: string;
    homeState?: number;
    homeCountry?: string;
    homeBlock?: number;
    homeZipCode?: number;
    startDate?: number;
    terminationDate?: number;
    statusCode?: number;
    treminationReason?: string;
    gender?: string;
    dateOfBirth?: number
    countryOfBirth?: string;
    martialStatus?: string;
    numOfChildren?: number;
    idNumber?: number;
    citizenshipCountryCode?: string;
    passportNumber?: number;
    passportExpirationDate?: string;
    passportIssueDate?: string;
    passportIssuer?: string
    salary?: number;
    salaryUnit?: number;
    employeeCosts?: string;
    employeeCostUnit?: string;
    bankCode?: number;
    bankAccount?:number;
    bankBranch?: string;
    remarks?: string;
    pager?: string;
    workCounty?: string;

    constructor(json: any) {
        super();
        this.id = json['EmployeeID'];
        this.employeeID = json['EmployeeID'];
        this.firstName = json['FirstName'];
        this.lastName = json['LastName'];
        this.middleName = json['MiddleName'];
        this.jobTitle = json['JobTitle'];
        this.department = json['Department'];
        this.branch = json['Branch'];
        this.manager = json['Manager'];
        this.applicationUserID = json['ApplicationUserID'];
        this.salesPersonCode = json['SalesPersonCode'];
        this.costCenterCode = json['CostCenterCode'];
        this.employeeCode = json['EmployeeCode'];
        this.externalEmployeeNumber = json['ExternalEmployeeNumber'];
        this.officePhone = json['OfficePhone'];
        this.position = json['Position'];
        this.officeExtension = json['OfficeExtension'];
        this.mobilePhone = json['MobilePhone'];
        this.homePhone = json['HomePhone'];
        this.fax = json['Fax'];
        this.eMail = json['eMail'];
        this.linkedVendor = json['LinkedVendor'];
        this.workStreet = json['WorkStreet'];
        this.workStreetNumber = json['WorkStreetNumber'];
        this.workBuildingFloorRoom = json['WorkBuildingFloorRoom'];
        this.workCity = json['WorkCity'];
        this.workCountryCode = json['WorkCountryCode'];
        this.workCountry = json['WorkCountry'];
        this.workStateCode = json['WorkStateCode'];
        this.workBlock = json['WorkBlock'];
        this.workZipCode = json['WorkZipCode'];
        this.homeStreet = json['HomeStreet'];
        this.homeStreetNumber = json['HomeStreetNumber'];
        this.homeBuildingFloorRoom = json['HomeBuildingFloorRoom'];
        this.homeCity = json['HomeCity'];
        this.homeCounty = json['HomeCounty'];
        this.homeState = json['HomeState'];
        this.homeCountry = json['HomeCountry'];
        this.homeBlock = json['HomeBlock'];
        this.homeZipCode = json['HomeZipCode'];
        this.startDate = json['StartDate'];
        this.terminationDate = json['TerminationDate'];
        this.statusCode = json['StatusCode'];
        this.treminationReason = json['TreminationReason'];
        this.gender = json['Gender'];
        this.dateOfBirth = json['DateOfBirth'];
        this.countryOfBirth = json['CountryOfBirth'];
        this.martialStatus = json['MartialStatus'];
        this.numOfChildren = json['NumOfChildren'];
        this.idNumber = json['IdNumber'];
        this.citizenshipCountryCode = json['CitizenshipCountryCode'];
        this.passportNumber = json['PassportNumber'];
        this.passportExpirationDate = json['PassportExpirationDate'];
        this.passportIssueDate = json['PassportIssueDate'];
        this.passportIssuer = json['PassportIssuer'];
        this.salary = json['Salary'];
        this.salaryUnit = json['SalaryUnit'];
        this.employeeCosts = json['EmployeeCosts'];
        this.employeeCostUnit = json['EmployeeCostUnit'];
        this.bankCode = json['BankCode'];
        this.bankAccount = json['BankAccount'];
        this.bankBranch = json['BankBranch'];
        this.remarks = json['Remarks'];
        this.pager = json['Pager'];
        this.workCounty = json['WorkCounty'];


    }
    toJson(update: boolean) {
        throw new Error('Method not implemented.');
    }

    public static toCreate(json: any) {
        console.log(json)

        return {
            "EmployeeID": json['employeeID'],
            "FirstName": json['firstName'],
            "LastName": json['lastName'],
            "MiddleName": json['middleName'],
            "JobTitle": json['jobTitle'],
            "Department": json['department'],
            "Branch": json['branch'],
            "Manager": json['manager'],
            "ApplicationUserID": json['applicationUserID'],
            "SalesPersonCode": json['salesPersonCode'],
            "EmployeeCode": json['employeeCode'],
            "ExternalEmployeeNumber": json['externalEmployeeNumber'],
            "OfficePhone": json['officePhone'],
            "Position": json['position'],
            "OfficeExtension": json['officeExtension'],
            "MobilePhone": json['mobilePhone'],
            "HomePhone": json['homePhone'],
            "Fax": json['fax'],
            "eMail": json['eMail'],
            "inkedVendor": json['linkedVendor'],
            "WorkStreet": json['workStreet'],
            "WorkStreetNumber": json['workStreetNumber'],
            "WorkBuildingFloorRoom": json['workBuildingFloorRoom'],
            "WorkCity": json['workCity'],
            "WorkCountryCode": json['workCountryCode'],
            "WorkCountry": json['workCountry'],
            "WorkStateCode": json['workStateCode'],
            "WorkBlock": json['workBlock'],
            "WorkZipCode": json['workZipCode'],
            "HomeStreet": json['homeStreet'],
            "HomeStreetNumber": json['homeStreetNumber'],
            "HomeBuildingFloorRoom": json['homeBuildingFloorRoom'],
            "HomeCity": json['homeCity'],
            "HomeCounty": json['homeCounty'],
            "HomeCountry": json['homeCountry'],
            "HomeState": json['homeState'],
            "HomeBlock": json['homeBlock'],
            "HomeZipCode": json['homeZipCode'],
            "StartDate": json['startDate'],
            "TerminationDate": json['terminationDate'],
            "StatusCode": json['statusCode'],
            "TreminationReason": json['treminationReason'],
            "Gender": json['gender'],
            "DateOfBirth": json['dateOfBirth'],
            "CountryOfBirth": json['countryOfBirth'],
            "MartialStatus": json['martialStatus'],
            "NumOfChildren": json['numOfChildren'],
            "IdNumber": json['idNumber'],
            "CitizenshipCountryCode": json['citizenshipCountryCode'],
            "PassportNumber": json['passportNumber'],
            "PassportExpirationDate": json['passportExpirationDate'],
            "PassportIssueDate": json['passportIssueDate'],
            "PassportIssuer": json['passportIssuer'],
            "Salary": json['salary'],
            "SalaryUnit": json['salaryUnit'],
            "EmployeeCosts": json['employeeCosts'],
            "EmployeeCostUnit": json['employeeCostUnit'],
            "CostCenterCode": json['costCenterCode'],
            "BankCode": json['bankCode'],
            "BankAccount": json['bankAccount'],
            "BankBranch": json['bankBranch'],
            "Remarks": json['remarks'],
            "Pager": json['pager'],
            "WorkCounty": json['workCounty'],


        };
    }


    public static toUpdate(json: any) {
        return {
            "EmployeeID": json['employeeID'],
            "FirstName": json['firstName'],
            "LastName": json['lastName'],
            "MiddleName": json['middleName'],
            "JobTitle": json['jobTitle'],
            "Department": json['department'],
            "Branch": json['branch'],
            "Manager": json['manager'],
            "ApplicationUserID": json['applicationUserID'],
            "SalesPersonCode": json['salesPersonCode'],
            "EmployeeCode": json['employeeCode'],
            "ExternalEmployeeNumber": json['externalEmployeeNumber'],
            "OfficePhone": json['officePhone'],
            "Position": json['position'],
            "OfficeExtension": json['officeExtension'],
            "MobilePhone": json['mobilePhone'],
            "HomePhone": json['homePhone'],
            "Fax": json['fax'],
            "eMail": json['eMail'],
            "linkedVendor": json['LinkedVendor'],
            "WorkStreet": json['workStreet'],
            "WorkStreetNumber": json['workStreetNumber'],
            "CostCenterCode": json['costCenterCode'],
            "WorkCity": json['workCity'],
            "WorkCountryCode": json['workCountryCode'],
            "WorkCountry": json['workCountry'],
            "WorkStateCode": json['workStateCode'],
            "WorkBlock": json['workBlock'],
            "WorkZipCode": json['workZipCode'],
            "HomeStreet": json['homeStreet'],
            "HomeStreetNumber": json['homeStreetNumber'],
            "HomeBuildingFloorRoom": json['homeBuildingFloorRoom'],
            "HomeCity": json['homeCity'],
            "HomeCounty": json['homeCounty'],
            "HomeCountry": json['homeCountry'],
            "HomeState": json['homeState'],
            "HomeBlock": json['homeBlock'],
            "HomeZipCode": json['homeZipCode'],
            "StartDate": json['startDate'],
            "TerminationDate": json['terminationDate'],
            "StatusCode": json['statusCode'],
            "TreminationReason": json['treminationReason'],
            "Gender": json['gender'],
            "DateOfBirth": json['dateOfBirth'],
            "CountryOfBirth": json['countryOfBirth'],
            "MartialStatus": json['martialStatus'],
            "NumOfChildren": json['numOfChildren'],
            "IdNumber": json['idNumber'],
            "CitizenshipCountryCode": json['citizenshipCountryCode'],
            "PassportNumber": json['passportNumber'],
            "PassportExpirationDate": json['passportExpirationDate'],
            "PassportIssueDate": json['passportIssueDate'],
            "PassportIssuer": json['passportIssuer'],
            "Salary": json['salary'],
            "SalaryUnit": json['salaryUnit'],
            "EmployeeCosts": json['employeeCosts'],
            "EmployeeCostUnit": json['employeeCostUnit'],
            "BankCode": json['bankCode'],
            "BankAccount": json['bankAccount'],
            "BankBranch": json['bankBranch'],
            "Remarks": json['remarks'],
            "Pager": json['pager'],
            "WorkCounty": json['workCounty'],

        };
    }


}
