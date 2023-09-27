import { Route, Routes } from "react-router-dom"
import Expense from "@/presentations/expense"
import SettleReceiptLists from "@/presentations/collection/settle_receipt"
import SettleReceiptForm from "@/presentations/collection/settle_receipt/form"
import SettleReceiptDetail from "@/presentations/collection/settle_receipt/detail"
import { APIContextProvider } from "@/presentations/collection/settle_receipt/context/APIContext"
import PaymentAccountLists from "@/presentations/collection/payment_account"
import PaymentAccountForm from "@/presentations/collection/payment_account/form"
import PaymentAccountDetail from "@/presentations/collection/payment_account/detail"
import DirectAccountLists from "@/presentations/collection/direct_account"
import DirectAccountForm from "@/presentations/collection/direct_account/form"
import DirectAccountDetail from "@/presentations/collection/direct_account/detail"

export default function ExpenseRoute() {
  return (
    <Routes>
      <Route index element={<Expense />} />
    </Routes>
  )
}
