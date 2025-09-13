'use client';
import { withAuth } from "@/app/hoc/withAuth"
import { CommunityLayout } from "../components/CommunityLayout"
import { CoWorkerCard } from "./components/CoWorkerCard";
import { InputComponent } from "@/app/component/customInput/Input";
import { CiSearch } from "react-icons/ci";



function CoworkersPage() {
    return <CommunityLayout>
        <div className="space-y-5">

            <InputComponent
                label=""
                placeholder="Search Coworkers"
                name="search"
                type="text"
                prefix={<CiSearch />}
            />
            <div className="grid p-3 grid-cols-3 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CoWorkerCard key={index} />
                ))}
            </div>
        </div>
    </CommunityLayout>
}

export default withAuth(CoworkersPage);