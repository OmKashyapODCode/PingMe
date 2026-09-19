import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar sticks to top while page scrolls */}
      {showSidebar && <Sidebar />}

      {/* Main content area grows and scrolls naturally */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
export default Layout;