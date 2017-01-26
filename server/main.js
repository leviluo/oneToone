import Koa from 'koa'
import convert from 'koa-convert'
import webpack from 'webpack'
import webpackConfigClient from '../build/webpack.config.client'
import historyApiFallback from 'koa-connect-history-api-fallback'
import serve from 'koa-static'
import proxy from 'koa-proxy'
import fs from 'fs-extra'
import _debug from 'debug'
import config from '../config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import universalMiddleware from './middleware/universal'
import routers from './routers'
import bodyParser from 'koa-bodyparser'
// import session from 'koa-session'
// var session = require('koa-session-redis');
var session = require('koa-session');
const router = require('koa-router')();
const debug = _debug('app:server')
const paths = config.utils_paths

export default async() => {
    const app = new Koa()
    app.keys = ['leviluo'];
    var CONFIG = {
        key: 'koa:sess',
        /** (string) cookie key (default is koa:sess) */
        maxAge: 18640000,
        /** (number) maxAge in ms (default is 1 days) */
        overwrite: true,
        /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
    };
    app.use(convert(session(CONFIG, app)));

    app.use(bodyParser());
    routers(router);
    app.use(router.routes())

    app.on('error', function(err) {
        log.error('server error', err);
    });

    var clientInfo

    // Enable koa-proxy if it has been enabled in the config.
    if (config.proxy && config.proxy.enabled) {
        app.use(convert(proxy(config.proxy.options)))
    }

    if (!config.universal || !config.universal.enabled) {
        // This rewrites all routes requests to the root /index.html file
        // (ignoring file requests).
        debug('Enable HistoryApiFallback middleware.')
        app.use(convert(historyApiFallback({
            verbose: false
        })))
    }

    // ------------------------------------
    // Apply Webpack HMR Middleware
    // ------------------------------------
    if (config.env === 'development') {
        const compiler = webpack(webpackConfigClient)

        // Enable webpack-dev and webpack-hot middleware
        const { publicPath } = webpackConfigClient.output

        // Catch the hash of the build in order to use it in the universal middleware
        config.universal && config.universal.enabled && compiler.plugin('done', stats => {
            // Create client info from the fresh build
            clientInfo = {
                assetsByChunkName: {
                    app: `app.${stats.hash}.js`,
                    vendor: `vendor.${stats.hash}.js`
                }
            }
        })

        app.use(webpackDevMiddleware(compiler, publicPath))
        app.use(webpackHMRMiddleware(compiler))

        // Serve static assets from ~/src/static since Webpack is unaware of
        // these files. This middleware doesn't need to be enabled outside
        // of development since this directory will be copied into ~/dist
        // when the application is compiled.
        app.use(serve(paths.src('static')))
    } else {
        if (config.universal.enabled) {
            // Get assets from client_info.json
            debug('Read client info.')
            fs.readJSON(paths.dist(config.universal.client_info), (err, data) => {
                if (err) {
                    clientInfo = {}
                    debug('Failed to read client_data!')
                    return
                }
                clientInfo = data
            })
        } else {
            debug(
                'Server is being run outside of live development mode, meaning it will ' +
                'only serve the compiled application bundle in ~/dist. Generally you ' +
                'do not need an application server for this and can instead use a web ' +
                'server such as nginx to serve your static files. See the "deployment" ' +
                'section in the README for more information on deployment strategies.'
            )
        }

        // Serving ~/dist by default. Ideally these files should be served by
        // the web server and not the app server when universal is turned off,
        // but this helps to demo the server in production.
        app.use(serve(paths.public()))
    }

    if (config.universal && config.universal.enabled) {
        let um = await universalMiddleware()
        app.use(um.default(() => clientInfo))
    }

    return Promise.resolve(app)
}
