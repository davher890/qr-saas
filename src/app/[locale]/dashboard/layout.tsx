import type { ReactNode } from "react"
import DashboardHeader from "@/components/DashboardHeader"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="p-6">
            <DashboardHeader />
            {children}
        </div>
    )
}

