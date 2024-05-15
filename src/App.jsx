import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./Pages/Home/Home";
import Blog from "./Pages/blog/Blog";
import AllBlogs from "./Pages/allBlogs/AllBlog";
import BlogInfo from "./Pages/blogInfo/BlogInfo";
import AdminLogin from "./Pages/admin/adminLogin/AdminLogin";
import Dashboard from "./Pages/admin/dashboard/Dashboard";
import NoPage from "./Pages/noPage/NoPage";
import MyState from "./context/data/myState";
import { Toaster } from "react-hot-toast";
import CreateBlog from "./Pages/admin/createBlog/CreateBlog";

function App() {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/allblogs" element={<AllBlogs />} />
          <Route path="/bloginfo/:id" element={<BlogInfo />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <AdminProcted>
                <Dashboard />
              </AdminProcted>
            }
          />
          <Route
            path="/createblog"
            element={
              <AdminProcted>
                <CreateBlog />
              </AdminProcted>
            }
          />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <Toaster />
      </Router>
    </MyState>
  );
}

export default App;

export const AdminProcted =  ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (admin?.user?.email === "kaushalkumar02918@gmail.com") {
    return children;
  } else {
    return <Navigate to={"/adminlogin"} />;
  }
};
