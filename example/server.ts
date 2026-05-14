import index from "./index.html";

const server = Bun.serve({
	port: Number(process.env.PORT) || 5173,
	routes: { "/": index },
	development: { hmr: true, console: true },
});

console.log(`Example running at ${server.url}`);
