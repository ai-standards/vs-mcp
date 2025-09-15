import React from "react";
import { ListAgents } from "./components/ListAgents";
import { Section } from "./toolkit/Section";
import CreateAgent from "./components/CreateAgent";

export default function App() {
  return (
    <Section fullHeight={true}>
      <div style={{flex: 1, overflowY: "auto"}}>
        <ListAgents />
      </div>
      <CreateAgent />
    </Section>
  );
}
