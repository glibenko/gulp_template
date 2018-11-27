// plane gulp
import gulp from 'gulp';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import babel from "gulp-babel";
import del from 'del';
import gulpif from 'gulp-if';
import filelist from 'gulp-filelist';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify-es';

gulp.task('browser-sync', () => {
  browserSync.init({
      server: {
          baseDir: './dist'
      }
  });
});

const NODE_ENV = process.env.NODE_ENV === 'production';

// if i need file list in json
gulp.task('filelist', ['build'], () => {
  gulp.src('dist/**/*.*')
    .pipe(filelist('filelist.json'))
    .pipe(gulp.dest('dist'));
});

gulp.task('del', () => {
  del.sync('dist/**/*.*');
});

gulp.task('fonts', () => {
  gulp.src('app/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('allCss', () => {
  gulp.src([
    'app/css/reset.css',
    'app/css/style.css',
  ])
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'safari >= 7'],
      cascade: false,
    }))
    .pipe(gulpif(NODE_ENV, cssnano()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('alljs', () => {
  gulp.src([
    'app/js/parallax.min.js',
    'app/js/TweenMax.min.js',
    'app/js/main.js',
  ])
    .pipe(concat('main.js'))
    // .pipe(babel())
    .pipe(gulpif(NODE_ENV, uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});


gulp.task('build', ['del', 'allCss', 'alljs'], () => {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dist'));

    gulp.src('app/favicon.ico')
    .pipe(gulp.dest('dist'));

    gulp.src('app/docs/*.*')
    .pipe(gulp.dest('dist/docs'));

  gulp.src('app/manifest.json')
    .pipe(gulp.dest('dist'));

  gulp.src('app/sw.js')
    .pipe(gulp.dest('dist'));

  gulp.src('app/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['build', 'browser-sync'], () => {
  gulp.watch('app/index.html', () => {
    gulp.src('app/index.html')
      .pipe(gulp.dest('dist'))
  });

  gulp.watch('app/manifest.json', () => {
    gulp.src('app/manifest.json')
      .pipe(gulp.dest('dist'));
  });

  gulp.watch('app/sw.js', () => {
    gulp.src('app/sw.js')
      .pipe(gulp.dest('dist'));
  });

  gulp.watch('app/js/**/*.js', ['alljs'], () => {

  });

  gulp.watch('app/css/*.css', ['allCss'], () => {

  });

  gulp.watch('app/img/**/*.*', () => {
    gulp.src('app/img/**/*.*')
      .pipe(gulp.dest('dist/img'));
  });

  gulp.watch('app/fonts/**/*.*', () => {
    gulp.src('app/fonts/*.*')
      .pipe(gulp.dest('dist/fonts'));
  });
});
