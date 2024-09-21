import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: "development", // No minification, compression, etc.
  devServer: {
    static: {
      directory: path.join(__dirname, "src"), // Serve files from the 'src' folder
    },
    compress: false, // Disable compression
    port: 3000, // Run on localhost:8080
    hot: false, // Disable Hot Module Replacement
    liveReload: true, // Enable live reloading if files change
    open: true, // Automatically open the browser when server starts
    allowedHosts: "all", // Allow all hosts to access the dev server
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Output location for any bundled files
  },
};
