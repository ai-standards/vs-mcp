import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { List, ListItem } from "../toolkit/List";
import { createMcpService } from "../services/mcpService";
import { Button, IconButton, Typography } from "../toolkit";
import { VscPlay, VscOpenPreview, VscEdit } from "react-icons/vsc";

export const ListAgents: React.FC = () => {
	const [agents, setAgents] = useState<Array<{ id: string; name: string; description?: string; path?: string }>>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
    const api = useApi();
    const mcpService = createMcpService(api);

	useEffect(() => {
		async function fetchAgents() {
			setLoading(true);
			setError(null);
			try {
				const result = await mcpService.dispatch("agent.listAgents");
				setAgents(result.agents ?? []);
			} catch (err: any) {
				setError(err?.message || "Failed to load agents");
			} finally {
				setLoading(false);
			}
		}
		fetchAgents();
	}, []);

	if (loading) return <div>Loading agents...</div>;
	if (error) return <div>Error: {error}</div>;

    const openAgent = (agent: any) => {
        mcpService.dispatch("editor.openFile", {path: agent.path});
    }

	return (
		<List border={false}>
			{agents.length === 0 ? (
				<li>No agents found.</li>
			) : (
				agents.map(agent => (
					<ListItem border={false} key={agent.id} onClick={() => openAgent(agent)} style={{cursor: 'pointer'}} toolbar={<div style={{ display: "flex", gap: 8 }}>
						<IconButton icon={<VscEdit />} onClick={() => mcpService.dispatch('editor.openFile', {path: agent.path as string})}/>
						<IconButton icon={<VscPlay />}  onClick={() => mcpService.dispatch('agent.runAgent', {filepath: agent.path})}/>
					</div>}>
						<Typography as="div">{agent.name}</Typography>
						<Typography as="div" size="small" color="muted">...{agent.path?.slice(-40)}</Typography>
					</ListItem>
				))
			)}
		</List>
	);
};
