var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  spritesmith = require('gulp.spritesmith'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  notify = require('gulp-notify'),
  sassGlob = require('gulp-sass-glob');
(autoprefixer = require('gulp-autoprefixer')),
  (cleanCSS = require('gulp-clean-css')),
  (csscomb = require('gulp-csscomb')),
  (rename = require('gulp-rename')),
  (browserSync = require('browser-sync')),
  (imagemin = require('gulp-imagemin')),
  (pngquant = require('imagemin-pngquant')),
  (concat = require('gulp-concat')),
  (uglify = require('gulp-uglify')),
  (reload = browserSync.reload),
  (buffer = require('vinyl-buffer'));

gulp.task('sprite', function() {
  var spriteData = gulp.src(['src/img/sprites/*.*']).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../img/sprite.png',
      cssFormat: 'scss',
      padding: 4
    })
  );
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('build/img/'));
  var cssStream = spriteData.css.pipe(gulp.dest('src/scss/components/'));
  return imgStream, cssStream;
});

gulp.task('browserSync', function() {
  // Создаем таск browser-sync
  browserSync({
    // Выполняем browserSync
    server: {
      // Определяем параметры сервера
      baseDir: './', // Директория для сервера
      serveStaticOptions: {
        extensions: ['html']
      },
      directory: true
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('img', function() {
  return (
    gulp
      .src('src/img/**/*') // Берем все изображения из app
      // .pipe(cache(imagemin({ // С кешированием
      .pipe(
        imagemin({
          // Сжимаем изображения без кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
      .pipe(gulp.dest('build/img'))
  ); // Выгружаем на продакшен
});

gulp.task('pug', function() {
  return gulp
    .src('src/*.pug')
    .pipe(pug({ pretty: '\t' }))
    .on('error', notify.onError())
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function() {
  return (
    gulp
      .src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sassGlob())
      .pipe(rename({ suffix: '.min', prefix: '' }))
      .pipe(autoprefixer(['last 5 versions'])) //подключаем Autoprefixer
      .pipe(csscomb())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      // .on("error", notify.onError())
      .pipe(gulp.dest('build/css'))
      .pipe(browserSync.reload({ stream: true }))
  );
});

gulp.task('scripts', function() {
  return (
    gulp
      .src('src/*.js')
      // .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
      .pipe(uglify()) // Сжимаем JS файл
      .pipe(gulp.dest('build'))
  ); // Выгружаем в папку static/js
});

gulp.task('watch', ['pug', 'sass', 'scripts', 'browserSync'], function() {
  gulp.watch('src/*.pug', ['pug']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  // gulp.watch('static/*.html').on('change', reload);
  //для обновления страницы заменил строку, было раньше(не обновляло):
  gulp.watch('build/*.html', browserSync.reload({ stream: true }));
});
