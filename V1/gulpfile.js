var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');

gulp.task("transpile", function(){
	return gulp.src(["src/**/*.ts", '!./node_modules/**'])
		.pipe(ts())
		.on("error", function(){
			this.emit('end');
		})
		.pipe(gulp.dest("src/"));
});

gulp.task("copyfiles", function(){
	return gulp.src(["src/**/*.html", "src/**/*.css"])
		.pipe(gulp.dest("build/"));
});

gulp.task("copyjsfiles", ["transpile"], function(){
	return gulp.src(["src/**/*.js", '!./node_modules/**'])
		.pipe(gulp.dest("build/"));
});

gulp.task('startserver', ["copyjsfiles", "copyfiles" ], function () {
  return nodemon({
    script: 'build/server.js',
	env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('openapp', ['startserver'], function () {
  return gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:3000'}));
})

gulp.task('default', ["openapp"]);


gulp.task("watchmyfiles", function(){
	gulp.watch(["src/**/*.ts"], ['transpile']);
});
