import servicesData from "./services.json"

export interface Service {
    id: string
    title: string
    description: string
    fullDescription: string
    icon_name: string
    color_theme: string
    features: string[]
}

export const services: Service[] = servicesData

export function getServiceById(id: string): Service | undefined {
    return services.find((s) => s.id === id)
}
