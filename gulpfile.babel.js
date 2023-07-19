// Gulp
import pkg from 'gulp';
const { src, dest, watch, series, parallel } = pkg;
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import gulpif from 'gulp-if';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import deploy from 'gulp-gh-pages';

// CSS/SASS
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sassGlob from 'gulp-sass-glob';

import cleanCss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';

// Images
import imagemin from 'gulp-imagemin';

// Javascript
import webpack from 'webpack-stream';
import named from 'vinyl-named';

// html
import fileinclude from 'gulp-file-include';

// BrowserSync
import browserSync from "browser-sync";




const PRODUCTION = yargs(hideBin(process.argv)).argv.prod;
const srcDir = `./src/`;
const distDir = `./dist/`;



/* --------------------------------------------
 * --Specific Tasks
 * -------------------------------------------- */

/**
 * Render HTML
 */
/**
 * Render HTML
 */
export const htmlrender = () => {
  return src(`${srcDir}/**`)
  .pipe(
    fileinclude({
      prefix: '@@',
      basepath: '@file'
    })
  )
  .pipe( dest(`${distDir}/`) );
}
/**
 * Render HTML
 */
export const fonts = () => {
  
  return src(`${srcDir}/fonts/**`)
  //.pipe( gulpif(PRODUCTION, postcss([ autoprefixer ])) )
  .pipe( dest(`${distDir}/fonts/`) );
  
}

/**
 * Compile SCSS
 */

export const styles = () => {
  return src(`${srcDir}css/*.scss`)
    .pipe( sassGlob() )
    .pipe( gulpif(!PRODUCTION, sourcemaps.init()) )
    .pipe( sass({ includePaths: ['node_modules'] }).on('error', sass.logError) )
    // .pipe( gulpif(PRODUCTION, postcss([ autoprefixer ])) )
    .pipe( postcss([ autoprefixer ]) )
    .pipe( cleanCss({
      format: 'beautify'
    }) )
    .pipe( dest(`${distDir}/css`) )
    .pipe( gulpif(PRODUCTION, cleanCss()) )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulpif(!PRODUCTION, sourcemaps.write('.')) )
    .pipe( dest(`${distDir}/css`) )
    .pipe( browserSync.stream() );
}

/**
 * Minify Images
 */
export const images = () => {
  return src(`${srcDir}img/**/*.{jpg,jpeg,png,svg,gif}`)
    .pipe( imagemin([
      // imagemin.svgo({
      //   plugins: [
      //     {removeViewBox: false},
      //     {convertShapeToPath: true}
      //   ]
      // })
    ]) )
    .pipe( dest(`${distDir}/img`) );
}

/**
 * Compile JS
 */
export const scripts = () => {
  return src(`${srcDir}js/index.js`)
  .pipe(named())
  .pipe(webpack({
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [["@babel/env", { modules: false }]],
            }
          }
        }
      ]
    },
    mode: PRODUCTION ? 'production' : 'development',
    devtool: !PRODUCTION ? 'inline-source-map' : false,
    output: {
      filename: '[name].min.js'
    },
  }))
  .pipe(dest(`${distDir}/js`));
}

/**
 * BrowserSync
 */
export const serve = done => {
  browserSync.init({
    server: {
      baseDir: `dist`,
      index: `index.html`
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
        margin: '0px',
        padding: '5px',
        position: 'fixed',
        fontSize: '10px',
        zIndex: '9999',
        borderRadius: '5px 0px 0px',
        color: 'white',
        textAlign: 'center',
        display: 'block',
        backgroundColor: 'rgba(60, 197, 31, 0.498039)'
      }
    }
  });
  done();
};
export const reload = done => {
  browserSync.reload();
  done();
};

/**
 * Watch
 */
export const watchForChanges = () => {
  watch(`${srcDir}{css,inc}/*.scss`, styles);
  watch(`${srcDir}img/**/*.{jpg,jpeg,png,svg,gif}`, series(images, htmlrender, reload));
  watch(`${srcDir}{js,inc}/**/*.js`, series(scripts, reload));
  watch(`${srcDir}**/*.html`, series(images, htmlrender, reload));
}

/**
 * Clean
 */
export const clean = () => deleteAsync([`${distDir}`]);



/* --------------------------------------------
 * --Gulp Tasks
 * -------------------------------------------- */
export const dev = series(clean, parallel(styles, images, scripts, fonts), htmlrender, serve, watchForChanges)
export const build = series(clean, parallel(styles, images, scripts, fonts), htmlrender)
export default dev;