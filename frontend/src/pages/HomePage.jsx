import {
  ArrowRight,
  FileText,
  BarChart2,
  PieChart,
  CheckCircle2,
  Upload,
  Mail,
  MessageSquare,
  Cpu,
  DownloadCloud,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
{
  /**import DashboardLayout from "../components/Layouts/DashboardLayout"; */
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Combined green (emerald) and yellow (amber) themed chart data
const dummyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      data: [120, 190, 170, 220, 260, 300],
      tension: 0.4,
      borderWidth: 3,
      fill: true,
      backgroundColor: "rgba(16,185,129,0.15)", // emerald light
      borderColor: "rgb(5,150,105)", // darker emerald
      pointBackgroundColor: "rgb(5,150,105)",
    },
    {
      label: "Expenses",
      data: [90, 150, 130, 180, 210, 250],
      tension: 0.4,
      borderWidth: 3,
      fill: true,
      backgroundColor: "rgba(250,204,21,0.15)", // amber light
      borderColor: "rgb(245,158,11)", // amber
      pointBackgroundColor: "rgb(245,158,11)",
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-emerald-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="md:fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-emerald-700 select-none">
              Excel Analyzer
            </div>
            <nav className="hidden md:flex gap-4 ml-8 text-sm font-medium">
              {["features", "pricing", "contact"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="relative px-3 py-2 rounded-md hover:text-emerald-600 transition text-slate-800 cursor-pointer"
                  aria-label={id}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                  <span className="absolute inset-0" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex ml-3 gap-4">
            <Link to="/login">
              <button
                className="px-2 md:px-5 md:py-2 rounded-lg border border-emerald-700 text-emerald-700 transition-all hover:scale-105 duration-200 hover:bg-emerald-700 hover:text-white font-medium cursor-pointer"
                aria-label="Login"
              >
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                className="px-5 py-2 rounded-lg bg-emerald-700 text-white hover:shadow-lg font-medium flex items-center gap-1 cursor-pointer transition-all hover:bg-emerald-700 duration-200 hover:scale-105"
                aria-label="Get Started"
              >
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 mt-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h1 className="mt-[-80px] md:m-0 text-4xl sm:text-5xl font-extrabold leading-tight">
              Turn Excel into{" "}
              <span className="text-emerald-700">actionable insights</span>
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Upload any Excel file, choose axes, visualize in 2D/3D, and
              download professional charts. Built for analysts, teams, and
              decision-makers.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/register">
                <button className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold shadow hover:brightness-105 flex items-center gap-2 cursor-pointer hover:bg-emerald-700 duration-200 transition-all hover:scale-105">
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-3 border border-emerald-700 text-emerald-700 rounded-lg font-semibold transition-all duration-200 hover:bg-emerald-700 hover:text-white cursor-pointer hover:scale-105">
                  Login
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="hidden md:block bg-white shadow-2xl rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Monthly Overview</div>
                <div className="text-xs px-2 py-1 bg-amber-100 rounded-full">
                  Live Preview
                </div>
              </div>
              <div className="h-64">
                <Line
                  data={dummyData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                  aria-label="Sales vs Expenses chart"
                  role="img"
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <div>Data from uploaded Excel</div>
                <div>Updated just now</div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Core Capabilities</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Everything you need to go from raw Excel to polished visual
            insight—fast, responsive, and intelligent.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<FileText size={32} />}
            title="Excel Upload"
            description="Drag & drop any .xls/.xlsx and instantly parse the contents."
          />
          <FeatureCard
            icon={<BarChart2 size={32} />}
            title="2D/3D Charts"
            description="Select axes, types and get interactive visualizations."
          />
          <FeatureCard
            icon={<Cpu size={32} />}
            title="AI Insights"
            description="Optional AI-powered summaries and anomaly detection."
          />
          <FeatureCard
            icon={<DownloadCloud size={32} />}
            title="Export & Share"
            description="Download PNG/PDF charts or share reports with your team."
          />
        </div>
      </section>

      {/* Chart preview panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6 m-2 md:m-10">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Demo Chart</div>
          <div className="flex gap-2">
            <button className="text-xs px-2 py-1 bg-emerald-100 rounded-full">
              Bar
            </button>
            <button className="text-xs px-2 py-1 bg-slate-100 rounded-full">
              Line
            </button>
          </div>
        </div>
        <div className="h-60 flex justify-center">
          <Line
            data={dummyData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              interaction: { mode: "index", intersect: false },
            }}
            aria-label="Demo sales vs expenses"
            role="img"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-slate-600">
            Mapping: X=Month, Y=Revenue/Cost
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-2 border rounded-lg hover:bg-slate-50 flex items-center gap-1">
              Export PNG <DownloadCloud size={14} />
            </button>
            <button className="text-xs px-3 py-2 border rounded-lg hover:bg-slate-50 flex items-center gap-1">
              Export PDF <DownloadCloud size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Pricing Plans</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Flexible plans for individuals, teams, and enterprises. Start free
            and scale up as you grow.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <PricingCard
            title="Free"
            price="$0"
            features={[
              "Excel upload (limited)",
              "2D charts",
              "7-day history",
              "Community support",
            ]}
            highlight={false}
          />
          <PricingCard
            title="Pro"
            price="$29"
            features={[
              "Unlimited uploads",
              "2D + basic 3D charts",
              "Download PNG/PDF",
              "AI summaries",
              "Priority email support",
            ]}
            highlight={true}
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            features={[
              "Team accounts",
              "Admin dashboard",
              "SLA & support",
              "Dedicated onboarding",
              "API access",
            ]}
            highlight={false}
          />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Questions, feedback, or enterprise inquiries—drop a message and
            we’ll get back to you.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Mail size={22} className="text-emerald-700" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-slate-600">
                  support@excelanalyzer.io
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <MessageSquare size={22} className="text-emerald-700" />
              </div>
              <div>
                <div className="font-semibold">Message</div>
                <div className="text-sm text-slate-600">
                  Fill the form and we’ll respond within 1 business day.
                </div>
              </div>
            </div>
          </div>
          <form className="bg-white rounded-2xl shadow p-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-emerald-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="How can we help?"
                className="w-full border rounded-lg px-4 py-2 focus:outline-emerald-500"
                required
              />
            </div>
            <button className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2">
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-bold text-emerald-600">
              ExcelAnalyzer
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Analyze, visualize, and download insights from your Excel data—no
              installs, no complexity.
            </p>
          </div>
          <div>
            <div className="font-medium mb-2">Product</div>
            <ul className="space-y-1 text-sm">
              <li>
                <a className="hover:underline" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pricing">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Company</div>
            <ul className="space-y-1 text-sm">
              <li>
                <a className="hover:underline" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  Contact
                </a>
              </li>
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow flex flex-col gap-4 hover:scale-105 transition-all duration-300">
      <div className="text-emerald-600">{icon}</div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm text-slate-600 flex-1">{description}</p>
      
    </div>
  );
}

function PricingCard({ title, price, features, highlight }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 border ${
        highlight ? "border-emerald-600 shadow-2xl" : "border-gray-200"
      } bg-white`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
          Recommended
        </div>
      )}
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-4xl font-extrabold">{price}</div>
        <div className="text-sm text-slate-500">
          {title !== "Enterprise" ? "/ mo" : ""}
        </div>
      </div>
      <div className="mt-4 space-y-2 flex-1">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <div>{f}</div>
          </div>
        ))}
      </div>
      <button
        className={`mt-6 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
          highlight
            ? "bg-emerald-600 text-white"
            : "border border-emerald-600 text-emerald-600"
        }`}
      >
        {title === "Free"
          ? "Start Free"
          : title === "Enterprise"
          ? "Contact Sales"
          : "Get Started"}{" "}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}





















{
  /** 
import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

// jhan function ke sath hee export likhe na whan curly brackets me import kra kr jaise yan
export const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
        <Navbar/>
        <Header/>
    </div>
  )
 
}
  
{
  /**
  import React from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-2 sm:px-20 absolute top-0'>
        <img src={assets.images_png} alt='' className='w-0.5 sm:w-16'/>

        <button onClick={()=>navigate('/login')}
        className='flex items-center gap-2 border border-green-900 rounded-full px-6 py-2 text-black hover:bg-teal-700 cursor-pointer'>Login</button>
    </div>
  )
}

export default Navbar;


import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
 const Header = () => {
 const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-950'>
        <img src={assets.header_img} alt='' className='w-36 h36 rounded-full mb-6'/>

        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer <img className='w-8 aspect-square' src={assets.hand_wave} alt=''/></h1>

        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our Excel App</h2>

        <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time!!</p>

        <button onClick={()=>navigate ('/register')}
        className='border border-green-900 rounded-full px-8 py-2.5 hover:bg-teal-700 transition-all cursor-pointer'>Get Started</button>
        

    </div>
  )
}

<div className="mt-2 flex items-center text-emerald-600 font-medium text-sm">
        Learn more <ArrowRight size={14} className="ml-1" />
      </div>


export default Header;

  */
}
