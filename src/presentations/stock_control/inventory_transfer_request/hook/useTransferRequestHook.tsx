// import FormMessageModal from "@/components/modal/FormMessageModal";
// import request from "@/utilies/request";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";

// export const useTransferRequestHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) =>{
  
// const [loading, setLoading] = useState(false);

//     const { id } = useParams()

//     const {
//         handleSubmit,
//         register,
//         setValue,
//         control,
//         reset,
//         getValues,
//         watch,
//     } = useForm({
//         defaultValues: {
//             U_tl_doc_date: new Date().toISOString()?.split('T')[0],
//             U_tl_bplid: undefined,
//             StockTransferLines: []
//         }
//     });


//   // const onSubmit = async (e: any) => {
//   //   const payload: any = {
//   //     ...e,
//   //   };
//   //   try {

//   //    setLoading(true)

//   //    const method = props.edit ? 'PATCH' : 'POST';
//   //    let url = '/InventoryTransferRequests';

//   //    if (props.edit) url += `(${id})`;

//   //    console.log(method, url)
//   //    console.log(payload)

//   //    const reponse = await request(method, url, payload);
//     //  return dialog.current?.success("Update Successfully.", id);

//       // if (props.edit) {
//       //   await request("PATCH", `/InventoryTransferRequests(${id})`, payload)
//       //     .then((res: any) => {
//       //       console.log(res);
//       //       return dialog.current?.success("Update Successfully.", id);
//       //     })
//       //     .catch((err: any) => dialog.current?.error(err.message))
//       //     .finally(() => setLoading(false));
//       // } else {
//       //   await request("POST", "/InventoryTransferRequests", payload)
//       //     .then((res: any) =>
//       //       dialog.current?.success("Create Successfully.", res?.data?.DocEntry)
//       //     )
//       //     .catch((err: any) => dialog.current?.error(err.message))
//       //     .finally(() => setLoading(false));
//       // }
//   //   } catch (error) {
//   //     console.log(error);
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // };



//   const onSubmit = async (payload: any) => {
//     if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
//         dialog.current?.error("Fuel Level Collection must have at least one row.")
//         return;
//     }

//     setLoading(true);
//     const url = edit ? `TL_FUEL_LEVEL(${id})` : 'TL_FUEL_LEVEL';
//     const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
//     setLoading(false)


//     if (!response.data && typeof response !== 'string') {
//         dialog.current?.error("Error")
//         return;
//     }

//     dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
// };

//   const onInvalidForm = (invalids: any) => {
//     console.log(invalids)
//     dialog.current?.error(
//       invalids[Object.keys(invalids)[0]]?.message?.toString() ??
//         "Oop something wrong!",
//       "Invalid Value"
//     );
//   };

  
//   // const fetchData = async () => {
//   //   if (id) {
//   //     setState({
//   //       ...state,
//   //       loading: true,
//   //     });
//   //     await request("GET", `InventoryTransferRequests(${id})`)
//   //       .then((res: any) => {
//   //         setState({
//   //           ...state,
//   //           loading: false,
//   //         });
//   //       })
//   //       .catch((err: any) =>
//   //         setState({ ...state, isError: true, message: err.message })
//   //       );
//   //   }
//   // };


//   return {
//     onSubmit,
//     watch,
//     handleSubmit,
//     register,
//     setValue,
//     control,
//     reset,
//     getValues,
//     onInvalidForm,
//     loading
//   };
// };





import FormMessageModal from "@/components/modal/FormMessageModal";
import request from "@/utilies/request";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";


export const useTransferRequestFormHook = (edit: boolean, dialog: React.RefObject<FormMessageModal>) => {
    const [loading, setLoading] = useState(false);

    const { id } = useParams()

    const {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues: {
            DocDate: new Date().toISOString()?.split('T')[0],
            BPLID: undefined,
            StockTransferLines: []
        }
    });


    const onSubmit = async (payload: any) => {
        if (!payload.StockTransferLines || payload.StockTransferLines.length === 0) {
            dialog.current?.error("Stock Transfer Lines must have at least one row.")
            return;
        }

        setLoading(true);
        const url = edit ? `InventoryTransferRequests(${id})` : 'InventoryTransferRequests';
        const response: any = await request(edit ? 'PATCH' : 'POST', url, payload);
        setLoading(false)


        if (!response.data && typeof response !== 'string') {
            dialog.current?.error("Error")
            return;
        }

        dialog.current?.success(`${edit ? 'Update' : 'Create'} Successfully.`, response?.data?.DocEntry)
    };

    const onInvalidForm = (e: any) => {
        if (e.StockTransferLines) {
            if (e.StockTransferLines?.length === 0) return;
            const key = Object.keys(e.StockTransferLines[0])[0]
            dialog.current?.error(e.StockTransferLines[0][key].message)
        }
    }

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        request('GET', `InventoryTransferRequests(${id})`)
            .then((res: any) => {
                setLoading(false)
                reset({ ...res.data }, { keepValues: false })
            })
            .catch((e: any) => {
                setLoading(false)
                dialog.current?.error(e?.message)
            });
    }, [id, edit])

    return {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
        // 
        onInvalidForm,
        onSubmit,
        loading,
    }
}