import Link from "next/link";
import { navigation, site } from "@/config/site";
import { hoursDisplay } from "@/content/hours";
export function Footer() { return <footer className="footer"><div className="footer-mark">N</div><div><p className="eyebrow">Namak · Dallas</p><h2>Come hungry.<br/><em>Leave glowing.</em></h2></div><div><h3>Explore</h3>{navigation.map(x=><Link key={x.href} href={x.href}>{x.label}</Link>)}<Link href="/contact">Contact</Link></div><div><h3>Visit</h3><address>{site.address.street}<br/>{site.address.city}, {site.address.region} {site.address.postalCode}</address><a href={site.phoneHref}>{site.phone}</a>{hoursDisplay.map(x=><p key={x.days}>{x.days}<br/>{x.hours}</p>)}</div></footer> }
