import { useContext } from "react";
import Navbar from "./Navbar";
import Sidemenu from "./Sidemenu";
import { UserContext } from "../../context/userContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Layout Content */}
      {user && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="max-[1080px]:hidden bg-gradient-to-b from-cyan-600 to-blue-700 text-white shadow-lg">
            <Sidemenu activeMenu={activeMenu} />
          </div>

          {/* Main Content */}
          <div
            className="grow mx-5 my-6 p-6 rounded-2xl 
            bg-white shadow-md shadow-cyan-100 border border-cyan-100"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;









// {/** import { Children, useContext } from "react"; */}
// import { useContext } from "react";
// // import { UserContext } from "../../context/userContext";
// import Navbar from "./Navbar";
// import Sidemenu from "./Sidemenu";
// import { UserContext } from "../../context/userContext";

// // import { Bold } from "lucide-react";

// const DashboardLayout = ({ children, activeMenu }) => {
//   const { user } = useContext(UserContext);  

//   return (
//     <div>
//       <Navbar activeMenu={activeMenu}/>
      
//       {/* {user && ( */} {/* esko baad me shi krna user fetch na hone par sidemenu default show nhi ho rha */}
//       { 
//         user && 
//       (
//         <div className="flex">
//           <div className="max-[1080px]:hidden">
//             <Sidemenu activeMenu={activeMenu} />
//           </div>

//           <div className="grow mx-5">{children}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardLayout;
