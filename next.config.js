/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chess/leaderboard",
        permanent: false,
      },
      {
        source: "/chess",
        destination: "/chess/leaderboard",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
