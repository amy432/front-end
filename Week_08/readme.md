### 配置 JSX 环境

1. 初始化

   ```bash
   npm init
   ```

   

2. 安装 webpack

```bash
// 全局安装
npm install -g webpack webpack-cli
```



3. 安装 babel-loader

```bash
// 安装到本地目录
npm install --save-dev webpack babel-loader
```



4. 安装 babel

   ```bash
   npm install --save-dev @babel/core @babel/preset-env
   ```

5. 安装 bable/plugin-transform-react-jsx
```bash
npm install --save-dev @babel/plugin-transform-react-jsx
```



6. webpack-dev-server

```bash
npm install webpack-dev-server --save-dev
```