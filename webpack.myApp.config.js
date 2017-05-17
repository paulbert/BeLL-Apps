var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');
    
var tsLintOpts = {
    configuration: {
        rules: {
            'no-import-side-effect':true,
            'curly':true,
            'forin':true,
            'no-conditional-assignment':true,
            'no-duplicate-variable':true,
            'no-construct':true,
            'no-empty':true,
            'no-eval':true,
            'no-switch-case-fall-through':true,
            'typeof-compare':true,
            'indent':[true,'spaces'],
            'arrow-return-shorthand':true,
            'prefer-switch': ['true',{'min-cases':3}]
        }
    }
};

module.exports = {
    entry:{
        'app':'./app/myApp/src/main.ts',
        'vendor':'./app/myApp/vendor.ts',
        'polyfills':'./app/myApp/polyfills.ts'
    },
    output:{
        path:path.resolve(__dirname,'app/myApp')
    },
    module:{
        rules:[
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude:/(node_modules)/,
                options: tsLintOpts
            },
            {
                test:/\.ts$/,
                loaders:[/*'tslint-loader',*/'ts-loader'],
                exclude:/(node_modules)/
            },
            {
                test:/\.s?css$/,
                loaders:['style-loader','css-loader','sass-loader']
            }
        ]
    },
    devtool:'source-map',
    resolve:{modules: ['node_modules'],extensions:['.ts','.js']},
    plugins: [
    // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname,'./app/myApp/src/'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: 'app/myApp/src/index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor','polyfills']
        })
    ]
};
