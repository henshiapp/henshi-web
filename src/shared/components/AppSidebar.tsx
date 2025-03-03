import { Ripple } from 'primereact/ripple';
import { NavLink, useLocation } from 'react-router';
import { ROUTES } from '../consts/routes';

type Menu = { name: string, children: MenuItem[] }[];

type MenuItem = {
    name: string,
    icon: string,
    path: string,
}

export default function AppSidebar() {
    const menu: Menu = [
        {
            name: 'MAIN',
            children: [
                {
                    name: 'Dashboard',
                    icon: 'ph-squares-four',
                    path: ROUTES.dashboard,
                }
                ,
                {
                    name: 'Flashcards',
                    icon: 'ph-cards',
                    path: ROUTES.cardCollections,
                }
            ]
        }
    ]

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="bg-slate-950 px-2 min-h-screen flex relative lg:static surface-ground">
            <div className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '280px' }}>
                <div className="flex flex-col justify-between h-full px-4">
                    <div>
                        <div className="flex align-items-center justify-content-between pt-5 flex-shrink-0 pb-4 border-b-1 border-zinc-700">
                            <span className="inline-flex align-items-center gap-2">
                                <NavLink to="/" className="w-40"><img src="/logo-full.svg" /></NavLink>
                            </span>
                        </div>
                        <div className="overflow-y-auto">
                            <ul className="flex flex-col list-none pt-3 mt-5 gap-1">
                                {menu.map((menuItem) => (<div key={menuItem.name}>
                                    <h3 className='mb-3'>{menuItem.name}</h3>

                                    {menuItem.children.map(({ name, icon, path }) => (
                                        <NavLink key={path} to={path} className={(currentPath.startsWith(path) ? "bg-slate-900 border-slate-700 border-1 mt-2" : "") + " rounded-lg p-ripple p-3 flex gap-2 items-center transition font-semibold cursor-pointer hover:bg-slate-800 hover:rounded-lg"}>
                                            <i className={"text-xl ph " + icon}></i>
                                            <span className="font-medium">{name}</span>
                                            <Ripple />
                                        </NavLink>
                                    ))}
                                </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='flex justify-center items-center py-4 border-t-1 border-slate-700'>
                        Henshi © 2025
                    </div>
                </div>
            </div>
        </div>
    )
}