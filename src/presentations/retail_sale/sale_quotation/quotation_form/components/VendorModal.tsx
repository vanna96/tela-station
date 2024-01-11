import React, { useEffect, memo, useState } from "react";
// import { Modal, Table } from "antd";
import { FlexHeader } from "./FlexHeader";
import { TextFormField } from "./TextFormField";
// import { useDispatch, useSelector } from "react-redux";
// import getBussinessParnter from "../repository/buessinessParnterRepository";

type VendorModalProps = {
  supplier?: any;
  customer?: any;
  onOk?: any;
  open: any;
  onCancel?: any;
};

const VendorModal = ({
  supplier,
  customer,
  onOk,
  open,
  onCancel,
}: VendorModalProps) => {
  const [state, setstate] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [select, setSelect] = useState(null);

//   const { data, loading } = useSelector((state: any) => state.bussinessPartner);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (loading) {
//       getBussinessParnter(dispatch);
//     }

//     if (data) {
//       let vendors = [];
//       if (supplier) {
//         vendors = data?.filter((e: any) => e?.CardType === "cSupplier");
//         setstate(vendors);
//       }

//       if (customer) {
//         vendors = data?.filter((e: any) => e?.CardType === "cCustomer");
//         setstate(vendors);
//       }
//     }
//   }, [data]);

  const onConfirm = () => {
    // const data = vendors.filter((e: any) => e?.CardCode === select?.key);
    //
    // onOk(select, data[0]);
  };

  return (
    <></>
    // <Modal
    //   title="Bussines Partner"
    //   maskClosable={false}
    //   open={open}
    //   onOk={onConfirm}
    //   onCancel={onCancel}
    //   width={1000}
    // >
    //   <div className="w-full p-4 border border-gray-100 rounded">
    //     <FlexHeader>
    //       <TextFormField label="BP Code" pClass="pr-4" />
    //       <TextFormField label="BP Name" />
    //     </FlexHeader>
    //   </div>
    //   <div className="my-6"></div>
    //   <div className="w-full h-[30rem]">
    //     <Table
    //       size="small"
    //       scroll={{
    //         x: 100,
    //         y: 370,
    //       }}
    //       columns={[
    //         { dataIndex: "CardCode", title: "BPCode", width: 40 },
    //         { dataIndex: "CardName", title: "BPName", width: 100 },
    //         { dataIndex: "Balance", title: "Balance", width: 40 },
    //         { dataIndex: "Currency", title: "Currency", width: 40 },
    //       ]}
    //       dataSource={state}
    //       loading={loading}
    //       onChange={() => {}}
    //       onRow={(record: any, rowIndex: Number) => {
    //         return {
    //           onClick: () => {
    //             setSelect(record);
    //             onOk(record);
    //           },
    //         };
    //       }}
    //     />
    //   </div>
    // </Modal>
  );
};

export default memo(VendorModal);
