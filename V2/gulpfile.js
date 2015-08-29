var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');

gulp.task("transpile", function(){
	return gulp.src(["server/**/*.ts", '!./node_modules/**'])
		.pipe(ts({module : "commonjs"}))
		.on("error", function(){
			this.emit('end');
		})
		.pipe(gulp.dest("server/"));
});

gulp.task("copyfiles", function(){
	return gulp.src(["client/**/*.html", "client/**/*.css"])
		.pipe(gulp.dest("dist/client"));
});

gulp.task("copyjsfiles", ["transpile"], function(){
	return gulp.src(["server/**/*.js", '!./node_modules/**'])
		.pipe(gulp.dest("dist/server"));
});

gulp.task('startserver', ["copyjsfiles", "copyfiles" ], function () {
  return nodemon({
    script: 'dist/server/server.js',
	env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('openapp', ['startserver'], function () {
  return gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:3000'}));
})

gulp.task('default', ["openapp"]);


gulp.task("watchmyfiles", function(){
	gulp.watch(["server/**/*.ts"], ['transpile']);
});
