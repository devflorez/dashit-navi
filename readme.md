# 🧭 dashit-navi

Una TUI (Text-based UI) desarrollada con [Ink](https://github.com/vadimdemedes/ink), pensada para facilitar la administración de proyectos Node.js desde la terminal.

> ⚡ Minimalista, rápida y modular.

---

## 🚀 Módulos actuales

| Módulo                  | Descripción                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| `Resumen`               | Muestra nombre del proyecto, ruta, gestor de paquetes, Node y número de deps. |
| `Scripts`               | Lista y permite ejecutar scripts desde `package.json`.                      |
| `Dependencias`          | Muestra dependencias desactualizadas y permite actualizarlas.              |
| `Mantenimiento`         | Acciones como limpiar `node_modules`, reinstalar, limpiar cache, etc.      |
| `Sistema`               | Info en tiempo real de CPU, RAM, versión de Node, uptime, etc.             |
| `Gestor de paquetes`    | Permite cambiar entre `npm`, `yarn` y `pnpm`, y actualiza `packageManager`. |
| `Git`                   | Estado actual del repo y comandos rápidos como `add`, `commit`, `push`.    |

---

## 📦 Instalación

```bash
git clone https://github.com/devflorez/dashit-navi.git
cd dashit-navi
npm install
npm run build
npm start
```

O si quieres usarlo desde el binario directamente:

```bash
npm run build && node dist/cli.js
```

---

## 🛠️ Por hacer

- [ ] Monitoreo de procesos de scripts externos.
- [ ] Configuración global y `.dashitrc`.
- [ ] Soporte multi-workspace.
- [ ] Exportar reportes (`deps`, `audit`, `system`) a archivo.

---

## 🤝 Contribuir

¡Toda contribución es bienvenida! Puedes:

1. Hacer un fork
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Enviar un PR con una buena descripción

---

## 📄 Licencia

MIT © [devflorez](https://github.com/devflorez)
