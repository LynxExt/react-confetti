import { useState } from "react";
import { createRoot } from "react-dom/client";
import Confetti from "../src/index";

type DemoKey = "boom-default" | "boom-strong" | "boom-rainbow" | "boom-corner";

const DEMOS: { key: DemoKey; title: string; subtitle: string }[] = [
	{ key: "boom-default", title: "Default boom", subtitle: "centered, gentle" },
	{ key: "boom-strong", title: "Strong launch", subtitle: "launchSpeed: 2" },
	{ key: "boom-rainbow", title: "Rainbow", subtitle: "custom palette" },
	{ key: "boom-corner", title: "Corner burst", subtitle: "x: 0.1, deg: 315" },
];

const RAINBOW = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];

const Demo = ({ which, run }: { which: DemoKey; run: number }) => {
	const key = `${which}-${run}`;
	if (which === "boom-default") return <Confetti key={key} />;
	if (which === "boom-strong") return <Confetti key={key} launchSpeed={2} particleCount={60} />;
	if (which === "boom-rainbow") return <Confetti key={key} colors={RAINBOW} particleCount={80} />;
	if (which === "boom-corner")
		return <Confetti key={key} x={0.15} y={0.85} deg={315} spreadDeg={45} particleCount={50} />;
	return null;
};

const App = () => {
	const [activeBoom, setActiveBoom] = useState<DemoKey | null>(null);
	const [bursts, setBursts] = useState(0);
	const [fallOn, setFallOn] = useState(false);

	const fire = (key: DemoKey) => {
		setActiveBoom(key);
		setBursts((n) => n + 1);
	};

	return (
		<>
			<h1>react-confetti</h1>
			<p>
				A small canvas confetti component. Click a boom variant to fire a single burst, or toggle
				fall mode for continuous rain.
			</p>

			<div className="demo-grid">
				{DEMOS.map((demo) => (
					<div className="demo-card" key={demo.key}>
						<h2>{demo.title}</h2>
						<span>{demo.subtitle}</span>
						<button type="button" onClick={() => fire(demo.key)}>
							Fire
						</button>
					</div>
				))}
				<div className="demo-card">
					<h2>Fall mode</h2>
					<span>continuous rain from the top</span>
					<button type="button" data-active={fallOn} onClick={() => setFallOn((on) => !on)}>
						{fallOn ? "Stop" : "Start"} fall
					</button>
				</div>
			</div>

			{activeBoom && <Demo which={activeBoom} run={bursts} />}
			{fallOn && <Confetti mode="fall" particleCount={150} colors={RAINBOW} />}
		</>
	);
};

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
