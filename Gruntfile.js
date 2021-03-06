module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        'serve': {
            'path': 'app'
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/style.css': 'src/style.scss'
                }
            }
        },

        typescript: {
            base: {
                src: ['src/*.ts'],
                dest: 'dist/script.js',
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
    grunt.registerTask('default', ['sass', 'typescript', 'copy']);
};
