import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";
import {
  copy,
  reset,
  html,
  server,
  scss,
  js,
  images,
  otfToTtf,
  ttfToWoff,
  fontsStyle,
  svgSprite,
  zipPlugin,
  ftp,
} from "./gulp/tasks/index.js";

global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path,
  gulp,
  plugins,
};

const watcher = () => {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
};

export { svgSprite };

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series(
  fonts,
  gulp.parallel(copy, html, scss, js, images)
);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, svgSprite, zipPlugin);
const deployFTP = gulp.series(reset, mainTasks, svgSprite, ftp);

export { dev };
export { build };
export { deployZIP };
export { deployFTP };

gulp.task("default", dev);
