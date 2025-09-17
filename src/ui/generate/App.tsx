import { TextField, Toolbar, Button } from "@/lib/ui/components";
import { useApi } from "@/lib/ui/hooks/useApi";
import { createMcpService } from "@/lib/ui/services/mcpService";
import React, { useState } from "react";

export default function App() {
    const [description, setDescription] = useState("");
    const api = useApi();
    const mcpService = createMcpService(api);

    const handleCreate = () => {
        mcpService.dispatch('agent.createAgent', {
            description
        });
        setDescription('');
    };

    return (
        <Form>
            <TextField
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What do you want your agent to do?"
                rows={4}
            />
            <Toolbar style={{paddingTop: '8px'}}>
                <Button onClick={handleCreate} color="secondary">
                    Import
                </Button>
                <span style={{flex: 1}}></span>
                <Button onClick={handleCreate}>
                    Create new agent
                </Button>
            </Toolbar>
        </Form>
    );
}

function Form({ children }: { children: React.ReactNode }) {
    const styles: React.CSSProperties = {
        margin: '16px',
        display: 'flex',
        flexDirection: 'column'
    };
    return (
        <div style={styles}>{children}</div>
    )
}
