# Webpack 5 模块联邦（Module Federation）详解与实战

> 作者：你的名字  
> 日期：2024-05

---

## 前言

随着前端工程化和微前端架构的流行，如何实现**多个独立项目间的代码共享与动态加载**，成为了大型前端项目的核心诉求。Webpack 5 推出的 **Module Federation（模块联邦）**，为这一难题提供了革命性的解决方案。

本文将带你深入理解模块联邦的原理、配置、常见场景与最佳实践，并结合实际开发中遇到的典型问题，助你快速上手并避坑。

---

## 1. 什么是 Module Federation？

Module Federation 是 Webpack 5 引入的一项新特性，允许**多个独立构建的应用之间动态加载和共享模块**，实现真正意义上的"微前端"与"远程组件"。

- **主应用（Host）**：负责加载和渲染远程模块。
- **远程应用（Remote）**：暴露自身的模块供主应用加载。

你可以把它理解为"前端的 npm"，但是**运行时动态加载**，而不是打包时静态依赖。

---

## 2. 典型应用场景

- **微前端架构**：多个团队独立开发、独立部署，主应用动态加载各自的业务模块。
- **远程组件库**：主应用无需重新打包即可获取最新的 UI 组件。
- **多项目代码复用**：如后台管理系统、B 端平台等。

---

## 3. Module Federation 的核心配置

以 React 项目为例，主应用（host）和远程应用（remote）都需要配置 `ModuleFederationPlugin`。

### 3.1 远程应用（remote）配置

```js
// remote/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")

module.exports = {
  // ...其他配置
  plugins: [
    new ModuleFederationPlugin({
      name: "remote", // 远程应用名称
      filename: "remoteEntry.js", // 暴露的入口文件
      exposes: {
        "./Button": "./src/Button.jsx", // 暴露的组件
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
      },
    }),
  ],
}
```

### 3.2 主应用（host）配置

```js
// host/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")

module.exports = {
  // ...其他配置
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remote: "remote@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
      },
    }),
  ],
}
```

---

## 4. 远程组件的使用

主应用中可以这样动态加载远程组件：

```jsx
// host/src/App.jsx
import React, { Suspense } from "react"
const RemoteButton = React.lazy(() => import("remote/Button"))

export default () => (
  <Suspense fallback={<div>加载中...</div>}>
    <RemoteButton />
  </Suspense>
)
```

---

## 5. 常见问题与最佳实践

### 5.1 共享依赖（shared）配置

- **singleton: true**：全局只加载一份依赖，防止 React 多实例导致 hooks 报错。
- **requiredVersion**：强制依赖版本一致，避免兼容性问题。
- **host 和 remote 都要写 shared，且依赖版本一致！**

### 5.2 启动顺序

- **必须先启动 remote，再启动 host！**
- 否则主应用找不到远程依赖，会报错。

### 5.3 "Shared module is not available for eager consumption" 报错

#### 原因

- 入口文件同步 import 了远程模块，Webpack 期望异步加载。
- shared 配置和实际消费方式冲突。

#### 解决办法

- **推荐：使用异步边界**  
  把入口文件改成异步加载：

  ```js
  // index.js
  import("./bootstrap")
  ```

  ```js
  // bootstrap.js
  import React from "react"
  import { createRoot } from "react-dom/client"
  import App from "./App"
  const root = createRoot(document.getElementById("root"))
  root.render(<App />)
  ```

- **或者：在 shared 里加 eager: true**

  ```js
  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0", eager: true }
  }
  ```

  > 参考：[官方文档-故障排除](https://webpack.docschina.org/concepts/module-federation/#%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)

---

## 6. 实战经验总结

- **依赖版本必须一致**，否则共享失败。
- **remote 先启动，host 后启动**，否则主应用会报错。
- **不要暴露 index.js，只暴露具体组件**。
- **遇到奇怪报错，先清理 node_modules 和 package-lock.json，重新 npm install。**
- **优先用异步入口（import('./bootstrap')），更健壮。**

---

## 7. 参考资料

- [Webpack 官方 Module Federation 文档（中文）](https://webpack.docschina.org/concepts/module-federation/)
- [StackOverflow: Uncaught Error: Shared module is not available for eager consumption](https://stackoverflow.com/questions/72273886/react-module-federation-uncaught-error-shared-module-is-not-available-for-eag)

---

## 结语

Webpack 5 的 Module Federation 极大地提升了前端架构的灵活性和可扩展性，是微前端、远程组件等场景的首选方案。希望本文能帮你快速理解并用好这项新技术，少踩坑，多提效！

如有问题，欢迎留言交流！
