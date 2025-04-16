import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { spawn } from 'child_process';
import { Select } from '@inkjs/ui';

type Step = 'menu' | 'result';

const Maintenance = () => {
	const [step, setStep] = useState<Step>('menu');
	const [output, setOutput] = useState<string[]>([]);
	const [waitingKey, setWaitingKey] = useState(false);

	const actions: Record<string, { label: string; command: [string, string[]] }> = {
		cleanNodeModules: {
			label: '🔥 Eliminar node_modules',
			command: ['rm', ['-rf', 'node_modules']],
		},
		clearCache: {
			label: '🗑️  Limpiar caché de npm',
			command: ['npm', ['cache', 'clean', '--force']],
		},
		reinstall: {
			label: '♻️  Reinstalar dependencias',
			command: ['npm', ['install']],
		},
		removeBuild: {
			label: '📁 Eliminar carpetas de build (dist, .next, etc)',
			command: ['rm', ['-rf', 'dist', '.turbo', '.next']],
		},
	};

	const handleAction = (key: string) => {
		const action = actions[key];
		if (!action) return;

		setOutput([]);
		setStep('result');

		const [command, args] = action.command;

		const proc = spawn(command, args, {
			stdio: 'pipe',
			shell: true,
		});

		proc.stdout.on('data', (data) => {
			setOutput((prev) => [...prev, `🟢 ${data.toString().trim()}`]);
		});

		proc.stderr.on('data', (data) => {
			setOutput((prev) => [...prev, `🔴 ${data.toString().trim()}`]);
		});

		proc.on('close', (code) => {
			if (code === 0) {
				setOutput((prev) => [...prev, `✅ ${action.label} completado`]);
			} else {
				setOutput((prev) => [
					...prev,
					`❌ Error al ejecutar ${action.label} (código: ${code})`,
				]);
			}
			setWaitingKey(true);
		});
	};

	useEffect(() => {
		if (!waitingKey) return;

		const handleKey = () => {
			setWaitingKey(false);
			setOutput([]);
			setStep('menu');
		};

		process.stdin.setRawMode?.(true);
		process.stdin.resume();
		process.stdin.once('data', handleKey);

		return () => {
			process.stdin.off('data', handleKey);
		};
	}, [waitingKey]);

	if (step === 'result') {
		return (
			<Box flexDirection="column">
				<Text>🧾 Resultado:</Text>
				{output.map((line) => (
					<Text key={line}>{line}</Text>
				))}
				<Text color="gray">Presiona cualquier tecla para volver</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Text>🧼 Opciones de limpieza y mantenimiento:</Text>
			<Select
				options={Object.entries(actions).map(([value, { label }]) => ({
					label,
					value,
				}))}
				onChange={handleAction}
			/>
		</Box>
	);
};

export default Maintenance;
