import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import General from "./components/General";
import Contents from "./components/Contents";
import Logistics from "./components/Logistics";
import Accounting from "./components/Accounting";
import Attachments from "./components/Attachments";
import { GeneralProvider } from "./context/GeneralFormContext";
import { ContactProvider } from "./context/ContentFormContext";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { TotalPayment } from "./TotalPayment";
import { AttachmentProvider } from "./context/AttachmentFormContext";
import { LogisticProvider } from "./context/LogisticsFormContext";
import { AccountingProvider } from "./context/AccountingFormContext";
import { useQuery } from "react-query";
import loading from "../../../../assets/img/loading.gif";
import request from "@/utilies/request";
import { QueryCacheProvider } from "@/utilies/provider";

export default function SaleQuotationForm(props: any) {
  const { id }: any = useParams();
  const route = useNavigate();
  const [value, setValue] = useState("Contents");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const childBreadcrum = (
    <>
      <span onClick={() => route("/sale/sales-quotation")}>
        {" "}
        / Sales Quotation
      </span>{" "}
      /<span className="text-blue-700"> {id ? "Edit" : "Create"}</span>
    </>
  );

  // edit
  const { data: Edit, isLoading } = useQuery(
    ["sales_quotation_edit", id],
    async () => {
      const response: any = await request("GET", `/Quotations(${id || 0})`)
        .then((res: any) => res?.data)
        .catch((e) => {
          throw new Error(e);
        });

      return response;
    },
    {
      enabled: id ? true : false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  if (id && isLoading)
    return (
      <div className="w-full h-full m-auto flex justify-center items-center">
        <img
          className="bg-transparent w-[150px]"
          src={loading}
          alt="loading..."
        />
      </div>
    );

  return (
    <>
      <QueryCacheProvider>
        <GeneralProvider Edit={Edit}>
          <ContactProvider Contact={Edit}>
            <AttachmentProvider Edit={Edit}>
              <LogisticProvider Edit={Edit}>
                <AccountingProvider Edit={Edit}>
                  <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
                    <Breadcrumb childBreadcrum={childBreadcrum} />
                    <div className="bg-white rounded-md w-full p-5">
                      <General />
                      <div className="mt-10">
                        <TabContext value={value}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList onChange={handleChange}>
                              <Tab label="Contents" value="Contents" />
                              <Tab label="Logistics" value="Logistics" />
                              <Tab label="Accounting" value="Accounting" />
                              <Tab label="Attachments" value="Attachments" />
                            </TabList>
                          </Box>
                          <TabPanel value="Contents" style={{ paddingLeft: 0 }}>
                            <Contents Edit={Edit} />
                          </TabPanel>
                          <TabPanel value="Logistics">
                            <Logistics Edit={Edit} />
                          </TabPanel>
                          <TabPanel value="Accounting">
                            <Accounting Edit={Edit} />
                          </TabPanel>
                          <TabPanel value="Attachments">
                            <Attachments />
                          </TabPanel>
                        </TabContext>
                      </div>
                      <hr className="h-[2px] bg-gray-200 mb-10"></hr>
                      <TotalPayment Edit={Edit} />
                    </div>
                  </div>
                </AccountingProvider>
              </LogisticProvider>
            </AttachmentProvider>
          </ContactProvider>
        </GeneralProvider>
      </QueryCacheProvider>
    </>
  );
}
