module.exports = function (grunt) {

    grunt.initConfig({
        'serve': {
            'path': 'app'
        }
    });
    grunt.loadNpmTasks('grunt-serve');
    grunt.registerTask('default', ['serve']);
};
