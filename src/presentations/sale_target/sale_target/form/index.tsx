import CoreFormDocument from "@/components/core/CoreFormDocument"
import { withRouter } from "@/routes/withRouter"
import { LoadingButton } from "@mui/lab"
import MenuButton from "@/components/button/MenuButton"
import { FormValidateException } from "@/utilies/error"
import LoadingProgress from "@/components/LoadingProgress"
import GeneralForm from "../components/GeneralForm"
import React, { useContext } from "react"

import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper"
import request from "@/utilies/request"
import { arrayBufferToBlob } from "@/utilies"
import shortid from "shortid"
import { Alert, Snackbar, Button } from "@mui/material"
import ContentForm from "../components/ContentForm"

class Form extends CoreFormDocument {
  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      U_tl_date: new Date().toISOString(),
      Items: [
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: true,
          isLob: false,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: true,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "FUE0001",
          description: "Diesel Euro 5",
          uom: "Littre",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "FUE0002",
          description: "Reqular 92",
          uom: "Littre",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "LPG",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: true,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "LPG0002",
          description: "Tela Gas 15Kg",
          uom: "KG",
          lob : "LPG",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: true,
          isLob: false,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: true,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "FUE0001",
          description: "Diesel Euro 5",
          uom: "Littre",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "FUE0002",
          description: "Reqular 92",
          uom: "Littre",
          lob : "Fuel",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "",
          description: "",
          uom: "",
          lob : "LPG",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: true,
          isItem: false
        },
        {
          saleCode: "EMP002",
          saleName: "Mr. B",
          itemCode: "LPG0002",
          description: "Tela Gas 15Kg",
          uom: "KG",
          lob : "LPG",
          Jan_amount : "100",
          Jan_qty : "22",
          Feb_amount : "22",
          Feb_qty : "22",
          Mar_amount : "22",
          Mar_qty : "22",
          Apr_amount : "222",
          Apr_qty : "232",
          May_amount : "2231",
          May_qty : "23213",
          Jun_amount : "123123",
          Jun_qty : "12312",
          Jul_amount : "123",
          Jul_qty : "12",
          Aug_amount : "13123",
          Aug_qty : "123123",
          Sep_qty : "123",
          Sep_amount : "12313",
          Oct_amount : "12312",
          Oct_qty : "123",
          Nov_amount : "12312",
          Nov_qty : "12312",
          Dec_amount : "123",
          Dec_qty : "123",
          Total : "12312",
          isSale: false,
          isLob: false,
          isItem: true
        },
      ]
    } as any

    this.onInit = this.onInit.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this)
    this.hanndResetState = this.hanndResetState.bind(this)
  }

  componentDidMount(): void {
    this.setState({ loading: true })
    this.onInit()
  }

  async onInit() {
    let state: any = { ...this.state }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0
      await request("GET", `TL_SALES_SCENARIO('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data
          console.log(data)

          state = {
            ...data,
            // Code: data?.Code,
            // Name: data?.Name,
            // U_tl_expacct: data?.U_tl_expacct,
            // U_tl_expactive: data?.U_tl_expactive,
          }
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["loading"] = false
          this.setState(state)
        })
    } else {
      state["loading"] = false
      this.setState(state)
    }
  }

  async handlerSubmit(event: any) {
    event.preventDefault()
    const data: any = { ...this.state }

    try {
      this.setState({ ...this.state, isSubmitting: true })
      await new Promise((resolve) => setTimeout(() => resolve(""), 800))
      const { id } = this.props?.match?.params || 0

      let TL_ATTECHCollection = null
      const files = data?.AttachmentList?.map((item: any) => item)
      if (files?.length > 0) TL_ATTECHCollection = await getAttachment(files)

      // on Edit
      const payload = {
        // Series: data?.Series || null,

        Code: data?.Code,
        Name: data?.Name,
        U_tl_date: data?.U_tl_date,
        U_tl_remark: data?.U_tl_remark,
        U_tl_status: data?.U_tl_status,
      }

      if (id) {
        return await request("PATCH", `/TL_SALES_SCENARIO('${id}')`, payload)
          .then(
            (res: any) => this.dialog.current?.success("Update Successfully.", id),
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }))
      }

      await request("POST", "/TL_SALES_SCENARIO", payload)
        .then(
          (res: any) =>
            this.dialog.current?.success("Create Successfully.", res?.data?.Code),
        )
        .catch((err: any) => this.dialog.current?.error(err.message))
        .finally(() => this.setState({ ...this.state, isSubmitting: false }))
    } catch (error: any) {
      if (error instanceof FormValidateException) {
        this.setState({ ...data, isSubmitting: false, tapIndex: error.tap })
        this.dialog.current?.error(error.message, "Invalid")
        return
      }

      this.setState({ ...data, isSubmitting: false })
      this.dialog.current?.error(error.message, "Invalid")
    }
  }

  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index })
  }

  hanndResetState(props: any) {
    this.setState({
      ...props,
    } as any)
  }

  handleNextTab = () => {
    const currentTab = this.state.tapIndex;
    const requiredFields = this.getRequiredFieldsByTab(currentTab);
    const hasErrors = requiredFields.some((field: any) => {
      if (field === "Items") {
        // Check if the "Items" array is empty
        return !this.state[field] || this.state[field].length === 0;
      }
      return !this.state[field];
    });

    if (hasErrors) {
      // Show the dialog if there are errors
      this.setState({ isDialogOpen: true });
    } else {
      // If no errors, allow the user to move to the next tab
      this.handlerChangeMenu(currentTab + 1);
    }
  }

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false })
  }

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {}
    return requiredFieldsMap[tabIndex] || []
  }

  handlePreviousTab = () => {
    if (this.state.tapIndex > 0) {
      this.handlerChangeMenu(this.state.tapIndex - 1)
    }
  }

  HeaderTaps = () => {
    return (
      <>
        <MenuButton active={this.state.tapIndex === 0}>General</MenuButton>
        <MenuButton active={this.state.tapIndex === 1}>Content</MenuButton>
        <div className="sticky w-full bottom-4   ">
          <div className="  p-2 rounded-lg flex justify-end gap-3  ">
            <div className="flex ">
              <Button
                size="small"
                variant="outlined"
                onClick={this.handlePreviousTab}
                disabled={this.state.tapIndex === 0}
                style={{ textTransform: "none" }}
              >
                Previous
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                size="small"
                variant="outlined"
                onClick={this.handleNextTab}
                disabled={this.state.tapIndex === 1}
                style={{ textTransform: "none" }}
              >
                Next
              </Button>

              <Snackbar
                open={this.state.isDialogOpen}
                autoHideDuration={6000}
                onClose={this.handleCloseDialog}
              >
                <Alert
                  onClose={this.handleCloseDialog}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  Please complete all required fields before proceeding to the next
                  tab.
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
      </>
    )
  }

  FormRender = () => {
    return (
      <>
        <form
          id="formData"
          onSubmit={(e: any) => this.handlerSubmit(e)}
          className="h-full w-full flex flex-col gap-4 relative"
        >
          {this.state.loading ? (
            <div className="w-full h-full flex item-center justify-center">
              <LoadingProgress />
            </div>
          ) : (
            <>
              <div className="grow">
                {this.state.tapIndex === 0 && (
                  <GeneralForm
                    hanndResetState={this.hanndResetState}
                    data={this.state}
                    edit={this.props?.edit}
                    handlerChange={(key, value) => this.handlerChange(key, value)}
                  />
                )}
                {this.state.tapIndex === 1 && (
                    <ContentForm Items={this.state?.Items}/>
                  )}
              </div>
            </>
          )}
          {this.state.DocumentStatus !== "Closed" && (
            <div className="sticky w-full bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
                <div className="flex ">
                  <LoadingButton
                    size="small"
                    sx={{ height: "25px" }}
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-3 text-[11px] py-1 text-white">Cancel</span>
                  </LoadingButton>
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingButton
                    type="submit"
                    sx={{ height: "25px" }}
                    className="bg-white"
                    loading={false}
                    size="small"
                    variant="contained"
                    disableElevation
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      {this.props.edit ? "Update" : "Save"}
                    </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          )}
        </form>
      </>
    )
  }
}

export default withRouter(Form)
