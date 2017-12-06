module.exports = function (grunt) {
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'sass': {
            'dist': {
                'files': {
                    '<%= pkg.static %>/css/admin.css': 'styles/admin.scss'
                }
            }
        },
        'cssmin': {
            'dist': {
                'files': {
                    '<%= pkg.static %>/css/admin.min.css': '<%= pkg.static %>/css/admin.css'
                }
            }
        },
        'watch': {
            'backend-styles': {
                'files': [
                    'styles/*.scss'
                ],
                'tasks': ['backend-styles']
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
