// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.extraNodeModules = {
  // crypto: path.resolve(projectRoot, "node_modules/node-libs-react-native"),
  // crypto: require('node-libs-react-native'),
  stream: require.resolve('readable-stream'),
  crypto: require.resolve('react-native-crypto-js'),
}
// config.resolver.sourceExts = []

module.exports = config;
