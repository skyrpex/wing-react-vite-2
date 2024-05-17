bring cloud;
bring expect;
// bring vite;
bring "./vite/vite.w" as vite;

// Winglang doesn't have a built-in support for __dirname yet, so we use a workaround to get the current directory.
// @see tracking issue: https://github.com/winglang/wing/issues/3736
class Utils {
  extern "utils.js" pub static __dirname(): str;
}

let website = new vite.Vite(
  root: "{Utils.__dirname()}/../frontend",
  publicEnv: {
    TITLE: "Wing + Vite + React",
  }
) as "Vite Website"; 
