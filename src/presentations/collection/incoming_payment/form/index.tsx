import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb";
import { FormOrderProvider } from "./context/FormOrderContext";
import { QueryCacheProvider } from "@/utilies/provider";
import { TotalPayment } from "./components/TotalPayment";
import loading from "../../../../assets/img/loading.gif";
import Contents from "./components/Contents";
import Attachments from "./components/Attachment";
import Accounting from "./components/Accounting";
import General from "./components/General";
// import Logistics from "./components/Logistics";
import { useQuery } from "react-query";
import request from "@/utilies/request";

export default function Form() {
  const route = useNavigate();
  const { id }: any = useParams();
  const [value, setValue] = useState("Contents");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const childBreadcrum = (
    <>
      <span onClick={() => route("/banking/incoming-payments")}>
        {" "}
        / Incoming Payment
      </span>{" "}
      /<span className="text-blue-700"> {id ? "Edit" : "Create"}</span>
    </>
  );

  // edit
  const { data: Edit, isLoading } = useQuery(
    ["sales_incoming_payments_edit", id],
    async () => {
      const response: any = await request(
        "GET",
        `/IncomingPayments(${id || 0})`
      )
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
        <FormOrderProvider Edit={Edit}>
          <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
            <Breadcrumb childBreadcrum={childBreadcrum} />
            <div className="bg-white rounded-md w-full p-5">
              <General />
              <div className="mt-10">
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange}>
                      <Tab label="Contents" value="Contents" />
                      <Tab label="Attachments" value="Attachments" />
                    </TabList>
                  </Box>
                  <TabPanel value="Contents" style={{ paddingLeft: 0 }}>
                    <Contents />
                  </TabPanel>
                  <TabPanel value="Attachments">
                    <Attachments />
                  </TabPanel>
                </TabContext>
              </div>
              <hr className="h-[2px] bg-gray-200 mb-10"></hr>
              <TotalPayment />
            </div>
          </div>
        </FormOrderProvider>
      </QueryCacheProvider>
    </>
  );
}
