import { BreadCrumb } from "primereact/breadcrumb";
import { useAppBreadcrumb } from "../hooks/useAppBreadcrumb";
import { MenuItem } from "primereact/menuitem";
import { NavLink } from "react-router-dom";

export function AppBreadcrumb() {
    const { breadcrumb } = useAppBreadcrumb()

    const items: MenuItem[] = breadcrumb.map((b, i) => ({ label: b.label, template: () => <NavLink className={i === breadcrumb.length - 1 ? "text-cyan-400" : ""} to={b.path}>{b.label}</NavLink> }))

    return <>{breadcrumb.length > 0 && <BreadCrumb className="mb-5" model={items} home={{ icon: 'ph ph-house', url: '/' }} pt={{ root: { style: { backgroundColor: 'transparent', border: 0, padding: 0 } } }}></BreadCrumb>}</>
}