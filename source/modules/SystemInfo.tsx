import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import os from 'os';
import path from 'path';
import fs from 'fs';

const SystemInfo = () => {
    const [ramUsage, setRamUsage] = useState(0);
    const [cpuUsage, setCpuUsage] = useState(0);

    useEffect(() => {
        let prevIdle = 0;
        let prevTotal = 0;

        const calculateCPU = () => {
            const cpus = os.cpus();
            let idle = 0;
            let total = 0;

            cpus.forEach((core) => {
                for (const type in core.times) {
                    total += core.times[type as keyof typeof core.times];
                }
                idle += core.times.idle;
            });

            const diffIdle = idle - prevIdle;
            const diffTotal = total - prevTotal;

            const usage = 100 - Math.round((diffIdle / diffTotal) * 100);

            prevIdle = idle;
            prevTotal = total;

            return usage;
        };

        const interval = setInterval(() => {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const ram = Math.round((usedMem / totalMem) * 100);
            setRamUsage(ram);

            const cpu = calculateCPU();
            setCpuUsage(cpu);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const projectPath = process.cwd();
    const isYarn = fs.existsSync(path.join(projectPath, 'yarn.lock'));
    const packageManager = isYarn ? 'yarn' : 'npm';
    const cpus = os.cpus().length;
    const uptime = os.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`;

    return (
        <Box flexDirection="column">
            <Text>💻 Información del sistema:</Text>
            <Text>📂 Proyecto: <Text color="cyan">{path.basename(projectPath)}</Text></Text>
            <Text>📍 Ruta: {projectPath}</Text>
            <Text>🧱 Node.js: <Text color="green">{process.version}</Text></Text>
            <Text>📦 Gestor de paquetes: {packageManager}</Text>
            <Text>🧮 CPUs: {cpus}</Text>
            <Text>⏱️  Uptime: {uptimeFormatted}</Text>
            <Text>⚙️  Uso CPU: {renderBar(cpuUsage)} {cpuUsage}%</Text>
            <Text>🧠 Uso RAM: {renderBar(ramUsage)} {ramUsage}%</Text>
        </Box>
    );
};

const renderBar = (percent: number, size = 20): string => {
    const filled = Math.round((percent / 100) * size);
    return '▇'.repeat(filled).padEnd(size, '─');
};

export default SystemInfo;
