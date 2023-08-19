import React, { FC, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import BussinessPartnersRepository from "@/services/actions/bussinessPartnerRepositorys";
import MUISelect from "@/components/selectbox/MUISelect";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import CountrySelect from "@/components/selectbox/Country";
import EmailGroupSelect from "@/components/selectbox/EmailGroup";
import { Button } from "@mui/material";
import Modal from "@/components/modal/Modal";


interface ContactPersonModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (contactperson: any [] ) => void,
  data?: any,
}

const ContactPersonModal: FC<ContactPersonModalProps> = ({
  open,
  onClose,
  onOk,
  data,
}:ContactPersonModalProps) => {

  const [contactPerson, setContactPerson] = useState<any>({})


  const handlerConfirm = () => {
    onOk(contactPerson);
   
    
  };

  const handlerChange = (key:any, value:any) => {
      let contact = contactPerson;
      contact[key] = value;handlerConfirm
      setContactPerson(contact);
      console.log(contact);
      
  }

  useEffect(() => {
    if (data !== null) {
      setContactPerson(data ?? {});
    }
  }, [data]);


  return (
    <Modal
      open={open}
      onOk={handlerConfirm}
      onClose={onClose}
      widthClass="w-[50%]"
      title="ContactEmployees"
      disableTitle={true}
      disableFooter={true}
    >
      <div className="grid grid-cols-2 gap-3">
        <MUITextField
          label="Contact ID"
          defaultValue={data?.name}
          name="Name"
          onChange={(e: any) => handlerChange("name", e.target.value)}
        />
        <MUITextField
          label="First Name"
          defaultValue={data?.firstName}
          name="FirstName"
          onChange={(e: any) => handlerChange("firstName", e.target.value)}
        />
        <MUITextField
          label="Middle Name"
          defaultValue={data?.middleName}
          name="MiddleName"
          onChange={(e: any) => handlerChange("middleName", e.target.value)}
        />
        <MUITextField
          label="Last Name"
          defaultValue={data?.lastName}
          name="LastName"
          onChange={(e: any) => handlerChange("lastName", e.target.value)}
        />
        <MUITextField
          label="Title"
          defaultValue={data?.title}
          name="Title"
          onChange={(e: any) => handlerChange("title", e.target.value)}
        />
        <MUITextField
          label="Position"
          defaultValue={data?.position}
          name="Position"
          onChange={(e: any) => handlerChange("position", e.target.value)}
        />
        <MUITextField
          label="Address"
          defaultValue={data?.address}
          name="Address"
          onChange={(e: any) => handlerChange("address", e.target.value)}
        />
        <MUITextField
          label="TelePhone 1"
          defaultValue={data?.phone1}
          name="Phone1"
          onChange={(e: any) => handlerChange("phone1", e.target.value)}
        />
        <MUITextField
          label="TelePhone 2"
          defaultValue={data?.phone2}
          name="Phone2"
          onChange={(e: any) => handlerChange("phone2", e.target.value)}
        />
        <MUITextField
          label="Mobile Phone"
          defaultValue={data?.mobilePhone}
          name="MobilePhone"
          onChange={(e: any) => handlerChange("mobilePhone", e.target.value)}
        />
        <MUITextField
          label="Fax"
          defaultValue={data?.fax}
          name="Fax"
          onChange={(e: any) => handlerChange("fax", e.target.value)}
        />
        <MUITextField
          label="E-Mail"
          defaultValue={data?.e_Mail}
          name="E_Mail"
          onChange={(e: any) => handlerChange("e_Mail", e.target.value)}
        />
        <div>
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            E-Mail Group
          </label>
          <EmailGroupSelect
            name="EmailGroupCode"
            defaultValue={data?.emailGroupCode}
            onChange={(e) => handlerChange("emailGroupCode", e.target.value)}
          />
        </div>
        <MUITextField
          label="Pager"
          defaultValue={data?.pager}
          name="Pager"
          onChange={(e: any) => handlerChange("pager", e.target.value)}
        />
        <MUITextField
          label="Remark1"
          defaultValue={data?.remarks1}
          name="Remarks1"
          onChange={(e: any) => handlerChange("remarks1", e.target.value)}
        />
        <MUITextField
          label="Remark2"
          defaultValue={data?.remarks2}
          name="Remarks2"
          onChange={(e: any) => handlerChange("remarks2", e.target.value)}
        />
        <MUITextField
          label="Password"
          defaultValue={data?.password}
          name="Password"
          onChange={(e: any) => handlerChange("password", e.target.value)}
        />
        <div>
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Country/Region Of Birth
          </label>
          <CountrySelect
            defaultValue={data?.placeOfBirth}
            name="PlaceOfBirth"
            onChange={(e: any) => handlerChange("placeOfBirth", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Date Of Birth
          </label>
          <div className="">
            <MUIDatePicker
              error={data?.message?.includes("DateOfBirth")}
              value={data?.dateOfBirth}
              onChange={(e: any) => handlerChange("dateOfBirth", e)}
            />
          </div>
        </div>
        <div>
          <label className="text-gray-500 text-[14px]">Gender</label>
          <MUISelect
            items={[
              { name: "Female", value: "F" },
              { name: "Male", value: "gt_Male" },
            ]}
            aliaslabel="name"
            aliasvalue="value"
            name="Gender"
            defaultValue={data?.gender}
            onChange={(e) => handlerChange("gender", e.target.value)}
          />
        </div>
        <MUITextField
          label="Profession"
          defaultValue={data?.profession}
          name="Profession"
          onChange={(e: any) => handlerChange("profession", e.target.value)}
        />
        <MUITextField
          label="City Of Birth"
          defaultValue={data?.cityOfBirth}
          name="CityOfBirth"
          onChange={(e: any) => handlerChange("cityOfBirth", e.target.value)}
        />
        <MUITextField
          label="Connected Address"
          defaultValue={data?.connectedAddressName}
          name="ConnectedAddressName"
          onChange={(e: any) =>
            handlerChange("connectedAddressName", e.target.value)
          }
        />
        <div className="text-right mt-5">
          <Button variant="contained" type="button" onClick={handlerConfirm}>Ok</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactPersonModal;
