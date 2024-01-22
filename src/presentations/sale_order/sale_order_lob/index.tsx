import request, { url } from "@/utilies/request";
import React, { useState } from "react";
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

export default function SaleOrderLists() {
  const [open, setOpen] = React.useState<boolean>(false);
  const route = useNavigate();
  const salesTypes = useParams();
  const salesType = salesTypes["*"];
  const [dataUrl, setDataUrl] = useState("");
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
        accessorKey: "CardCode",
        header: "Customer Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
        size: 65,
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        visible: true,
        type: "string",
        align: "center",
        size: 90,
      },
      {
        accessorKey: "TaxDate",
        header: "Posting Date",
        visible: true,
        type: "string",
        align: "center",
        size: 60,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.value).format("YYYY-MM-DD");
          return <span>{formattedDate}</span>;
        },
      },

      {
        accessorKey: "DocumentStatus",
        header: " Status",
        visible: true,
        type: "string",
        size: 60,
        Cell: ({ cell }: any) => <>{cell.getValue()?.split("bost_")}</>,
      },

      {
        accessorKey: "DocTotal",
        header: " Document Total",
        visible: true,
        type: "string",
        size: 70,
        Cell: ({ cell }: any) => (
          <>
            {"$"} {cell.getValue().toFixed(2)}
          </>
        ),
      },
      // {
      //   accessorKey: "BPL_IDAssignedToInvoice",
      //   header: "Branch",
      //   enableClickToCopy: true,
      //   visible: false,
      //   Cell: ({ cell }: any) =>
      //     new BranchBPLRepository()?.find(cell.getValue())?.BPLName,
      //   size: 60,
      // },

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
                  `/sale-order/${salesType}/` + cell.row.original.DocEntry,
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
                  `/sale-order/${salesType}/` +
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
  let numAtCardFilter = "";
  switch (salesType) {
    case "fuel-sales":
      numAtCardFilter = "Oil";
      break;
    case "lube-sales":
      numAtCardFilter = "Lube";
      break;
    case "lpg-sales":
      numAtCardFilter = "LPG";
      break;
    default:
    // Handle the default case or log an error if needed
  }

  const [filter, setFilter] = React.useState("");
  const defaultFilter = `$filter=U_tl_salestype eq null and U_tl_arbusi eq '${numAtCardFilter}'`;
  const [sortBy, setSortBy] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  console.log(salesType);
  const Count: any = useQuery({
    queryKey: ["sale-order-lob", filter !== "" ? "-f" : "", salesType, filter],
    queryFn: async () => {
      let numAtCardFilter = "";

      switch (salesType) {
        case "fuel-sales":
          numAtCardFilter = "Oil";
          break;
        case "lube-sales":
          numAtCardFilter = "Lube";
          break;
        case "lpg-sales":
          numAtCardFilter = "LPG";
          break;
        default:
        // Handle the default case or log an error if needed
      }

      const apiUrl = `${url}/Orders/$count?$filter=U_tl_salestype eq null${
        numAtCardFilter !== "" ? ` and U_tl_arbusi eq '${numAtCardFilter}'` : ""
      }${filter ? ` and ${filter}` : ""}`;
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
      "sales-order-lob",
      salesType,
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      let numAtCardFilter = "";

      switch (salesType) {
        case "fuel-sales":
          numAtCardFilter = "Oil";
          break;
        case "lube-sales":
          numAtCardFilter = "Lube";
          break;
        case "lpg-sales":
          numAtCardFilter = "LPG";
          break;
        default:
        // Handle the default case or log an error if needed
      }

      // const response: any = await request(
      //   "GET",
      //   `${url}/Orders?$top=${pagination.pageSize}&$skip=${
      //     pagination.pageIndex * pagination.pageSize
      //   }&$filter=U_tl_salestype eq null${
      //     numAtCardFilter ? ` and U_tl_arbusi eq '${numAtCardFilter}'` : ""
      //   }${filter ? ` and ${filter}` : filter}${
      //     sortBy !== "" ? "&$orderby=" + sortBy : ""
      //   }${"&$select =DocNum,DocEntry,CardCode,CardName, TaxDate,DocumentStatus, DocTotal, BPL_IDAssignedToInvoice"}`
      // )
      //   .then((res: any) => res?.data?.value)
      //   .catch((e: Error) => {
      //     throw new Error(e.message);
      //   });

      const Url = `${url}/Orders?$top=${pagination.pageSize}&$skip=${
        pagination.pageIndex * pagination.pageSize
      }&$filter=U_tl_salestype eq null${
        numAtCardFilter ? ` and U_tl_arbusi eq '${numAtCardFilter}'` : ""
      }${filter ? ` and ${filter}` : filter}${
        sortBy !== "" ? "&$orderby=" + sortBy : ""
      }${"&$select =DocNum,DocEntry,CardCode,CardName, TaxDate,DocumentStatus, DocTotal, BPL_IDAssignedToInvoice"}`;

      const dataUrl = `${url}/Orders?$filter=U_tl_salestype eq null${
        numAtCardFilter ? ` and U_tl_arbusi eq '${numAtCardFilter}'` : ""
      }${filter ? ` and ${filter}` : filter}${
        sortBy !== "" ? "&$orderby=" + sortBy : ""
      }${"&$select =DocNum,DocEntry,CardCode,CardName, TaxDate,DocumentStatus, DocTotal, BPL_IDAssignedToInvoice"}`;

      setDataUrl(dataUrl);
      const response: any = await request("GET", Url)
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
  let queryFilters = "";
  console.log(queryFilters);
  const handlerSearch = (value: string) => {
    console.log(value);
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

    // console.log(qurey);
    console.log(queryFilters);
    console.log(searchValues);

    let qurey = queryFilters + value;
    // console.log(qurey + value);
    // qurey === {}? setFilter(qurey) : setFilter(value);
    Object.keys(qurey).length === 0 ? setFilter(value) : setFilter(qurey);

    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  console.log(queryFilters);

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
      <span className="" onClick={() => route(`/sale-order/${salesType}`)}>
        <span className=""></span> {capitalizeHyphenatedWords(salesType)}
      </span>
    </>
  );
  const getTitleBySalesType = (salesType: any) => {
    switch (salesType) {
      case "fuel-sales":
        return "Fuel Sale Lists";
      case "lpg-sales":
        return "LPG Sale Lists";

      case "lube-sales":
        return "Lube Sale Lists";
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
                  // onClick={handleGoClick}
                  onClick={() => handlerSearch("")}
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
          dataUrl={dataUrl}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title={getTitleBySalesType(salesType)}
          createRoute={`/sale-order/${salesType}/create`}
        />
      </div>
    </>
  );
}
