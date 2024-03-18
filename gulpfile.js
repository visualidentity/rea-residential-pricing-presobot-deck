var gulp = require('gulp');
var deck_gulp = require('@salespreso/deck-gulp-tasks');
var bourbon = require('bourbon').includePaths;

deck_gulp(gulp, {
    src: "src/",
    dist: "dist/",
    impostor: true,
    excludes: [
        "js/utils/d3_charts/*.js",
        "js/utils/d3_charts/**/*.js",
        "sections/**/*.js"
    ],
    notifications: {
        "error": true,
        "success": true,
        "sounds": true
    },
    autoprefixCss: true,
    autoprefixerOptions: { grid: true },
    sassPaths: [bourbon],
    nunjucks: true,
    docs: true
});
