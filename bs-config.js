const Path = require("path");
const Fs = require("fs");

const buildDir = Path.resolve(__dirname, "build");

module.exports = {
  server: {
    baseDir: "build",
    middleware: [
      function extensionlessHtml(req, res, next) {
        const urlPath = req.url.split("?")[0];

        if (urlPath === "/" || Path.extname(urlPath)) {
          return next();
        }

        const htmlPath = Path.join(buildDir, `${urlPath}.html`);
        if (Fs.existsSync(htmlPath)) {
          req.url = `${urlPath}.html${req.url.slice(urlPath.length)}`;
        }

        next();
      },
    ],
  },
  files: "build",
  port: 3000,
  open: false,
  notify: false,
};
