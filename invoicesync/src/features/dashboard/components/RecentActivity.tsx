import * as React from "react"
import { RecentActivityCard, RecentActivityCardHeader, RecentActivityItem } from "../../../components/ui/recent-activity-card"

interface Activity {
  bulletClass: string
  title: string
  description: string
  time: string
}

interface RecentActivityProps {
  activities?: Activity[]
  header?: string
}

const defaultActivities: Activity[] = [
  { bulletClass: "bg-chart-1", title: "New invoice created", description: "Invoice #INV-001 for Acme Corp", time: "2m ago" },
  { bulletClass: "bg-chart-2", title: "Payment received", description: "$2,500 from Beta SARL", time: "1h ago" },
  { bulletClass: "bg-chart-3", title: "New client added", description: "Gamma SAS joined", time: "3h ago" },
]

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = defaultActivities, header = "Recent Activity" }) => (
  <RecentActivityCard>
    <RecentActivityCardHeader>{header}</RecentActivityCardHeader>
    {activities.map((a, idx) => (
      <RecentActivityItem key={idx} bulletClass={a.bulletClass} title={a.title} description={a.description} time={a.time} />
    ))}
  </RecentActivityCard>
)

export default RecentActivity 