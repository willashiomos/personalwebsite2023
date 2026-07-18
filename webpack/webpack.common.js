const Path = require('path');
const Fs = require('fs');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = glob.sync(Path.resolve(__dirname, "../src/**/*.html"));
const publicDir = Path.resolve(__dirname, '../public');
const publicOutputDir = Path.resolve(__dirname, '../build/public');

class CopyPublicPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('CopyPublicPlugin', async () => {
      await Fs.promises.cp(publicDir, publicOutputDir, { recursive: true });
    });
  }
}

function getPageChunks(pagePath) {
  const relativePath = Path.relative(Path.resolve(__dirname, '../src'), pagePath);
  if (relativePath.startsWith(`case-studies${Path.sep}`)) {
    return ['caseStudy'];
  }
  return ['app'];
}

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js'),
    caseStudy: Path.resolve(__dirname, '../src/scripts/case-study.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPublicPlugin(),
    ...pages.map((page) => {
      const filename = Path.basename(page);
      return new HtmlWebpackPlugin({
        template: page,
        filename: filename,
        chunks: getPageChunks(page),
      });
    }),

  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            urlFilter: (attribute, value) => {
              if (typeof value === 'string' && value.startsWith('/')) {
                return false;
              }
              return true;
            },
          },
        },
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024,
          },
        },
      },
    ],
  },
};
