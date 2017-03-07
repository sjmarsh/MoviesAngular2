var gulp = require('gulp');
var fs = require('fs');

var awsConfig = JSON.parse(fs.readFileSync('c:\\aws\\awsaccess.json'));
var s3 = require('gulp-s3-upload')(awsConfig);

/*
Ref: https://www.npmjs.com/package/gulp-s3-upload
     http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
*/
gulp.task('publish', function() {
  return gulp.src("./dist/**")
        .pipe(s3({
            Bucket: 'movies-angular2',  
            ACL:    'public-read'       
        }, {
            maxRetries: 5
        }))
    ;
});


gulp.task('default', ['publish']);