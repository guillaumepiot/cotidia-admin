module.exports = function (grunt) {
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'sass': {
            'dist': {
                'options': {
                    'loadPath': require('node-neat').includePaths.concat(require('node-bourbon').includePaths)
                },
                'files': {
                    '<%= pkg.static %>/css/backend.css': 'styles/backend.scss'
                }
            }
        },
        'cssmin': {
            'dist': {
                'files': {
                    '<%= pkg.static %>/css/backend.min.css': '<%= pkg.static %>/css/backend.css'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-sass')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('backend-styles', [
        'sass',
        'cssmin'
    ])
    grunt.registerTask('watch-backend-styles', ['watch:backend-styles'])
}
