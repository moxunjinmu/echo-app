# 后端生产环境 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --prod

# 复制源代码
COPY . .

# 构建
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["pnpm", "run", "start:prod"]
