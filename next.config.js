/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chess/add_match",
        permanent: false,
      },
      {
        source: "/chess",
        destination: "/chess/add_match",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
