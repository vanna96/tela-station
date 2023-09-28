import { Route, Routes } from "react-router-dom"
import Expense from "@/presentations/expense"
import { APIContextProvider } from "@/presentations/expense/context/APIContext"
import LogLists from "@/presentations/expense/log"
import LogForm from "@/presentations/expense/log/form"
import LogDetail from "@/presentations/expense/log/detail"

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
      </Routes>
    </APIContextProvider>
  )
}
