import { integrations } from "@/config/integrations";
export const getOrderAction = () =>
  integrations.ordering.url
    ? { available: true, href: integrations.ordering.url, label: "Order" }
    : { available: false, href: undefined, label: "Order" };
