import * as React from "react"
import { TopClientsCard, TopClientsCardHeader, TopClientItem } from "../../../components/ui/top-clients-card"

interface ClientInfo {
  colorClass: string
  initials: string
  name: string
  email: string
  revenue: string
}

interface TopClientsProps {
  clients?: ClientInfo[]
  header?: string
}

const defaultClients: ClientInfo[] = [
  { colorClass: "bg-chart-1", initials: "AC", name: "Acme Corp", email: "acme@corp.com", revenue: "€3,200" },
  { colorClass: "bg-chart-2", initials: "BS", name: "Beta SARL", email: "contact@beta.fr", revenue: "€2,800" },
  { colorClass: "bg-chart-3", initials: "GS", name: "Gamma SAS", email: "hello@gamma.com", revenue: "€2,100" },
]

const TopClients: React.FC<TopClientsProps> = ({ clients = defaultClients, header = "Top Clients" }) => (
  <TopClientsCard>
    <TopClientsCardHeader>{header}</TopClientsCardHeader>
    {clients.map((c, idx) => (
      <TopClientItem key={idx} colorClass={c.colorClass} initials={c.initials} name={c.name} email={c.email} revenue={c.revenue} />
    ))}
  </TopClientsCard>
)

export default TopClients 