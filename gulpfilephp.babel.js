// gulp with php and webpack
import gulp from 'gulp';
import concat from 'gulp-concat';
import webpack from 'webpack-stream';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import del from 'del';
import gulpif from 'gulp-if';

import webpackconf from './webpack.config.js';

const NODE_ENV = process.env.NODE_ENV === 'production';

gulp.task('del', () => {
    del.sync('dist');
});

gulp.task('build', ['del'], () => {
    gulp.src('app/index.php')
        .pipe(gulp.dest('dist'));

    gulp.src('app/js/main.js')
        .pipe(webpack(webpackconf))
        .pipe(gulp.dest('dist/js'));

    gulp.src([
        'app/css/form.css',
        'app/css/preloader.css',
        'app/css/style.css',
        'app/css/media.css'
    ])
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(NODE_ENV, cssnano()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));

    gulp.src('app/request/*.php')
        .pipe(gulp.dest('dist/request'));

    gulp.src('app/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));

    gulp.src('app/docs/*.*')
        .pipe(gulp.dest('dist/docs'));
    
    gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', () => {
    gulp.watch('app/index.php', () => {
        gulp.src('app/index.php')
            .pipe(gulp.dest('dist'));
    });

    gulp.watch('app/request/*.php', () => {
        gulp.src('app/request/*.php')
            .pipe(gulp.dest('dist/request'));
    });

    gulp.watch('app/js/**/*.js', () => {
        gulp.src('app/js/main.js')
            .pipe(webpack(webpackconf))
            .pipe(gulp.dest('dist/js'));
    });

    gulp.watch('app/css/*.css', () => {
        gulp.src([
            'app/css/form.css',
            'app/css/preloader.css',
            'app/css/style.css',
            'app/css/media.css'
        ])
            .pipe(concat('main.css'))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpif(NODE_ENV, cssnano()))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('dist/css'))
    });



});
