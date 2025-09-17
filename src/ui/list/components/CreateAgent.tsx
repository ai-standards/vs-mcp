import React, { useState } from "react";
import { Button } from "../toolkit/Button";
import { TextField } from "../toolkit/TextField";
import { useApi } from "../hooks/useApi";
import { createMcpService } from "../services/mcpService";
import { Toolbar } from "../toolkit";

export default function CreateAgent({ onCreate }: { onCreate?: (text: string) => void }) {
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
