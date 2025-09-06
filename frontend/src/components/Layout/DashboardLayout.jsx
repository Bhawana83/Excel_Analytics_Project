{/** import { Children, useContext } from "react"; */}
import { useContext } from "react";
// import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import Sidemenu from "./Sidemenu";
import { UserContext } from "../../context/userContext";

// import { Bold } from "lucide-react";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);  

  return (
    <div>
      <Navbar activeMenu={activeMenu}/>
      
      {/* {user && ( */} {/* esko baad me shi krna user fetch na hone par sidemenu default show nhi ho rha */}
      { 
        user && 
      (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <Sidemenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
