import { Avatar } from "primereact/avatar";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import { ChangeEvent, useEffect, useRef } from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "primereact/hooks";

export function AppTopbar() {
  const { pageTitle } = usePageTitle();
  const { user, logout } = useAuth();
  const [, setSearchParams] = useSearchParams();
  const [, debouncedValue, setInputValue] = useDebounce("", 400);

  const userProfilePicture = user?.picture;
  const userFirstNameLetter = user?.given_name?.[0];

  const menu = useRef<Menu>(null);
  const items: MenuItem[] = [
    {
      template: () => (
        <Button
          onClick={logout}
          className="w-full"
          label="Logout"
          icon="ph ph-arrow-square-left"
          severity="secondary"
          text
        />
      ),
    },
  ];

  function onSearch(event: ChangeEvent<HTMLInputElement>) {
    const search = event.target.value.trim();
    setInputValue(search);
  }

  useEffect(() => {
    const search = debouncedValue;
    if (search) {
      setSearchParams((params) => ({
        ...Object.fromEntries(params.entries()),
        page: "1",
        search: debouncedValue,
      }));
    } else {
      setSearchParams((params) => {
        params.delete("search");
        return {
          ...Object.fromEntries(params.entries()),
        };
      });
    }
  }, [debouncedValue, setSearchParams]);

  return (
    <div className="flex justify-between items-center me-3">
      <span className="font-semibold text-2xl mt-3 mb-2 ps-2">{pageTitle}</span>
      <div className="flex gap-3 items-center">
        <IconField className="mt-2" iconPosition="left">
          <InputIcon
            className="ph ph-magnifying-glass"
            style={{ top: "0.9em" }}
          ></InputIcon>
          <InputText
            className="p-inputtext-sm"
            placeholder="Search"
            onChange={onSearch}
          />
        </IconField>
        <i
          className="ph ph-bell p-overlay-badge mt-2 hover:bg-slate-700 rounded-full p-2"
          style={{ fontSize: "1.5rem" }}
        >
          {/* <Badge value="0"></Badge> */}
        </i>
        <div
          onClick={(e) => menu.current?.toggle(e)}
          className="flex items-center hover:bg-slate-700 p-1 mt-2 rounded-lg cursor-pointer"
        >
          {userProfilePicture ? (
            <Avatar image={userProfilePicture} size="large" shape="circle" />
          ) : (
            <Avatar
              label={userFirstNameLetter}
              size="large"
              style={{ backgroundColor: "#F5CB5C", color: "#18181B" }}
              shape="circle"
            ></Avatar>
          )}
          <span className="ms-3 font-semibold">{user?.given_name}</span>
          <i className="ph ph-caret-down ms-2"></i>
        </div>
      </div>

      <Menu
        model={items}
        popup
        ref={menu}
        id="popup_menu_right"
        popupAlignment="right"
      />
    </div>
  );
}
