import React from "react"
import { createRoot } from "react-dom/client"

const App = () => <div>Remote App 启动成功</div>

const root = createRoot(document.getElementById("root"))
root.render(<App />)
