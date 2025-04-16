import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Select } from '@inkjs/ui';
import { registerScript, updateScriptStatus } from '../helpers/processRegistry.js';

interface Props {
	onSetWaiting: (value: boolean) => void;
}

const Scripts = ({ onSetWaiting }: Props) => {
	const [scripts, setScripts] = useState<Record<string, string>>({});
	const [waiting, setWaiting] = useState(false);
	const [currentScript, setCurrentScript] = useState<string | null>(null);
	const [output, setOutput] = useState<string[]>([]);

	useEffect(() => {
		const pkgPath = path.join(process.cwd(), 'package.json');
		if (!fs.existsSync(pkgPath)) return;
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
		setScripts(pkg.scripts ?? {});
	}, []);

	useInput(() => {
		if (waiting) {
			setWaiting(false);
			setCurrentScript(null);
			onSetWaiting(false);
			setOutput([]);
		}
	});

	const handleRun = (script: string) => {
		setCurrentScript(script);
		setWaiting(true);
		onSetWaiting(true);
		setOutput([`🚀 Ejecutando: ${script}\n`]);

		const child = spawn('npm', ['run', script], {
			stdio: 'pipe',
			shell: true
		});

		const id = registerScript(script, child.pid);

		child.stdout.on('data', (data) => {
			setOutput((prev) => [...prev, data.toString()]);
		});

		child.stderr.on('data', (data) => {
			setOutput((prev) => [...prev, `❌ ${data.toString()}`]);
		});

		child.on('close', (code) => {
			updateScriptStatus(id, 'completed');
			setOutput((prev) => [...prev, `\n✅ Script terminado con código ${code}`]);
		});
	};

	const options = Object.entries(scripts).map(([key, value]) => ({
		label: `${key} → ${value}`,
		value: key,
	}));

	if (!Object.keys(scripts).length) {
		return <Text color="gray">📜 No se encontraron scripts.</Text>;
	}

	return (
		<Box flexDirection="column">
			<Text>📜 Scripts disponibles:</Text>
			{!waiting && <Select options={options} onChange={handleRun} />}

			{waiting && (
				<Box flexDirection="column" marginTop={1}>
					<Text color="cyan">🟢 Ejecutando: {currentScript}</Text>
					{output.map((line, i) => (
						<Text key={`${line}-${i}`}>{line.trim()}</Text>
					))}
					<Text color="gray">Presiona cualquier tecla para volver</Text>
				</Box>
			)}
		</Box>
	);
};

export default Scripts;
