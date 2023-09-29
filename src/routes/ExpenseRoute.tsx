import { Route, Routes } from "react-router-dom"
import Expense from "@/presentations/expense"
import { APIContextProvider } from "@/presentations/expense/context/APIContext"
import LogLists from "@/presentations/expense/log"
import LogForm from "@/presentations/expense/log/form"
import LogDetail from "@/presentations/expense/log/detail"
import ClearenceLists from "@/presentations/expense/clearence"
import ClearenceForm from "@/presentations/expense/clearence/form"
import ClearenceDetail from "@/presentations/expense/clearence/detail"

export default function ExpenseRoute() {
  return (
    <APIContextProvider>
      <Routes>
        <Route index element={<Expense />} />
        <Route path="/log">
          <Route index element={<LogLists />} />
          <Route path="create" element={<LogForm />} />
          <Route path=":id" element={<LogDetail />} />
          <Route path=":id/edit" element={<LogForm edit={true} />} />
        </Route>
        <Route path="/clearance">
          <Route index element={<ClearenceLists />} />
          <Route path="create" element={<ClearenceForm />} />
          <Route path=":id" element={<ClearenceDetail />} />
          <Route path=":id/edit" element={<ClearenceForm edit={true} />} />
        </Route>
      </Routes>
    </APIContextProvider>
  )
}
