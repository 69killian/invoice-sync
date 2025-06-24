import * as React from "react"
import { RecentActivityCard, RecentActivityCardHeader, RecentActivityItem } from "../../../components/ui/recent-activity-card"
import { useActivities } from "../../activities/hooks/useActivities"
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface RecentActivityProps {
  header?: string
}

const getActivityDetails = (type: string, entityName: string) => {
  const [entity, action] = type.split('_')
  let title = ''
  
  switch (action) {
    case 'created':
      title = 'Création'
      break
    case 'updated':
      title = 'Modification'
      break
    case 'deleted':
      title = 'Suppression'
      break
    default:
      title = 'Action'
  }
  
  switch (entity) {
    case 'invoice':
      return {
        bulletClass: 'bg-chart-1',
        title: `${title} de facture`,
        description: entityName
      }
    case 'client':
      return {
        bulletClass: 'bg-chart-2',
        title: `${title} de client`,
        description: entityName
      }
    case 'service':
      return {
        bulletClass: 'bg-chart-3',
        title: `${title} de service`,
        description: entityName
      }
    default:
      return {
        bulletClass: 'bg-gray-400',
        title: `${title}`,
        description: entityName
      }
  }
}

const RecentActivity: React.FC<RecentActivityProps> = ({ header = "Activités récentes" }) => {
  const { data: activities, isLoading } = useActivities()

  if (isLoading) {
    return (
      <RecentActivityCard>
        <RecentActivityCardHeader>{header}</RecentActivityCardHeader>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </RecentActivityCard>
    )
  }

  // Filter out user activities and get the 3 most recent
  const recentActivities = activities
    ?.filter(activity => !activity.type.startsWith('user_'))
    ?.slice(0, 3) || []

  return (
    <RecentActivityCard>
      <RecentActivityCardHeader>{header}</RecentActivityCardHeader>
      {recentActivities.map((activity) => {
        const { bulletClass, title, description } = getActivityDetails(activity.type, activity.entityName)
        const time = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: fr })
        
        return (
          <RecentActivityItem
            key={activity.id}
            bulletClass={bulletClass}
            title={title}
            description={description}
            time={time}
          />
        )
      })}
    </RecentActivityCard>
  )
}

export default RecentActivity