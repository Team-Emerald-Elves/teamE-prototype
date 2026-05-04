import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type ReactNode, useEffect, useRef, useState } from "react";
import CenterDiv from "./center-div.tsx";
import { getToken, useAuth } from "@clerk/react";
import { Bell } from "lucide-react";
import {
  NotifScroll,
  type Notification,
} from "@/components/notifications.tsx";
import qmgr from "@/lib/querymgr.ts";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface NavbarProps {
  children?: ReactNode;
}

type NotificationsResponse = {
  Notifications: Notification[];
  newNotifications: boolean;
};

async function setRead() {
  const token = await getToken();

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/notifs/set-read`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Error setting notifications to read");
  }
}

function Navbar(props: NavbarProps) {
  const [roles, setRoles] = useState<string[]>([]);
  const { isSignedIn } = useAuth();

  const [showNotification, setShowNotification] = useState(false);
  const [unread, setUnread] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const didLoadMe = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (systemDark ? "dark" : "light");

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (didLoadMe.current) {
      return;
    }

    didLoadMe.current = true;

    async function loadMe() {
      qmgr.wait(() => {
        qmgr.getMe(async (res) => {
          if (!res.success) {
            throw new Error("Unable to get me");
          }

          const data = res.data!;

          setRoles(
            (data.roles as string[]).map((role: string) =>
              role.toLowerCase(),
            ),
          );
        });
      });
    }

    loadMe();
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    let interval: number;

    async function getNotifications() {
      try {
        const token = await getToken();

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/notifs/get-notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("error fetching notifications");
        }

        const data: NotificationsResponse = await res.json();

        setNotifications(data.Notifications);
        setUnread(data.newNotifications);
      } catch (error) {
        console.error("[Navbar] Failed to refresh notifications:", error);
      }
    }

    getNotifications();

    interval = window.setInterval(getNotifications, 15000);

    return () => window.clearInterval(interval);
  }, [isSignedIn]);

  async function dismissNotification(id: string) {
    const previousNotifications = notifications;

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );

    try {
      const token = await getToken();

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifs/dismiss-notifications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: [id],
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Error dismissing notification");
      }
    } catch (error) {
      console.error("[Navbar] Failed to dismiss notification:", error);

      setNotifications(previousNotifications);
    }
  }

  return (
    <header className="w-full bg-(--blue-primary) text-white sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-6 py-2">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-10 justify-items-start pl-5">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/">Home</Link>}
                className={navigationMenuTriggerStyle()}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/documents">Documents</Link>}
                className={navigationMenuTriggerStyle()}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/links">Links</Link>}
                className={navigationMenuTriggerStyle()}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/calendar">Calendar</Link>}
                className={navigationMenuTriggerStyle()}
              />
            </NavigationMenuItem>

            {roles.includes("administrator") && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={
                    <Link to="/employee-management">User Management</Link>
                  }
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-10">
            <NavigationMenuItem>
              <button className="mt-1" onClick={toggleTheme}>
                {theme === "light" ? (
                  <HugeiconsIcon icon={Moon02Icon} />
                ) : (
                  <HugeiconsIcon icon={Sun03Icon} />
                )}
              </button>
            </NavigationMenuItem>

            <NavigationMenuItem className="relative">
              <button
                className="relative mt-1"
                onClick={async () => {
                  setShowNotification((prev) => !prev);

                  if (unread) {
                    setUnread(false);

                    try {
                      await setRead();
                    } catch (error) {
                      console.error(
                        "[Navbar] Failed to mark notifications as read:",
                        error,
                      );
                    }
                  }
                }}
              >
                {unread && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500 z-10" />
                )}

                <Bell size={18} className={navigationMenuTriggerStyle()} />
              </button>

              {showNotification && (
                <div className="absolute right-0 top-full mt-2 z-50 animate-in zoom-in-80 origin-top-right duration-200 ease-in-out">
                  <NotifScroll
                    notifications={notifications}
                    onDismissNotification={dismissNotification}
                  />
                </div>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <CenterDiv>{props.children}</CenterDiv>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Navbar;