import { useEffect, useState } from "react";
import api from "../api.js";

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [keys, setKeys] = useState([]);
  const [exportInfo, setExportInfo] = useState(null);
  const [webhooks, setWebhooks] = useState([]);

  const load = async () => {
    const [a, b, c, d] = await Promise.all([
      api.get("/settings/profile"),
      api.get("/settings/api-keys"),
      api.get("/settings/export"),
      api.get("/settings/webhooks")
    ]);
    setProfile(a.data);
    setKeys(b.data);
    setExportInfo(c.data);
    setWebhooks(d.data);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const createKey = async () => {
    await api.post("/settings/api-keys", { name: "Class key" });
    load();
  };

  return (
    <section>
      <h2>Settings</h2>
      {profile && <div className="panel"><h3>Profile</h3><p>{profile.email} ({profile.role})</p></div>}
      <div className="panel">
        <h3>API Keys</h3>
        <button className="btn" type="button" onClick={createKey}>Create API key</button>
        {keys.map((k) => <p key={k.id}>{k.name}: <code>{k.key_value}</code></p>)}
      </div>
      <div className="panel">
        <h3>Export</h3>
        <p>Records: {exportInfo?.transactions?.length || 0}</p>
      </div>
      <div className="panel">
        <h3>Webhooks</h3>
        {webhooks.map((w) => <p key={w.id}>{w.url} ({w.enabled ? "enabled" : "disabled"})</p>)}
      </div>
    </section>
  );
}
