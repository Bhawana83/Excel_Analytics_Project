import { ArrowRight, FileText, BarChart2, Cpu, DownloadCloud, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-100 via-sky-100 to-white font-sans text-slate-800">

      {/* Navbar */}
      <header className="md:fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-sky-700 bg-clip-text text-transparent select-none">
              Excel Analyzer
            </div>
            <nav className="hidden md:flex gap-4 ml-8 text-sm font-medium">
              {["features", "pricing", "contact"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="relative px-3 py-2 rounded-md hover:text-sky-600 transition text-slate-700 cursor-pointer"
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex ml-3 gap-4">
            <Link to="/login">
              <button className="px-5 py-2 rounded-lg border border-sky-700 text-sky-600 transition-all hover:scale-105 hover:bg-sky-700 hover:text-white font-medium cursor-pointer">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-medium flex items-center gap-1 cursor-pointer transition-all hover:scale-105">
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 md:pt-28">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Transform Excel into
              <span className="bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent"> actionable insights</span>
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Upload any Excel file, choose axes, visualize in 2D/3D, and
              download professional charts. Perfect for analysts, teams, and
              decision-makers.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/register">
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all flex items-center gap-2">
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-3 border border-cyan-600 text-cyan-600 rounded-lg font-semibold transition-all duration-200 hover:bg-sky-700 hover:text-white cursor-pointer hover:scale-105">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Text Info instead of Chart */}
          <div className="w-full lg:w-1/2 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-6 transition-all hover:scale-105">
            <h3 className="text-xl font-bold text-cyan-700 mb-4">Why Choose Excel Analyzer?</h3>
            <p className="text-slate-700 leading-relaxed">
              No more struggling with raw Excel sheets. Instantly parse, visualize, and analyze your data with intuitive charts and AI-powered insights. Everything is stored securely and can be exported for presentations or reporting. Experience a smarter, faster, and cleaner way to work with Excel.
            </p>
          </div>
        </div>

        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
            Core Capabilities
          </h2>
          <p className="mt-2 text-slate-700 max-w-xl mx-auto">
            Everything you need to go from raw Excel to polished visual insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[
            { icon: <FileText size={32} />, title: "Excel Upload", desc: "Drag & drop any .xls/.xlsx and instantly parse the contents." },
            { icon: <BarChart2 size={32} />, title: "2D/3D Charts", desc: "Select axes, types and get interactive visualizations." },
            { icon: <Cpu size={32} />, title: "AI Insights", desc: "Optional AI-powered summaries and anomaly detection." },
            { icon: <DownloadCloud size={32} />, title: "Export & Share", desc: "Download PNG/PDF charts or share reports with your team." },
          ].map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
            Pricing Plans
          </h2>
          <p className="mt-2 text-slate-700 max-w-xl mx-auto">
            Flexible plans for individuals, teams, and enterprises.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Free"
            price="$0"
            features={["Excel upload (limited)", "2D charts", "7-day history", "Community support"]}
            highlight={false}
          />
          <PricingCard
            title="Pro"
            price="$29"
            features={["Unlimited uploads", "2D + basic 3D charts", "Download PNG/PDF", "AI summaries", "Priority support"]}
            highlight={true}
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            features={["Team accounts", "Admin dashboard", "SLA & support", "Dedicated onboarding", "API access"]}
            highlight={false}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="mt-2 text-slate-700 max-w-xl mx-auto">
            Questions, feedback, or enterprise inquiries—drop a message and we’ll get back to you.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <ContactItem icon={<Mail size={22} className="text-cyan-600" />} title="Email" detail="support@excelanalyzer.io" />
            <ContactItem icon={<MessageSquare size={22} className="text-cyan-600" />} title="Message" detail="Fill the form and we’ll respond within 1 business day." />
          </div>
          <form className="bg-white rounded-2xl shadow p-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" type="text" placeholder="Your name" />
              <Input label="Email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows="4" placeholder="How can we help?" className="w-full border rounded-lg px-4 py-2 focus:outline-cyan-500" required />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-lg font-medium flex items-center gap-2 hover:scale-105 transition">
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-cyan-50 to-blue-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
              ExcelAnalyzer
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Analyze, visualize, and download insights from your Excel data.
            </p>
          </div>
          <div>
            <div className="font-medium mb-2">Product</div>
            <ul className="space-y-1 text-sm text-slate-600">
              <li><a className="hover:text-sky-600" href="#features">Features</a></li>
              <li><a className="hover:text-sky-600" href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Company</div>
            <ul className="space-y-1 text-sm text-slate-600">
              <li><a className="hover:text-sky-700" href="#">About</a></li>
              <li><a className="hover:text-sky-700" href="#">Careers</a></li>
              <li><a className="hover:text-sky-700" href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ExcelAnalyzer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* Reusable components */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all hover:scale-105">
      <div className="text-cyan-600 mb-2">{icon}</div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, features, highlight }) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-8 border ${highlight ? "border-cyan-600 shadow-xl" : "border-gray-200"} bg-white transition-all hover:scale-105`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-sky-700 text-white px-4 py-1 rounded-full text-xs font-semibold">
          Recommended
        </div>
      )}
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-4xl font-extrabold">{price}</div>
        <div className="text-sm text-slate-500">{title !== "Enterprise" ? "/ mo" : ""}</div>
      </div>
      <div className="mt-4 space-y-2 flex-1">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-cyan-500" />
            <div>{f}</div>
          </div>
        ))}
      </div>
      <button className={`mt-6 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${highlight ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white" : "border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white transition"}`}>
        {title === "Free" ? "Start Free" : title === "Enterprise" ? "Contact Sales" : "Get Started"} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function ContactItem({ icon, title, detail }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-cyan-50 rounded-lg">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-600">{detail}</div>
      </div>
    </div>
  );
}

function Input({ label, type, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full border rounded-lg px-4 py-2 focus:outline-cyan-500" required />
    </div>
  );
}








// import {
//   ArrowRight,
//   FileText,
//   BarChart2,
//   CheckCircle2,
//   Upload,
//   Mail,
//   MessageSquare,
//   Cpu,
//   DownloadCloud,
// } from "lucide-react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import { Link } from "react-router-dom";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// // Dummy chart data (Pie version with cyan & blue)
// const dummyData = {
//   labels: ["Sales", "Expenses"],
//   datasets: [
//     {
//       label: "Financial Overview",
//       data: [1260, 1010], // sum of monthly data or sample totals
//       backgroundColor: [
//         "rgba(37,99,235,0.8)", // blue
//         "rgba(8,145,178,0.8)", // cyan
//       ],
//       borderColor: [
//         "rgb(37,99,235)", // blue
//         "rgb(8,145,178)", // cyan
//       ],
//       borderWidth: 2,
//       hoverOffset: 12,
//     },
//   ],
// };



// export default function HomePage() {
//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-cyan-100 via-sky-100 to-white font-sans text-slate-800">
//       {/* Navbar */}
//       <header className="md:fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-sky-700 bg-clip-text text-transparent select-none">
//               Excel Analyzer
//             </div>
//             <nav className="hidden md:flex gap-4 ml-8 text-sm font-medium">
//               {["features", "pricing", "contact"].map((id) => (
//                 <a
//                   key={id}
//                   href={`#${id}`}
//                   className="relative px-3 py-2 rounded-md hover:text-sky-600 transition text-slate-700 cursor-pointer"
//                 >
//                   {id.charAt(0).toUpperCase() + id.slice(1)}
//                 </a>
//               ))}
//             </nav>
//           </div>
//           <div className="hidden md:flex ml-3 gap-4">
//             <Link to="/login">
//               <button className="px-5 py-2 rounded-lg border border-sky-700 text-sky-600 transition-all hover:scale-105 hover:bg-sky-700 hover:text-white font-medium cursor-pointer">
//                 Login
//               </button>
//             </Link>
//             <Link to="/register">
//               <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-medium flex items-center gap-1 cursor-pointer transition-all hover:scale-105">
//                 Get Started <ArrowRight size={16} />
//               </button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-20 md:pt-28">
//         <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
//           <div className="w-full lg:w-1/2">
//             <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
//               Turn Excel into{" "}
//               <span className="bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
//                 actionable insights
//               </span>
//             </h1>
//             <p className="mt-4 text-lg text-slate-600">
//               Upload any Excel file, choose axes, visualize in 2D/3D, and
//               download professional charts. Built for analysts, teams, and
//               decision-makers.
//             </p>
//             <div className="mt-8 flex gap-4 flex-wrap">
//               <Link to="/register">
//                 <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all flex items-center gap-2">
//                   Get Started
//                   <ArrowRight size={16} />
//                 </button>
//               </Link>
//               <Link to="/login">
//                 <button className="px-6 py-3 border border-cyan-600 text-cyan-600 rounded-lg font-semibold transition-all duration-200 hover:bg-sky-700 hover:text-white cursor-pointer hover:scale-105">
//                   Login
//                 </button>
//               </Link>
//             </div>
//           </div>

//           {/* Hero Chart Preview */}
//           <div className="w-full lg:w-1/2">
//             <div className="hidden md:block bg-white shadow-2xl rounded-2xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="text-sm font-medium text-slate-600">
//                   Monthly Overview
//                 </div>
//                 <div className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
//                   Live Preview
//                 </div>
//               </div>
//               <div className="h-64">
//                 <Line
//                   data={dummyData}
//                   options={{ responsive: true, plugins: { legend: { position: "top" } } }}
//                 />
//               </div>
//               <div className="mt-3 flex justify-between text-xs text-slate-500">
//                 <div>Data from uploaded Excel</div>
//                 <div>Updated just now</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Decorative gradient blobs */}
//         <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
//       </section>

//       {/* Features */}
//       <section id="features" className="max-w-7xl mx-auto px-6 py-28">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
//             Core Capabilities
//           </h2>
//           <p className="mt-2 text-slate-600 max-w-xl mx-auto">
//             Everything you need to go from raw Excel to polished visual
//             insight—fast, responsive, and intelligent.
//           </p>
//         </div>
//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//           <FeatureCard
//             icon={<FileText size={32} />}
//             title="Excel Upload"
//             description="Drag & drop any .xls/.xlsx and instantly parse the contents."
//           />
//           <FeatureCard
//             icon={<BarChart2 size={32} />}
//             title="2D/3D Charts"
//             description="Select axes, types and get interactive visualizations."
//           />
//           <FeatureCard
//             icon={<Cpu size={32} />}
//             title="AI Insights"
//             description="Optional AI-powered summaries and anomaly detection."
//           />
//           <FeatureCard
//             icon={<DownloadCloud size={32} />}
//             title="Export & Share"
//             description="Download PNG/PDF charts or share reports with your team."
//           />
//         </div>
//       </section>

//       {/* Pricing */}
//       <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
//             Pricing Plans
//           </h2>
//           <p className="mt-2 text-slate-600 max-w-xl mx-auto">
//             Flexible plans for individuals, teams, and enterprises. Start free
//             and scale up as you grow.
//           </p>
//         </div>
//         <div className="grid gap-8 md:grid-cols-3">
//           <PricingCard
//             title="Free"
//             price="$0"
//             features={["Excel upload (limited)", "2D charts", "7-day history", "Community support"]}
//             highlight={false}
//           />
//           <PricingCard
//             title="Pro"
//             price="$29"
//             features={[
//               "Unlimited uploads",
//               "2D + basic 3D charts",
//               "Download PNG/PDF",
//               "AI summaries",
//               "Priority email support",
//             ]}
//             highlight={true}
//           />
//           <PricingCard
//             title="Enterprise"
//             price="Custom"
//             features={[
//               "Team accounts",
//               "Admin dashboard",
//               "SLA & support",
//               "Dedicated onboarding",
//               "API access",
//             ]}
//             highlight={false}
//           />
//         </div>
//       </section>

//       {/* Contact */}
//       <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
//             Get in Touch
//           </h2>
//           <p className="mt-2 text-slate-600 max-w-xl mx-auto">
//             Questions, feedback, or enterprise inquiries—drop a message and
//             we’ll get back to you.
//           </p>
//         </div>
//         <div className="grid gap-12 lg:grid-cols-2">
//           <div className="space-y-6">
//             <ContactItem
//               icon={<Mail size={22} className="text-cyan-600" />}
//               title="Email"
//               detail="support@excelanalyzer.io"
//             />
//             <ContactItem
//               icon={<MessageSquare size={22} className="text-cyan-600" />}
//               title="Message"
//               detail="Fill the form and we’ll respond within 1 business day."
//             />
//           </div>
//           <form className="bg-white rounded-2xl shadow p-8 space-y-5">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <Input label="Name" type="text" placeholder="Your name" />
//               <Input label="Email" type="email" placeholder="you@example.com" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Message</label>
//               <textarea
//                 rows="4"
//                 placeholder="How can we help?"
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-cyan-500"
//                 required
//               />
//             </div>
//             <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-lg font-medium flex items-center gap-2 hover:scale-105 transition">
//               Send Message <ArrowRight size={16} />
//             </button>
//           </form>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="mt-20 bg-gradient-to-r from-cyan-50 to-blue-50 border-t">
//         <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
//               ExcelAnalyzer
//             </div>
//             <p className="mt-2 text-sm text-slate-600">
//               Analyze, visualize, and download insights from your Excel data—no
//               installs, no complexity.
//             </p>
//           </div>
//           <div>
//             <div className="font-medium mb-2">Product</div>
//             <ul className="space-y-1 text-sm text-slate-600">
//               <li><a className="hover:text-sky-600" href="#features">Features</a></li>
//               <li><a className="hover:text-sky-600" href="#pricing">Pricing</a></li>
//             </ul>
//           </div>
//           <div>
//             <div className="font-medium mb-2">Company</div>
//             <ul className="space-y-1 text-sm text-slate-600">
//               <li><a className="hover:text-sky-700" href="#">About</a></li>
//               <li><a className="hover:text-sky-700" href="#">Careers</a></li>
//               <li><a className="hover:text-sky-700" href="#">Contact</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="border-t pt-6 text-center text-xs text-slate-500">
//           © {new Date().getFullYear()} ExcelAnalyzer. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* Reusable components */

// function FeatureCard({ icon, title, description }) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all hover:scale-105">
//       <div className="text-cyan-600">{icon}</div>
//       <h4 className="text-lg font-semibold">{title}</h4>
//       <p className="text-sm text-slate-600">{description}</p>
//     </div>
//   );
// }

// function PricingCard({ title, price, features, highlight }) {
//   return (
//     <div
//       className={`relative flex flex-col rounded-2xl p-8 border ${
//         highlight ? "border-cyan-600 shadow-xl" : "border-gray-200"
//       } bg-white`}
//     >
//       {highlight && (
//         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-sky-700 text-white px-4 py-1 rounded-full text-xs font-semibold">
//           Recommended
//         </div>
//       )}
//       <div className="text-xl font-bold">{title}</div>
//       <div className="mt-2 flex items-baseline gap-2">
//         <div className="text-4xl font-extrabold">{price}</div>
//         <div className="text-sm text-slate-500">
//           {title !== "Enterprise" ? "/ mo" : ""}
//         </div>
//       </div>
//       <div className="mt-4 space-y-2 flex-1">
//         {features.map((f) => (
//           <div key={f} className="flex items-center gap-2 text-sm">
//             <CheckCircle2 size={16} className="text-cyan-500" />
//             <div>{f}</div>
//           </div>
//         ))}
//       </div>
//       <button
//         className={`mt-6 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
//           highlight
//             ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white"
//             : "border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
//         }`}
//       >
//         {title === "Free"
//           ? "Start Free"
//           : title === "Enterprise"
//           ? "Contact Sales"
//           : "Get Started"}{" "}
//         <ArrowRight size={16} />
//       </button>
//     </div>
//   );
// }

// function ContactItem({ icon, title, detail }) {
//   return (
//     <div className="flex items-start gap-4">
//       <div className="p-3 bg-cyan-50 rounded-lg">{icon}</div>
//       <div>
//         <div className="font-semibold">{title}</div>
//         <div className="text-sm text-slate-600">{detail}</div>
//       </div>
//     </div>
//   );
// }

// function Input({ label, type, placeholder }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium mb-1">{label}</label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         className="w-full border rounded-lg px-4 py-2 focus:outline-cyan-500"
//         required
//       />
//     </div>
//   );
// }
