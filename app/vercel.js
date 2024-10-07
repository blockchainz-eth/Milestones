// next.config.js

module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/', // Matched parameters can be used in the destination
      },
    ]
  },
}
