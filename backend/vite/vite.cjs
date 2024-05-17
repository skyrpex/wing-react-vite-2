const { spawnSync, spawn } = require("node:child_process");
const { parsePayload } = require("./util.cjs");

exports.cliFilename = () => `${__dirname}/vite-cli.mjs`;

exports.build = (options) => {
  const args = [
    options.cliFilename,
    "build",
    "--options",
    JSON.stringify(options),
  ];

  const buffer = spawnSync("node", args, {
    cwd: options.root,
    env: {
      HOME: options.homeEnv,
      PATH: options.pathEnv,
      NODE_ENV: "production",
    },
  });
  const output = buffer.stdout.toString().split("\n");
  console.log(output.slice(1).join("\n"));
  return parsePayload(output[0]).outDir;
};

exports.dev = async (options) => {
  const args = [
    options.cliFilename,
    "dev",
    "--options",
    JSON.stringify(options),
  ];

  console.log("vite.cjs dev args", args);

  const child = spawn("node", args, {
    cwd: options.root,
    env: {
      HOME: options.homeEnv,
      PATH: options.pathEnv,
    },
  });

  child.stderr.on("data", (chunk) => {
    console.error("vite.cjs dev stderr", chunk.toString());
  });

  const kill = () => child.kill("SIGINT");

  return new Promise((resolve) => {
    child.stdout.on("data", (chunk) => {
      const payload = parsePayload(chunk.toString());
      if (payload) {
        resolve({
          url: () => payload.url,
          kill,
        });
        child.stdout.removeAllListeners("data");
        child.stdout.on("data", (chunk) => {
          console.log(chunk.toString());
        });
      }
    });
  });
};
