# Econom-IA - Gestión financiera personal inteligente

> Una aplicación web orientada a la gestión financiera cotidiana, comparación de precios y asistencia económica mediante IA.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Descripción

Econom-IA busca centralizar herramientas para tomar mejores decisiones sobre el dinero: registro de movimientos, control de ingresos y gastos, comparación de precios, análisis económico y un copiloto de IA con contexto financiero.

La aplicación está diseñada para evolucionar desde un MVP local hacia una arquitectura con servicios backend, autenticación, límites de uso de IA y opciones de monetización.

## Características principales

### Gestión financiera

- Registro de ingresos y gastos.
- Edición y eliminación con confirmación.
- Validación de montos, campos obligatorios y fechas.
- Balance entre ingresos y gastos.
- Persistencia centralizada mediante el servicio `src/services/storage`.
- Estados vacíos, loading, skeletons y notificaciones de éxito/error.

### Herramientas económicas

- Lista de compras inteligente.
- Comparación de precios.
- Radar e índice barrial.
- Calculadora de inflación.
- Escáner de tickets.
- Modo jubilado con interfaz simplificada.
- Herramientas de análisis y planificación económica.

### Copiloto IA

- Consultas sobre presupuesto y gastos.
- Contexto basado en el perfil financiero.
- Respuestas locales de fallback cuando no está disponible el backend de IA.
- Estado visual durante el procesamiento de consultas.

> La integración directa con proveedores de IA desde el frontend fue retirada. Las credenciales deben vivir exclusivamente en un backend.

## Tech Stack

| Tecnología | Uso |
| --- | --- |
| React 19 | UI y composición de componentes |
| Vite 6 | Desarrollo y build |
| Tailwind CSS 4 | Sistema visual y estilos |
| Lucide React | Iconografía |
| Browser Local Storage | Persistencia local actual |
| JavaScript / JSX | Código de aplicación |

La configuración actual del proyecto define `npm run dev`, `npm run build` y `npm run preview`. fileciteturn52file0

## Arquitectura

La estructura frontend está organizada por responsabilidad y feature:

```text
src/
├── App.jsx
├── components/
│   ├── feedback/
│   ├── layout/
│   └── ui/
├── features/
│   ├── ai-advisor/
│   ├── budgets/
│   ├── dashboard/
│   └── transactions/
├── hooks/
├── services/
│   ├── ai/
│   ├── api/
│   └── storage/
├── data/
├── index.css
└── main.jsx
```

### Principios actuales

- `features/` concentra comportamiento específico del producto.
- `components/` contiene piezas reutilizables de UI, layout y feedback.
- `services/` encapsula persistencia e integraciones externas.
- `hooks/` concentra lógica reutilizable de React.
- El acceso a los datos financieros debe pasar por servicios, evitando `localStorage` disperso por los componentes.

## Instalación local

### Requisitos

- Node.js compatible con Vite.
- npm.
- Git.

### Clonar el repositorio

```bash
git clone https://github.com/rechimonth/econom-ia.git
cd econom-ia
```

### Instalar dependencias

```bash
npm install
```

### Configuración de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

La configuración frontend pública utiliza `VITE_AI_API_URL`. No coloques API keys privadas en variables `VITE_*`.

### Ejecutar en desarrollo

```bash
npm run dev
```

La configuración actual inicia Vite en el puerto `3000`.

### Crear build de producción

```bash
npm run build
```

### Previsualizar el build

```bash
npm run preview
```

## Seguridad

Econom-IA separa explícitamente la configuración pública del frontend de los secretos del servidor.

### Reglas

1. No almacenar API keys privadas en el código React.
2. No usar `VITE_*` para secretos.
3. Las llamadas a proveedores de IA deben pasar por un backend seguro.
4. Validar y limitar el uso de IA del lado servidor cuando exista autenticación y monetización.
5. Evitar registrar prompts o información financiera sensible innecesariamente.
6. Mantener `.env` fuera del control de versiones.
7. Implementar autenticación, autorización y rate limiting antes de exponer servicios de IA públicamente.

> La versión actual prepara el frontend para un endpoint backend de IA. El backend real todavía debe implementarse.

## Roadmap

### Fase 1 — Arquitectura ✅

- Arquitectura frontend basada en features.
- Servicios de persistencia centralizados.
- Separación de UI, features y servicios.

### Fase 2 — UX/UI P0 ✅

- Flujo de movimientos financieros.
- Validaciones.
- Empty states.
- Skeletons y loading states.
- Toast notifications.
- Confirmación antes de eliminar.

### Fase 3 — Seguridad IA ✅

- Eliminación de secretos del frontend.
- Servicio de IA preparado para backend.
- Estado visual de procesamiento.

### Fase 4 — Documentación ✅

- README profesional.
- Arquitectura documentada.
- Instalación y seguridad documentadas.

### Próximas fases

- Backend seguro para IA.
- Autenticación y cuentas de usuario.
- Límites de consumo de IA.
- Freemium / Pro.
- Persistencia remota.
- Empaquetado de escritorio con Tauri.
- Observabilidad, tests automatizados y CI/CD.

## Desarrollo

Antes de abrir un cambio importante:

```bash
git checkout main
git pull origin main
npm install
npm run dev
```

Antes de publicar:

```bash
npm run build
```

Los cambios funcionales deben priorizar:

- Seguridad de datos financieros.
- Claridad de la interfaz.
- Compatibilidad con dispositivos móviles.
- Separación entre UI, dominio y servicios.
- Evitar dependencia innecesaria de proveedores externos.

## Estado del proyecto

Econom-IA se encuentra en evolución activa. La aplicación cuenta actualmente con una base React/Vite/Tailwind estructurada para continuar agregando backend, autenticación, IA segura y monetización sin rehacer la arquitectura frontend.

## Licencia

La licencia debe definirse antes de una distribución pública/comercial definitiva.
