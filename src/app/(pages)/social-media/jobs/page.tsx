'use client';
import { withAuth } from "@/app/hoc/withAuth";
import { CommunityLayout } from "../components/CommunityLayout";
import { InputComponent } from "@/app/component/customInput/Input";
import { BsSearch } from "react-icons/bs";
import CustomButton from "@/app/component/customButton/button";
import { JobItem } from "./components/JobItem";


function JobsPage() {

    return <CommunityLayout>
        <div className="p-4 space-y-4">

            <div className="flex items-center  gap-4">
                <h1 className="text-2xl font-bold">Jobs <span className="font-normal text-[#667085]">
                    500
                </span></h1>

                <div className="flex-1">
                    <InputComponent
                        label=""
                        name="search"
                        type="text"
                        placeholder="Search"
                        prefix={<BsSearch />}
                        field={{

                        }}
                    />
                </div>

                <CustomButton
                    text="Post Job"
                    className="w-fit"
                />
            </div>

            <div className="grid grid-cols-1  gap-4">
                <JobItem />
                <JobItem />
                <JobItem />
                <JobItem />
            </div>
        </div>
    </CommunityLayout>;
}

export default withAuth(JobsPage);
