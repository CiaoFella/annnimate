import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  mode: 'development', // No minification, compression, etc.
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // Serve files from the 'src' folder
    },
    compress: false, // Disable compression
    port: 3000, // Run on localhost:3000
    hot: false, // Disable Hot Module Replacement
    liveReload: true, // Enable live reloading if files change
    open: true, // Automatically open the browser when server starts
    allowedHosts: 'all', // Allow all hosts to access the dev server

    // Add headers to disable CORS
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Allow all methods
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization', // Allow headers
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output location for any bundled files
  },
}
