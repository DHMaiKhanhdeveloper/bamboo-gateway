import { Routes, Route } from "react-router-dom";
import TestSuitesList from "./pages/TestSuitesList";
import SuiteDetailPage from "./pages/SuiteDetailPage";
import ReportDetailPage from "./pages/ReportDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TestSuitesList />} />
      <Route path="/suite/:suiteName" element={<SuiteDetailPage />} />
      <Route
        path="/suite/:suiteName/playwright"
        element={<ReportDetailPage />}
      />
    </Routes>
  );
}
