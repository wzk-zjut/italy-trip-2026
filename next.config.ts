import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 允许通过 Server Action 上传较大图片（压缩后一般 <1MB，这里留足余量）
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
