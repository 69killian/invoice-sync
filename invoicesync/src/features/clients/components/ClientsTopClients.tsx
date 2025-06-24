import * as React from "react"
import { TopClientsCard, TopClientsCardHeader, TopClientItem } from "../../../components/ui/top-clients-card"
import type { Client } from "../types"

type ClientsTopClientsProps = {
  clients: Client[]
  header?: string
  top?: number
}

const ClientsTopClients: React.FC<ClientsTopClientsProps> = ({ clients, header = "Top Clients", top = 3 }) => {
  const topList = clients
    .slice()
    .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
    .slice(0, top)

  return (
    <TopClientsCard>
      <TopClientsCardHeader>{header}</TopClientsCardHeader>
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

export default ClientsTopClients 