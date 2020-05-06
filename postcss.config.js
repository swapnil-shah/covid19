module.exports = {
	plugins: [
	       require('cssnano')({
            preset: 'default',
        }),
		require('autoprefixer'),
		require('@fullhuman/postcss-purgecss')({
			content: ['./**/*.html']
		})
	]
};
