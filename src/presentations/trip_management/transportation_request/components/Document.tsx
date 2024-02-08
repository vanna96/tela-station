import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa6";
import TRModal from "./ModalTR";
export default function Document({
  register,
  defaultValue,
  setValue,
  commer,
  setCommer,
  control,
  detail,
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: undefined,
    u_ExpiredDate: undefined,
    u_Type: "",
  });

  const [open, setOpen] = useState(false);
  const [document, setDocument] = useState<any>([]);
  const [showF, setShowF] = useState<any>(true);

  const handleOpen = () => {
    setOpen(true);
  };
  const handlerDelete = (index: number) => {
    if (index >= 0 && detail !== true) {
      const state: any[] = [...document];
      state.splice(index, 1);
      setDocument(state);
    } else {
      return;
    }
  };
  console.log(document);
  const handleDeleteChild = (parentIndex: number, childIndex: number) => {
    setDocument((prevDocument: any) => {
      let updatedDocument = [...prevDocument];
  
      // Check if the parent and its Children array exist
      if (
        Array.isArray(updatedDocument[parentIndex]["Children"]) &&
        updatedDocument[parentIndex]["Children"].length > 0
      ) {
        // Remove the child at the specified index
        updatedDocument[parentIndex]["Children"] = [
          ...updatedDocument[parentIndex]["Children"].slice(0, childIndex),
          ...updatedDocument[parentIndex]["Children"].slice(childIndex + 1),
        ];
  
        // Optionally, if you want to remove the parent as well when there are no more children
        if (updatedDocument[parentIndex]["Children"].length === 0) {
          delete updatedDocument[parentIndex]["Children"];
        }
      }
  
      return updatedDocument;
    });
  };
  
  
  const addChildrens = (index: any) => {
    setDocument((prevDocument: any) => {
      let updatedDocument = [...prevDocument];
      if (!Array.isArray(updatedDocument[index]["Children"])) {
        updatedDocument[index]["Children"] = [];
      }

      updatedDocument[index]["Children"] = [
        ...updatedDocument[index]["Children"],
        {
          parent: updatedDocument[index]["id__"],
          Quantity: 0,
        },
        {
          parent: updatedDocument[index]["id__"],
          Quantity: 0,
        },
      ];

   
      return updatedDocument;
    });
  };
  const addChildren = (index: any) => {
    setDocument((prevDocument: any) => {
      let updatedDocument = [...prevDocument];
      if (!Array.isArray(updatedDocument[index]["Children"])) {
        updatedDocument[index]["Children"] = [];
      }

      updatedDocument[index]["Children"] = [
        ...updatedDocument[index]["Children"],
        {
          parent: updatedDocument[index]["id__"],
          Quantity: 0,
        },
      ];
   
      return updatedDocument;
    });
  };
console.log(document);

  return (
    <>
      <div className="ml-3">
        <Button
          sx={{ height: "25px" }}
          className="bg-white"
          size="small"
          variant="contained"
          disableElevation
          onClick={handleOpen}
        >
          <span className="px-4 text-[11px] py-4 text-white">
            Load Document
          </span>
        </Button>
      </div>
      <div className="rounded-lg shadow-sm  border pt-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Source Document</h2>
        </div>
        <div>
          <table  className=" w-full  border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[180px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Source Document <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Document Number{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item{" "}
              </th>
              <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                Ship To <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Delivery Date <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Quantity{" "}
              </th>
              <th className="w-[90px] text-center font-normal py-2 text-[14px] text-gray-500">
                Action{" "}
              </th>
            </tr>
            {document?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record
                </td>
              </tr>
            )}
            {document?.map((e: any, index: number) => {
              
              return (
                <>
                  <tr key={index}>
                    <td className="py-5 flex justify-center gap-5 items-center">
                      <div className={`text-gray-700`}>
                        <FaAngleDown color="gray" />
                      </div>
                      <span className="text-gray-500">{index + 1}</span>
                    </td>

                    <td className="pr-4">
                      <span className="text-gray-500 text-[13.5px]">
                        {e?.Type === "ITR"
                          ? "Inventory Transfer Request"
                          : "Sale Order"}
                      </span>
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="Document Number"
                        value={e?.DocNum}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="Item"
                        value={e?.ItemCode}
                      />
                    </td>
                    <td  className="pr-4">
                      <MUITextField
                        // disabled={true}
                        onClick={() => addChildrens(index)}
                        placeholder="Ship To"
                        value={e?.ShipToCode}
                        endAdornment={e?.Children?.length === 0 || !e?.Children ?true:false}
                        disabled={e?.Children?.length === 0 || !e?.Children ?false:true}

                      />
                    </td>

                    <td className="pr-4 pb-1">
                      <MUIDatePicker
                        onChange={(e) => {
                          if (e !== null) {
                            const val =
                              e.toLowerCase() ===
                              "Invalid Date".toLocaleLowerCase()
                                ? ""
                                : e;
                          }
                        }}
                        value={e?.DocDate}
                        key={`docdate_${e?.DocDate}`}
                      />
                    </td>
                    <td className="">
                      <MUITextField
                        disabled={true}
                        placeholder="Quantity"
                        value={e?.Quantity?.toString() + ".00"}
                      />
                    </td>
                    <td className="text-center">
                      <div
                        onClick={() => handlerDelete(index)}
                        className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                      >
                        -
                      </div>
                    </td>
                  </tr>

                  {e?.Children?.map((e: any, childIndex: number) => (
                    <>
                      <tr key={`${index}_child_${childIndex}`}>
                        <td className="pr-4"></td>
                        <td className="pr-4"></td>
                        <td className="pr-4"></td>
                        <td className="pr-4"></td>
                        <td className="pr-4">
                          <div className="pb-2">
                          <MUITextField
                            placeholder="Ship To"
                            value={e?.ShipToCode}
                          />
                          </div>
                        
                        </td>
                        <td className="pr-4 pb-2">
                          <MUITextField
                            placeholder="Delivery Date"
                            value={e?.DeliveryDate}
                          />
                        </td>
                        <td className="">
                          <MUITextField
                            placeholder="Quantity"
                            value={e?.Quantity}
                          />
                        </td>
                        <td className="text-center">
                          <div
                            onClick={() => handleDeleteChild(index,childIndex)}
                            className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                          >
                            -
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      {/* <tr>
                       
                      <td colSpan={4} className="">
                        <div className="pt-1">
                        <Button
                          sx={{ height: "25px" }}
                          className="bg-white"
                          size="small"
                          variant="outlined"
                          disableElevation
                        >
                          <span className="inline-block w-[80px]">Add</span>
                          
                        </Button>
                        </div>
                      
                      </td>
                    
                      </tr> */}
                    </>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    {e.Children && e.Children.length > 0 ? (
                      <td colSpan={4} className="">
                        <div className="pt-1">
                        <Button
                         onClick={() => addChildren(index)}
                          sx={{ height: "25px" }}
                          className="bg-white"
                          size="small"
                          variant="outlined"
                          disableElevation
                        >
                          <span className="inline-block w-[80px]">Add</span>
                          
                        </Button>
                        </div>
                      
                      </td>
                    ) : null} 
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
      </div>
      <TRModal setDocument={setDocument} open={open} setOpen={setOpen} />
    </>
  );
}
