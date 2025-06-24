import * as React from "react"
import { TopClientsCard, TopClientsCardHeader, TopClientItem } from "../../../components/ui/top-clients-card"
import { useClients } from "../../clients/hooks/useClients"

const TopClients: React.FC = () => {
  const { data: clients = [] } = useClients();

  const topList = clients
    .slice()
    .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
    .slice(0, 3)

  return (
    <TopClientsCard>
      <TopClientsCardHeader>Top Clients</TopClientsCardHeader>
      {topList.map((c, idx) => (
        <TopClientItem
          key={c.id}
          colorClass={`bg-chart-${idx + 1}`}
          initials={c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          name={c.name}
          email={c.email ?? ''}
          revenue={`${c.totalRevenue.toLocaleString('fr-FR')} €`}
        />
      ))}
    </TopClientsCard>
  )
}

export default TopClients 