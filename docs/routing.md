# Routing Flow

```mermaid
flowchart TD
    A[main.jsx: BrowserRouter] --> B[App.jsx: Routes]
    B -->|path=/| C[Layout.jsx]
    C --> D[Header.jsx]
    C --> E["Outlet (page content)"]
    C --> F[Footer.jsx]
    D -->|NavLink clicks change URL| B
    E -->|matched child route| G[Home / TvShows / Movies / etc.]
    G -->|Back to Home Link| B
```

![Routing Flow Diagram](routing-diagram.png)
