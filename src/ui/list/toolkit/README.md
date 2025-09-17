# VS Code Minimal UI Toolkit

A set of minimal React components styled with VS Code CSS variables for building consistent webview UIs.

## Components & Examples

---

### Button
```tsx
<Button>Click me</Button>
```

---

### TextField
```tsx
<TextField placeholder="Type here..." />
```

---

### Panel
```tsx
<Panel title="Panel Title">Panel content</Panel>
```

---

### List & ListItem
```tsx
<List>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
</List>
```

---

### Toolbar & ToolbarButton
```tsx
<Toolbar>
  <ToolbarButton icon={<span>🔍</span>} onClick={() => {}}>Search</ToolbarButton>
</Toolbar>
```

---

### Menu & MenuItem
```tsx
<Menu open={true} onClose={() => {}}>
  <MenuItem icon={<span>📄</span>} onClick={() => {}}>File</MenuItem>
</Menu>
```

---

### Modal
```tsx
<Modal open={true} onClose={() => {}}>Modal content</Modal>
```

---

### Tabs & Tab
```tsx
<Tabs value={"one"} onChange={v => {}}>
  <Tab value="one">Tab One</Tab>
  <Tab value="two">Tab Two</Tab>
</Tabs>
```

---

### Checkbox
```tsx
<Checkbox checked={true} onChange={() => {}} />
```

---

### Switch
```tsx
<Switch checked={true} onChange={() => {}} />
```

---

### Radio
```tsx
<Radio checked={true} />
```

---

### Select
```tsx
<Select>
  <option value="a">A</option>
  <option value="b">B</option>
</Select>
```

---

### Tooltip
```tsx
<Tooltip label="Info">Hover me</Tooltip>
```

---

### Avatar
```tsx
<Avatar src="avatar.png" alt="User" />
```

---

### ProgressBar
```tsx
<ProgressBar value={50} max={100} />
```

---

### Spinner
```tsx
<Spinner />
```

---

### Card
```tsx
<Card>Card content</Card>
```

---

### Divider
```tsx
<Divider />
```

---

### Alert
```tsx
<Alert type="info">Info message</Alert>
<Alert type="warning">Warning message</Alert>
<Alert type="error">Error message</Alert>
```

---

### Typography
```tsx
// Default
<Typography>Default text</Typography>

// Sizes
<Typography size="small">Small</Typography>
<Typography size="medium">Medium</Typography>
<Typography size="large">Large</Typography>
<Typography size="xlarge">XLarge</Typography>

// Bold
<Typography bold>Bold text</Typography>

// Colors
<Typography color="default">Default</Typography>
<Typography color="secondary">Secondary</Typography>
<Typography color="error">Error</Typography>
<Typography color="warning">Warning</Typography>
<Typography color="info">Info</Typography>

// Custom element
<Typography as="h1" size="xlarge" bold>Heading</Typography>
```
