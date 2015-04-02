module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        'serve': {
            'path': 'app'
        },

        typescript: {
            base: {
                src: ['src/*.ts'],
                dest: 'dist',
                options: {
                    module: 'amd',
                    target: 'es5',
                    basePath: 'src',
                    sourceMap: true,
                    declaration: false
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src', src: ['images/**'], dest: 'dist'},
                    {expand: true, cwd: 'src', src: ['index.html'], dest: 'dist'},
                    {expand: true, cwd: 'src', src: ['style.css'], dest: 'dist'}
                ]
            }
        }


    });
    grunt.registerTask('default', ['typescript', 'copy']);
};
