import React, { FC, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import BussinessPartnersRepository from "@/services/actions/bussinessPartnerRepositorys";
import { Button } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import Modal from "@/components/modal/Modal";
type AdddressType = 'shipTO' | 'payTo' ;


interface addressModalProps {
  open: boolean;
  data?: any;
  onClose: () => void;
  onOk: (address: any[]) => void;
  type: AdddressType;
}

const AddressModal: FC<addressModalProps> = ({ open, onClose, onOk, type, data }: addressModalProps) => {
  const [address, setAddress] = useState<any>({});



  const handlerConfirm = () => {
    onOk(address);
  };

  const handlerChange = (key: any, value: any) => {
    let contact = address;
    contact[key] = value;
    setAddress(contact);
  };
  useEffect(() => {
    if (data !== null) {
      setAddress(data ?? {});
    }
  }, [data]);
  return (
    <Modal
      open={open}
      onOk={handlerConfirm}
      onClose={onClose}
      widthClass="w-[50%]"
      title="BPAddresses"
      disableTitle={true}
      disableFooter={true}
    >
      <>
      <div className="grid grid-cols-2 gap-3">
        <MUITextField
          label="Address ID"
          defaultValue={data?.addressName}
          name="AddressName"
          onChange={(e: any) => handlerChange("addressName", e.target.value)}
        />
        <MUITextField
          label="Address Name2"
          defaultValue={data?.addressName2}
          name="AddressName2"
          onChange={(e: any) => handlerChange("addressName2", e.target.value)}
        />
        <MUITextField
          label="Address Name3"
          defaultValue={data?.addressName3}
          name="AddressName3"
          onChange={(e: any) => handlerChange("addressName3", e.target.value)}
        />
        <MUITextField
          label="Street / PO Box"
          defaultValue={data?.street}
          name="Street"
          onChange={(e: any) => handlerChange("street", e.target.value)}
        />
        <MUITextField
          label="Block"
          defaultValue={data?.block}
          name="Block"
          onChange={(e: any) => handlerChange("block", e.target.value)}
        />
        <MUITextField
          label="City"
          defaultValue={data?.city}
          name="City"
          onChange={(e: any) => handlerChange("city", e.target.value)}
        />
        <MUITextField
          label="Zip Code"
          defaultValue={data?.zipCode}
          name="Zip Code"
          onChange={(e: any) => handlerChange("zipCode", e.target.value)}
        />
        <MUITextField
          label="County"
          defaultValue={data?.county}
          name="County"
          onChange={(e: any) => handlerChange("county", e.target.value)}
        />
        <MUITextField
          label="State"
          defaultValue={data?.state}
          name="State"
          onChange={(e: any) => handlerChange("state", e.target.value)}
        />
        <MUITextField
          label="Country / Region"
          defaultValue={data?.country}
          name="Country"
          onChange={(e: any) => handlerChange("country", e.target.value)}
        />
        <MUITextField
          label="Street No."
          value={data?.streetNo}
          name="Street No."
          onChange={(e: any) => handlerChange("streetNo", e.target.value)}
        />
        <MUITextField
          label="Building/Floor/Room"
          defaultValue={data?.buildingFloorRoom}
          name="Building/Floor/Room"
          onChange={(e: any) =>
            handlerChange("buildingFloorRoom", e.target.value)
          }
        />
      </div>
      <div className=" text-end mt-5">
        <Button variant="contained" type="button" onClick={handlerConfirm}>
          Ok
        </Button>
      </div>
      </>
      
    </Modal>
  );
};

export default AddressModal;
