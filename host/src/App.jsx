import React, { Suspense } from "react"

const RemoteButton = React.lazy(() => import("remote/Button"))

const App = () => (
  <div>
    <h2>Host App</h2>
    <Suspense fallback={<div>加载远程组件中...</div>}>
      <RemoteButton />
    </Suspense>
  </div>
)

export default App
