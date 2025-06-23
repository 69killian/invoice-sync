import * as React from "react"
import { TopClientsCard, TopClientsCardHeader, TopClientItem } from "../../../components/ui/top-clients-card"

interface Client {
  id: number
  name: string
  email: string
  revenue: string
}

type ClientsTopClientsProps = {
  clients: Client[]
  header?: string
  top?: number
}

const ClientsTopClients: React.FC<ClientsTopClientsProps> = ({ clients, header = "Top Clients", top = 3 }) => {
  const topList = clients
    .slice()
    .sort((a, b) => {
      const revA = parseFloat(a.revenue.replace(/[^\d.-]/g, '').replace(',', '.')) || 0
      const revB = parseFloat(b.revenue.replace(/[^\d.-]/g, '').replace(',', '.')) || 0
      return revB - revA
    })
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
          email={c.email}
          revenue={c.revenue}
        />
      ))}
    </TopClientsCard>
  )
}

export default ClientsTopClients 