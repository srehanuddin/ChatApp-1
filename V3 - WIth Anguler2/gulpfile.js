var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');

var options = {
	"target": "es5",
    "module": "commonjs",
	"emitDecoratorMetadata": true,
	"experimentalDecorators": true
}

gulp.task("transpileServer", function(){
	return gulp.src(["server/**/*.ts", '!./node_modules/**'])
		.pipe(ts(options))
		.on("error", function(){
			this.emit('end');
		})
		.pipe(gulp.dest("server/"));
});

gulp.task("transpileClient", function(){
	return gulp.src(["client/**/*.ts"])
		.pipe(ts(options))
		.on("error", function(){
			this.emit('end');
		})
		.pipe(gulp.dest("client/"));
});

gulp.task("copyfiles", function(){
	return gulp.src(["client/**/*.html", "client/**/*.css"])
		.pipe(gulp.dest("dist/client"));
});

//gulp.task('transpile', ["transpileServer", "transpileClient"]);


gulp.task("copyjsfilesServer", ["transpileServer"], function(){
	return gulp.src(["server/**/*.js", '!./node_modules/**'])
		.pipe(gulp.dest("dist/server"));
});

gulp.task("copyjsfilesClient", ["transpileClient"], function(){
	return gulp.src(["client/**/*.js", '!./node_modules/**'])
		.pipe(gulp.dest("dist/client"));
});

gulp.task('startserver', ["copyjsfilesServer", "copyjsfilesClient", "copyfiles" ], function () {
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
