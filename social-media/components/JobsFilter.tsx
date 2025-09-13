"use client"

import { cn } from "@/app/utils/utils"
import * as React from "react"
import { BsChevronDown } from "react-icons/bs"

export function JobsFilter() {
  const [salaryPeriod, setSalaryPeriod] = React.useState<"hourly" | "monthly" | "yearly">("yearly")
  const [locationOption, setLocationOption] = React.useState<string>("remote")
  const [salaryOption, setSalaryOption] = React.useState<string>("any")
  const [dateOption, setDateOption] = React.useState<string>("all")
  const [experienceOption, setExperienceOption] = React.useState<string>("any")
  const [employmentTypes, setEmploymentTypes] = React.useState<string[]>(["full-time"])

  const handleEmploymentTypeChange = (value: string) => {
    if (employmentTypes.includes(value)) {
      setEmploymentTypes(employmentTypes.filter((type) => type !== value))
    } else {
      setEmploymentTypes([...employmentTypes, value])
    }
  }

  return (
    <div className="w-full bg-white rounded-lg border border-[#d0d5dd] p-4">
      <h1 className="text-2xl font-bold text-[#141414] mb-6">Filters</h1>

      {/* Area */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Area</h2>
        <button className="w-full flex items-center justify-between px-4 py-2.5 border border-[#d0d5dd] rounded-lg text-[#98a2b3]">
          <span>Select area</span>
          <BsChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Location</h2>
        <div className="space-y-2">
          <RadioOption
            id="near-me"
            name="location"
            value="near-me"
            label="Near me"
            checked={locationOption === "near-me"}
            onChange={() => setLocationOption("near-me")}
          />
          <RadioOption
            id="remote"
            name="location"
            value="remote"
            label="Remote job"
            checked={locationOption === "remote"}
            onChange={() => setLocationOption("remote")}
          />
          <RadioOption
            id="exact"
            name="location"
            value="exact"
            label="Exact location"
            checked={locationOption === "exact"}
            onChange={() => setLocationOption("exact")}
          />
          <RadioOption
            id="within-15"
            name="location"
            value="within-15"
            label="Within 15 km"
            checked={locationOption === "within-15"}
            onChange={() => setLocationOption("within-15")}
          />
          <RadioOption
            id="within-30"
            name="location"
            value="within-30"
            label="Within 30 km"
            checked={locationOption === "within-30"}
            onChange={() => setLocationOption("within-30")}
          />
          <RadioOption
            id="within-50"
            name="location"
            value="within-50"
            label="Within 50 km"
            checked={locationOption === "within-50"}
            onChange={() => setLocationOption("within-50")}
          />
        </div>
      </div>

      {/* Salary */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Salary</h2>
        <div className="flex border border-[#d0d5dd] rounded-lg text-xs mb-4 overflow-hidden">
          <button
            className={cn(
              "flex-1 py-2 text-center",
              salaryPeriod === "hourly" ? "bg-[#3575e2]/10 text-[#3575e2]" : "bg-white text-[#475467]",
            )}
            onClick={() => setSalaryPeriod("hourly")}
          >
            Hourly
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-center border-l border-r border-[#d0d5dd]",
              salaryPeriod === "monthly" ? "bg-[#3575e2]/10 text-[#3575e2]" : "bg-white text-[#475467]",
            )}
            onClick={() => setSalaryPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-center",
              salaryPeriod === "yearly" ? "bg-[#3575e2]/10 text-[#3575e2]" : "bg-white text-[#475467]",
            )}
            onClick={() => setSalaryPeriod("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="space-y-2">
          <RadioOption
            id="any-salary"
            name="salary"
            value="any"
            label="Any"
            checked={salaryOption === "any"}
            onChange={() => setSalaryOption("any")}
          />
          <RadioOption
            id="300k"
            name="salary"
            value="300k"
            label="> 300000k"
            checked={salaryOption === "300k"}
            onChange={() => setSalaryOption("300k")}
          />
          <RadioOption
            id="500k"
            name="salary"
            value="500k"
            label="> 500000k"
            checked={salaryOption === "500k"}
            onChange={() => setSalaryOption("500k")}
          />
          <RadioOption
            id="800k"
            name="salary"
            value="800k"
            label="> 800000k"
            checked={salaryOption === "800k"}
            onChange={() => setSalaryOption("800k")}
          />
          <RadioOption
            id="1000k"
            name="salary"
            value="1000k"
            label="> 100000k"
            checked={salaryOption === "1000k"}
            onChange={() => setSalaryOption("1000k")}
          />
        </div>
      </div>

      {/* Date of posting */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Date of posting</h2>
        <div className="space-y-2">
          <RadioOption
            id="all-time"
            name="date"
            value="all"
            label="All time"
            checked={dateOption === "all"}
            onChange={() => setDateOption("all")}
          />
          <RadioOption
            id="24-hours"
            name="date"
            value="24h"
            label="Last 24 hours"
            checked={dateOption === "24h"}
            onChange={() => setDateOption("24h")}
          />
          <RadioOption
            id="3-days"
            name="date"
            value="3d"
            label="Last 3 days"
            checked={dateOption === "3d"}
            onChange={() => setDateOption("3d")}
          />
          <RadioOption
            id="7-days"
            name="date"
            value="7d"
            label="Last 7 days"
            checked={dateOption === "7d"}
            onChange={() => setDateOption("7d")}
          />
        </div>
      </div>

      {/* Work experience */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Work experience</h2>
        <div className="space-y-2">
          <RadioOption
            id="any-exp"
            name="experience"
            value="any"
            label="Any experience"
            checked={experienceOption === "any"}
            onChange={() => setExperienceOption("any")}
          />
          <RadioOption
            id="internship"
            name="experience"
            value="internship"
            label="Intership"
            checked={experienceOption === "internship"}
            onChange={() => setExperienceOption("internship")}
          />
          <RadioOption
            id="remote-work"
            name="experience"
            value="remote"
            label="Work remotely"
            checked={experienceOption === "remote"}
            onChange={() => setExperienceOption("remote")}
          />
        </div>
      </div>

      {/* Type of employment */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Type of employment</h2>
        <div className="space-y-2">
          <CheckboxOption
            id="full-time"
            value="full-time"
            label="Full-time"
            checked={employmentTypes.includes("full-time")}
            onChange={() => handleEmploymentTypeChange("full-time")}
          />
          <CheckboxOption
            id="temporary"
            value="temporary"
            label="Temporary"
            checked={employmentTypes.includes("temporary")}
            onChange={() => handleEmploymentTypeChange("temporary")}
          />
          <CheckboxOption
            id="part-time"
            value="part-time"
            label="Part-time"
            checked={employmentTypes.includes("part-time")}
            onChange={() => handleEmploymentTypeChange("part-time")}
          />
        </div>
      </div>
    </div>
  )
}

interface RadioOptionProps {
  id: string
  name: string
  value: string
  label: string
  checked: boolean
  onChange: () => void
}

function RadioOption({ id, name, value, label, checked, onChange }: RadioOptionProps) {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={cn("h-5 w-5 rounded-full border", checked ? "border-[#007ab6]" : "border-[#d0d5dd]")}>
          {checked && (
            <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007ab6]" />
          )}
        </div>
      </div>
      <span className="text-[#475467]">{label}</span>
    </label>
  )
}

interface CheckboxOptionProps {
  id: string
  value: string
  label: string
  checked: boolean
  onChange: () => void
}

function CheckboxOption({ id, value, label, checked, onChange }: CheckboxOptionProps) {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <div className="relative flex items-center justify-center">
        <input type="checkbox" id={id} value={value} checked={checked} onChange={onChange} className="sr-only" />
        <div
          className={cn(
            "h-5 w-5 rounded border",
            checked ? "border-[#007ab6] bg-[#007ab6]" : "border-[#d0d5dd] bg-white",
          )}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[#475467]">{label}</span>
    </label>
  )
}
