import adapter from '@sveltejs/adapter-node';

const config = {
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: {
    adapter: adapter({
      out: 'build'
    }),
    paths: {
      base: '/app_crp'
    }
  }
};

export default config;