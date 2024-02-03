import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default 
{
    "entry":["./src/index.tsx"],
    "watch": false,
    "module": {
        "rules": [
            {
                "test": /\.tsx?$/,
                "use": 'ts-loader',
                "exclude": /node_modules/,
            },
            {
                "test": /\.jsx?/,
                "loader": 'babel-loader',
                "options": {
                    "presets": ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                "test": /\.css$/,
                "use": ['style-loader', 'css-loader']
            }
        ],
    },
    'resolve': {
        'extensions': ['.tsx', '.ts', '.js'],
    },
    "plugins": [new HtmlWebpackPlugin({
        title: ""
    })],
    "output": {
        "filename": "bundle.js",
        "path": path.resolve(__dirname, 'dist'),
        "library": "main"
    }
}