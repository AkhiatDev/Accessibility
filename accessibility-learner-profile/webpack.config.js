module.exports = {
    entry: './app/components/Main.js',
    output: {
        filename: 'public/bundle.js'
    },
	node: {fs: "empty"},
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};