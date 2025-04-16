import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { exec } from 'child_process';
import { Select, TextInput } from '@inkjs/ui';

const gitCommands = {
	add: 'git add .',
	push: 'git push',
	pull: 'git pull',
} as const;

type GitAction = keyof typeof gitCommands;

const GitStatus = () => {
	const [status, setStatus] = useState<string[]>([]);
	const [step, setStep] = useState<'loading' | 'list' | 'input' | 'result'>('loading');
	const [output, setOutput] = useState<string[]>([]);
	const [action, setAction] = useState<string | null>(null);

	const getGitStatus = () => {
		setStep('loading');
		exec('git status', (_, stdout) => {
			const lines = stdout.split('\n').filter((l) => l.trim());
			setStatus(lines);
			setStep('list');
		});
	};

	const runGitCommand = (command: string) => {
		setStep('result');
		setOutput(['🕒 Ejecutando comando...']);

		exec(command, (_, stdout, stderr) => {
			const out = stdout?.trim();
			const err = stderr?.trim();

			const newOutput: string[] = [];
			if (out) newOutput.push(`🟢 ${out}`);
			if (err) newOutput.push(`🔴 ${err}`);
			if (!out && !err) newOutput.push('✅ Comando ejecutado sin salida.');

			setOutput(newOutput);
		});
	};

	const runGitCommit = (message: string) => {
		runGitCommand(`git commit -m "${message}"`);
	};

	useEffect(() => {
		getGitStatus();
	}, []);

    useEffect(() => {
        if (step !== 'result') return;

        const handler = () => {
            setStep('list');
            setOutput([]);
        };

        process.stdin.setRawMode?.(true);
        process.stdin.resume();
        process.stdin.once('data', handler);

        return () => {
            process.stdin.off('data', handler);
        };
    }, [step]);

	if (step === 'loading') {
		return (
			<Box flexDirection="column">
				<Text color="yellow">♻️ Actualizando estado del repositorio...</Text>
			</Box>
		);
	}

	if (step === 'list') {
		return (
			<Box flexDirection="column">
				<Text>🔍 Estado actual del repositorio:</Text>
				{status.map((line, i) => (
					<Text key={`${line}-${i}`}>{line}</Text>
				))}
				<Select
					options={[
						{ label: '➕ git add .', value: 'add' },
						{ label: '⬆️  git push', value: 'push' },
						{ label: '⬇️  git pull', value: 'pull' },
						{ label: '💬 git commit -m', value: 'commit' },
						{ label: '🔁 Refrescar estado', value: 'refresh' },
					]}
					onChange={(val) => {
						if (val === 'commit') {
							setAction('commit');
							setStep('input');
						} else if (val === 'refresh') {
							getGitStatus();
						} else if (val in gitCommands) {
							runGitCommand(gitCommands[val as GitAction]);
						}
					}}
				/>
			</Box>
		);
	}

	if (step === 'input' && action === 'commit') {
		return (
			<Box flexDirection="column">
				<Text>📝 Ingresa mensaje de commit:</Text>
				<TextInput
					placeholder="Mensaje de commit"
					onSubmit={(value) => {
						runGitCommit(value);
					}}
				/>
			</Box>
		);
	}

	if (step === 'result') {
		return (
			<Box flexDirection="column">
				<Text>📤 Resultado:</Text>
				{output.map((line, i) => (
					<Text key={`${line}-${i}`}>{line}</Text>
				))}
				<Text color="gray">Presiona cualquier tecla para volver</Text>
			</Box>
		);
	}

	return null;
};

export default GitStatus;
