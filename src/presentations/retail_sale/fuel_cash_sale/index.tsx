import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import BPAutoComplete from "@/components/input/BPAutoComplete";
import { Button } from "@mui/material";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import moment from "moment";
import { Breadcrumb } from "../components/Breadcrumn";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useCookies } from "react-cookie";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import DispenserRepository from "@/services/actions/dispenserRepository";

export default function SaleOrderLists() {
  const [open, setOpen] = React.useState<boolean>(false);
  const route = useNavigate();
  const salesTypes = useParams();
  const salesType = salesTypes["*"];
  console.log(salesType);
  let numAtCardFilter = "";
  switch (salesType) {
    case "fuel-cash-sale":
      numAtCardFilter = "Oil";
      break;
    case "lube-cash-sale":
      numAtCardFilter = "Lube";
      break;
    case "lpg-cash-sale":
      numAtCardFilter = "LPG";
      break;
    default:
    // Handle the default case or log an error if needed
  }
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Doc. No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "U_tl_pump",
        header: "Pump Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
        size: 65,
        Cell: ({ cell }: any) =>
          new DispenserRepository()?.find("Sopen2")?.Name,
      },
      {
        accessorKey: "U_tl_cardcode",
        header: "Customer Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
        size: 65,
      },
      {
        accessorKey: "U_tl_cardname",
        header: "Customer Name",
        visible: true,
        type: "string",
        align: "center",
        size: 90,
      },
      {
        accessorKey: "U_tl_docdate",
        header: "Posting Date",
        visible: true,
        type: "string",
        align: "center",
        size: 60,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.row.original.U_tl_docdate).format(
            "YYYY-MM-DD"
          );
          return <span>{formattedDate}</span>;
        },
      },

      {
        accessorKey: "U_tl_bplid",
        header: "Branch",
        enableClickToCopy: true,
        visible: true,
        Cell: ({ cell }: any) =>
          new BranchBPLRepository()?.find(cell.getValue())?.BPLName,
        size: 60,
      },

      //
      {
        accessorKey: "DocEntry",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        enableSorting: false,
        minSize: 100,
        maxSize: 100,
        header: "Action",
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/retail-sale/${salesType}/` + cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              <span style={{ textTransform: "none" }}>View</span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={
                cell.row.original.DocumentStatus === "bost_Close" ?? false
              }
              className={`${
                cell.row.original.DocumentStatus === "bost_Close"
                  ? "bg-gray-400"
                  : ""
              } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(
                  `/retail-sale/${salesType}/` +
                    cell.row.original.DocEntry +
                    "/edit",
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />{" "}
              <span style={{ textTransform: "none" }}> Edit</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const Count: any = useQuery({
    queryKey: ["retail-sale-lob", filter !== "" ? "-f" : "", salesType, filter],
    queryFn: async () => {
      const apiUrl = `${url}/TL_RetailSale/$count?${filter ? ` and ${filter}` : ""}`;
      const response: any = await request("GET", apiUrl)
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });

      return response;
    },
    // staleTime: Infinity,
  });

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "retail-sale-lob",
      salesType,
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_RetailSale?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }${filter ? ` and ${filter}` : filter}${
          sortBy !== "" ? "&$orderby=" + sortBy : ""
        }`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });

      return response;
    },
    // staleTime: Infinity,
    retry: 1,
  });

  const handlerRefresh = React.useCallback(() => {
    setFilter("");
    setSortBy("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handlerSearch = (value: string) => {
    const qurey = value;
    setFilter(qurey);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  const handlerSearchFilter = (queries: any) => {
    if (queries === "") return handlerSearch("");
    handlerSearch("" + queries);
  };

  const handleAdaptFilter = () => {
    setOpen(true);
  };
  const [cookies] = useCookies(["user"]);

  const [searchValues, setSearchValues] = React.useState({
    docnum: "",
    cardcode: "",
    cardname: "",
    postingDate: null,
    status: "",
    bplid: "",
  });

  const handleGoClick = () => {
    let queryFilters = "";
    if (searchValues.docnum) {
      queryFilters += `DocNum eq ${searchValues.docnum}`;
    }
    if (searchValues.cardcode) {
      queryFilters += queryFilters
        ? // : `eq(CardCode, '${searchValues.cardcode}')`;
          ` and CardCode eq '${searchValues.cardcode}'`
        : `CardCode eq '${searchValues.cardcode}'`;
    }
    if (searchValues.cardname) {
      queryFilters += queryFilters
        ? ` and startswith(CardName, '${searchValues.cardname}')`
        : `startswith(CardName, '${searchValues.cardname}')`;
    }
    if (searchValues.postingDate) {
      queryFilters += queryFilters
        ? ` and TaxDate ge '${searchValues.postingDate}'`
        : `TaxDate ge '${searchValues.postingDate}'`;
    }
    if (searchValues.status) {
      queryFilters += queryFilters
        ? ` and DocumentStatus eq '${searchValues.status}'`
        : `DocumentStatus eq '${searchValues.status}'`;
    }
    if (searchValues.bplid) {
      queryFilters += queryFilters
        ? ` and BPL_IDAssignedToInvoice eq ${searchValues.bplid}`
        : `BPL_IDAssignedToInvoice eq ${searchValues.bplid}`;
    }

    handlerSearchFilter(queryFilters);
  };
  const { id }: any = useParams();
  function capitalizeHyphenatedWords(str: any) {
    return str
      .split("-")
      .map((word: any) => {
        if (word.toLowerCase() === "lpg") {
          return word.toUpperCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      })
      .join(" ");
  }

  const childBreadcrum = (
    <>
      <span className="" onClick={() => route(`/retail-sale/${salesType}`)}>
        <span className=""></span> {capitalizeHyphenatedWords(salesType)}
      </span>
    </>
  );
  const getTitleBySalesType = (salesType: any) => {
    switch (salesType) {
      case "fuel-cash-sale":
        return "Fuel Cash Sale Lists";
      case "lpg-cash-sale":
        return "LPG Cash Sale Lists";

      case "lube-cash-sale":
        return "Lube Cash Sale Lists";
      // Add other cases as needed
      default:
        return "Unknown Sale Lists";
    }
  };

  return (
    <>
      <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
          <Breadcrumb childBreadcrum={childBreadcrum} />
        </div>

        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  type="number"
                  value={searchValues.docnum}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, docnum: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <BPAutoComplete
                  type="Customer"
                  label="Customer"
                  value={searchValues.cardcode}
                  onChange={(selectedValue) =>
                    setSearchValues({
                      ...searchValues,
                      cardcode: selectedValue,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Posting Date"
                  value={searchValues.postingDate}
                  // onChange={(e: any) => handlerChange("PostingDate", e)}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      postingDate: e,
                    });
                  }}
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch
                  </label>
                  <div className="">
                    <BranchAutoComplete
                      BPdata={cookies?.user?.UserBranchAssignment}
                      onChange={(selectedValue) =>
                        setSearchValues({
                          ...searchValues,
                          bplid: selectedValue,
                        })
                      }
                      value={searchValues.bplid}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGoClick}
                >
                  Go
                </Button>
              </div>
              <div className="">
                <DataTableColumnFilter
                  handlerClearFilter={handlerRefresh}
                  title={
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        // onClick={handleGoClick}
                      >
                        Filter
                      </Button>
                    </div>
                  }
                  items={columns?.filter(
                    (e) =>
                      e?.accessorKey !== "DocEntry" &&
                      e?.accessorKey !== "DocNum" &&
                      e?.accessorKey !== "CardCode" &&
                      e?.accessorKey !== "CardName" &&
                      e?.accessorKey !== "TaxDate" &&
                      e?.accessorKey !== "BPL_IDAssignedToInvoice"
                  )}
                  onClick={handlerSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title={getTitleBySalesType(salesType)}
          createRoute={`/retail-sale/${salesType}/create`}
        />
      </div>
    </>
  );
}
