import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Select, TextInput } from '@inkjs/ui';

interface DependenciesProps {
    onSetWaiting: (waiting: boolean) => void;
}

const Dependencies = ({ onSetWaiting }: DependenciesProps) => {
    const [deps, setDeps] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);
    const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
    const [step, setStep] = useState<'list' | 'action' | 'input' | 'result'>('list');
    const [output, setOutput] = useState<string[]>([]);

    const handleUpdate = (pkg: string, version: string) => {
        setOutput([]);
        setStep('result');

        const proc = spawn('npm', ['install', `${pkg}@${version}`], {
            stdio: 'pipe',
            shell: true
        });

        proc.stdout.on('data', (data) => {
            setOutput(prev => [...prev, `🟢 ${data.toString().trim()}`]);
        });

        proc.stderr.on('data', (data) => {
            setOutput(prev => [...prev, `🔴 ${data.toString().trim()}`]);
        });

        proc.on('close', (code) => {
            if (code === 0) {
                setOutput(prev => [...prev, `✅ ${pkg} actualizado con éxito a ${version}`]);
            } else {
                setOutput(prev => [...prev, `❌ Falló la actualización de ${pkg}. Código de salida: ${code}`]);
            }
        });
    };

    const loadDependencies = () => {
        try {
            const isYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));
            const result = spawnSync(isYarn ? 'yarn' : 'npm', ['outdated', '--json'], {
                encoding: 'utf8',
                shell: true,
            });
            const rawOutput = result.stdout?.trim() ?? '';
            const parsed = JSON.parse(rawOutput);
            setDeps(parsed);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? 'Error al obtener dependencias');
        }
    };

    useEffect(() => {
        if (step === 'list') {
            loadDependencies();
            onSetWaiting(false);
        } else {
            onSetWaiting(true);
        }
    }, [step]);

    useEffect(() => {
        try {
            const isYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));
            const result = spawnSync(
                isYarn ? 'yarn' : 'npm',
                ['outdated', '--json'],
                {
                    encoding: 'utf8',
                    shell: true,
                    stdio: ['pipe', 'pipe', 'pipe']
                }
            );

            const rawOutput = result.stdout?.trim() ?? '';
            const parsed = JSON.parse(rawOutput);
            setDeps(parsed);
        } catch (err: any) {
            setError(err.message ?? 'Error al obtener dependencias');
        }
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

    const options = Object.entries(deps).map(([pkg, info]: any) => ({
        label: `${pkg}: ${info.current} → ${info.latest}`,
        value: pkg,
    }));


    if (error) return <Text color="red">❌ {error}</Text>;

    if (!Object.keys(deps || {}).length) {
        return <Text color="gray">⏳ Buscando dependencias desactualizadas...</Text>;
    }

    if (Object.keys(deps).length && step === 'list') {
        return (
            <Box flexDirection="column">
                <Text>📦 Dependencias desactualizadas:</Text>
                <Select
                    options={options}
                    onChange={(pkg) => {
                        setSelectedPkg(pkg);
                        setStep('action');
                    }}
                />
            </Box>
        );
    }

    if (step === 'action' && selectedPkg) {
        return (
            <Select
                options={[
                    { label: '⬆️  Actualizar a última versión', value: 'latest' },
                    { label: '📌 Elegir versión específica', value: 'custom' },
                ]}
                onChange={(choice) => {
                    if (choice === 'latest') {
                        handleUpdate(selectedPkg, 'latest');
                    } else {
                        onSetWaiting?.(true);
                        setStep('input');
                    }
                }}
            />
        );
    }

    if (step === 'input' && selectedPkg) {
        return (
            <Box flexDirection="column">
                <Text>🔢 Ingresa la versión para <Text color="cyan">{selectedPkg}</Text>:</Text>
                <TextInput
                    placeholder="ej: ^1.2.3"
                    onSubmit={(value) => {
                        handleUpdate(selectedPkg, value);
                        onSetWaiting?.(false);
                    }}
                />
            </Box>
        );
    }

    if (step === 'result') {
        return (
            <Box flexDirection="column">
                <Text>📦 Resultado de la instalación:</Text>
                {output.map((line) => (
                    <Text key={line}>{line}</Text>
                ))}
                <Text color="gray">Presiona cualquier tecla para volver</Text>
            </Box>
        );
    }

    return null;
};

export default Dependencies;
