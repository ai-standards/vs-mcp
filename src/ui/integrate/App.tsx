import { List, ListItem, IconButton, Typography } from "@/lib/ui/components";
import { Loading } from "@/lib/ui/components/Loading";
import React, { useEffect, useState } from "react";
import { VscEdit, VscPlay, VscRefresh, VscAdd } from "react-icons/vsc";
import { useApi } from "@/lib/ui//hooks/useApi";
import { createMcpService } from "@/lib/ui/services/mcpService";

export default function App() {
  const [integrations, setIntegrations] = useState<Array<{ id: string; title: string, enabled: boolean, path: string }>>([]);
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

  const handleClick = async (integration: any) => {
    await mcpService.dispatch('integration.connectIntegration', {integrationId: integration.id});
    setIntegrations(prevIntegrations =>
      prevIntegrations.map(item =>
        item.id === integration.id ? { ...item, enabled: true } : item
      )
    );
  }

  return (
    <List border={false}>
      {integrations.length === 0 ? (
        <li>No integrations found.</li>
      ) : (
        integrations.map(integration => (
          <ListItem border={true} key={integration.id} toolbar={<IconButton 
              icon={integration.enabled ? <VscRefresh /> : <VscAdd />}  
              onClick={() => handleClick(integration)}
            />}>
            <Typography as="div">{integration.title}</Typography>
            <Typography size="small" color="muted">{integration.path}</Typography>
          </ListItem>
        ))
      )}
    </List>
  );
};
