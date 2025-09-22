import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useState } from "react";

const Input = ({ icon: Icon, type, children, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative mb-6">
      {/* Left-side icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 z-1 text-green-500" />
      </div>

      {/* Input field */}
      {/* Modified Input: support select type */}
      {type === "select" ? ( // ✅ Green Highlight: check for select type
        <div className="relative">
          <select
            {...props}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700
                 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white appearance-none"
          >
            {children}
          </select>

          {/* Custom right-side arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
            <ChevronDown className="size-5 text-gray-400" />
          </div>
        </div>
      ) : (
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type} name=""
          {...props}

          //🔴 HIGHLIGHT: only apply for email fields 
          {...(type === "email"
            ? { autoComplete: "email", name: "email" }
            : {})}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition-all duration-200"
        />
      )}

      {/* Right-side toggle icon for password */}
      {isPassword && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-white"
          onClick={toggleShowPassword}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      )}
    </div>
  );
};

export default Input;

// const Input = ({ icon: Icon, ...props }) => {
//   return (
//     <div className="relative mb-6">
//       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//         <Icon className="size-5 text-green-500" />
//       </div>
//       <input
//         {...props}
//         className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500
//       text-white placeholder-gray-400 transition-all duration-200"
//       />

//     </div>
//   );
// };

// export default Input;
