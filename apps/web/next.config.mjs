const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const configuredTarget = [process.env.NEXT_PUBLIC_API_BASE_URL, process.env.NEXT_PUBLIC_API_URL]
      .map((value) => value?.trim())
      .find((value) => Boolean(value));

    if (process.env.NODE_ENV === 'development') {
      return [{ source: '/api/:path*', destination: 'http://localhost:4000/:path*' }];
    }

    if (configuredTarget && (configuredTarget.startsWith('http://') || configuredTarget.startsWith('https://'))) {
      return [{ source: '/api/:path*', destination: `${configuredTarget.replace(/\/+$/, '')}/:path*` }];
    }

    return [];
  }
};

export default nextConfig;
