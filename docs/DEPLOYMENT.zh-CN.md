# 部署指南

这份指南适合第一次把 Image Prompt Wall 部署到 Cloudflare 的人。

如果你已经把 Worker Custom Domain 和 Access 配好，可以直接跳到最后的检查项。

## 部署前准备

你需要准备：

- 一个 Cloudflare 账号
- 一个已经接入 Cloudflare 的域名
- 一个 Worker
- 一个 D1 数据库
- 一个 R2 Bucket

如果你要和当前项目保持一致，推荐使用：

- Worker 名称：`image-prompt-wall`
- 自定义域名：`image-prompt-wall.joakim.dpdns.org`
- 后台授权邮箱：`shake.chen@gmail.com`

## 第 1 步：部署 Worker

在项目目录里执行：

```bash
npm install
npm run deploy
```

部署后，Cloudflare 会生成一个 Worker。

## 第 2 步：创建 D1 数据库

创建一个新的 D1 数据库，然后把数据库绑定到 Worker。

项目当前使用的表结构在：

- `migrations/0001_init.sql`
- `migrations/0002_add_prompt_note.sql`

执行迁移：

```bash
npm run d1:migrate
```

## 第 3 步：创建 R2 Bucket

创建一个 R2 Bucket，用来存图片。

然后把它绑定到 Worker，对应的绑定名是：

- `image_prompt_wall_images`

## 第 4 步：绑定自定义域名

在 Cloudflare 的 **Workers & Pages** 页面里：

1. 打开你的 Worker
2. 进入 **Settings**
3. 打开 **Domains & Routes**
4. 添加 **Custom Domain**
5. 填入你的域名，例如 `image-prompt-wall.joakim.dpdns.org`

绑定成功后，用户就可以直接通过这个域名访问站点。

## 第 5 步：配置 Access

Access 只负责保护后台，不负责绑定 Worker 域名。

你需要创建一个 **Self-hosted** 应用，并把这个地址加进去：

- `image-prompt-wall.joakim.dpdns.org`

然后添加一条允许策略，放行你的邮箱：

- `shake.chen@gmail.com`

## 第 6 步：验证站点

建议按这个顺序检查：

1. 打开首页，确认卡片墙可以加载
2. 点开任意图片，确认详情页正常
3. 登录后台，确认 `/admin` 可以进入
4. 上传一张图片，确认能保存
5. 再上传第二张，确认最多 2 张的逻辑正常
6. 进入编辑，确认删除、恢复、保存都正常
7. 确认 Access 只放行你自己的邮箱

## 常见问题

### 1. 访问新域名时报 404

先检查这两个地方：

- Worker Custom Domain 是否已经绑定成功
- 域名是否已经指向这个 Worker

### 2. 进入后台提示 Access code，但登录后还是不对

通常是 Access 应用的 hostname 没配对，或者策略里没有放行正确的邮箱。

### 3. 上传后图片看不到

先检查：

- R2 Bucket 是否绑定正确
- D1 里是否有对应图片索引
- Worker 是否成功部署了最新版本

## 推荐的维护方式

如果后面你继续改这个项目，我建议直接让 Codex 处理：

- 改 README 和页面文案
- 改后台编辑交互
- 改 Access / 域名 / R2 / D1 配置
- 改主题、图标、中文提示

这样比较适合这个项目的节奏：小步修改、快速验证、持续同步到 Cloudflare。

如果你想让每次改动都更有章法，可以直接看这份：

- [Codex 部署检查清单](./CODEX_CHECKLIST.zh-CN.md)
