import { List, ListItem, IconButton, Typography } from "@/lib/ui/components";
import { Loading } from "@/lib/ui/components/Loading";
import React, { useEffect, useState } from "react";
import { VscEdit, VscPlay } from "react-icons/vsc";
import { useApi } from "@/lib/ui//hooks/useApi";
import { createMcpService } from "@/lib/ui/services/mcpService";

export default function App() {
  const [integrations, setIntegrations] = useState<Array<{ id: string; name: string; description?: string; path?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const api = useApi();
    const mcpService = createMcpService(api);

  useEffect(() => {
    async function fetchIntegrations() {
      setLoading(true);
      setError(null);
      try {
        const result = await mcpService.dispatch("integration.listIntegrations");
        setIntegrations(result.integrations ?? []);
      } catch (err: any) {
        setError(err?.message || "Failed to load integrations");
      } finally {
        setLoading(false);
      }
    }
    fetchIntegrations();
  }, []);

  if (loading) return <Loading align="center" />;
  if (error) return <div>Error: {error}</div>;

    const openIntegration = (integration: any) => {
        mcpService.dispatch("editor.openFile", {path: integration.path});
    }

  return (
    <List border={false}>
      {integrations.length === 0 ? (
        <li>No integrations found.</li>
      ) : (
        integrations.map(integration => (
          <ListItem border={false} key={integration.id} style={{cursor: 'pointer'}} toolbar={<div style={{ display: "flex", gap: 8 }}>
            <IconButton icon={<VscEdit />} onClick={() => mcpService.dispatch('editor.openFile', {path: integration.path as string})}/>
            <IconButton icon={<VscPlay />}  onClick={() => mcpService.dispatch('integration.runIntegration', {filepath: integration.path})}/>
          </div>}>
            <Typography as="div">{integration.name}</Typography>
            <Typography as="div" size="small" color="muted">...{integration.path?.slice(-35)}</Typography>
          </ListItem>
        ))
      )}
    </List>
  );
};
