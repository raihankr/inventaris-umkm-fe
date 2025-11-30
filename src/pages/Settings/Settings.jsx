import AppSettings from "./AppSettings";
import AccountSettings from "./AccountSettings";

export default function Settings() {
  return (
    <div className="max-h-[65vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

      {/* Section 1 — App Settings */}
      <div className="mb-6">
        {/* <h4 className="text-sm font-semibold mb-2">App Settings</h4> */}
        <div className="rounded-md border p-4 bg-muted/30">
          <AppSettings />
        </div>
      </div>

      {/* Section 2 — User Settings */}
      <div>
        {/* <h4 className="text-sm font-semibold mb-2">User Settings</h4> */}
        <div className="rounded-md border p-4 bg-muted/30">
          <AccountSettings />
        </div>
      </div>

    </div>
  );
}
