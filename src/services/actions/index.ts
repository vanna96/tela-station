import request from '@/utilies/request';
import Owner from "@/models/Owner";
import Encryption from "@/utilies/encryption";

export default class InitializeData {

    constructor() {
    }

    public static async shippingType(): Promise<any[]> {

        const response: any = await request('GET', '/ShippingTypes?$select=Code,Name&$orderby=Name asc');
        if (!response?.data) return [];

        const enc = Encryption.encrypt('shipping_types', response.data.value);
        localStorage.setItem('shipping_types', enc);
        const dec = Encryption.decrypt('shipping_types', enc)

        return response.data.value;
    }

    public static async unitOfMeasurement(): Promise<any> {
        const response: any = await request('GET', '/UnitOfMeasurementGroups?$select=AbsEntry,Code,Name,BaseUoM');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async paymentTermType(): Promise<any[]> {
        const response: any = await request('GET', '/PaymentTermsTypes?$select=GroupNumber,PaymentTermsGroupName');

        if (!response?.data) throw new Error("No data");

        return response.data.value;
    }

    public static async vatGroups(): Promise<any> {
        const response: any = await request('GET', '/VatGroups');

        if (!response?.data) return [];
        return response.data.value;
    }

    public static async branches(): Promise<any> {
        const response: any = await request('GET', '/Branches');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async department(): Promise<any> {
        const response: any = await request('GET', '/Departments');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async warehouse(): Promise<any> {
        const response: any = await request('GET', '/Warehouses?$select=WarehouseCode,WarehouseName');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async owner(): Promise<Owner[]> {
        const response: any = await request('GET', '/EmployeesInfo?$filter=ApplicationUserID ne null&$select=EmployeeID,FirstName,LastName');

        if (!response?.data) return [];

        return response.data.value?.map((e: any) => new Owner(e).toJson());
    }

    public static async factoringIndicator(): Promise<any> {
        const response: any = await request('GET', '/FactoringIndicators');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async listOfAccounts(): Promise<any[]> {
        const response: any = await request('GET', '/ChartOfAccounts?$select=Code,Name');

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async listOfProjects(): Promise<any[]> {
        const response: any = await request('GET', "/Projects?$filter=Active eq 'tYES' ");

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async listPaymentMethod(): Promise<any[]> {
        const response: any = await request('GET', "/WizardPaymentMethods?$select=Type, PaymentMethodCode,Description");

        if (!response?.data) return [];

        return response.data.value;
    }

    public static async listItemGroup(): Promise<[]> {
        const response: any = await request('GET', '/ItemGroups?$select=GroupName,Number,ItemGroupsWarehouseInfos');

        if (!response?.data) return [];

        return response.data.value as [];
    }


    public static async listDistribution(): Promise<[]> {
        const response: any = await request('GET', '/DistributionRules?$select=FactorCode,FactorDescription,InWhichDimension,TotalFactor');

        if (!response?.data) return [];

        return response.data.value as [];
    }

    public static async users(): Promise<any[]> {
        const response: any = await request('GET', '/Users?$select=UserCode,UserName,eMail,Branch,Department');

        if (!response?.data) return [];

        return response.data.value;
    }
    public static async indicator(): Promise<any[]> {
        const response: any = await request('GET', '/FactoringIndicators');

        if (!response?.data) return [];

        return response.data.value;
    }
}