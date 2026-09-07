import React, { useState } from 'react';
import { 
  Building2, 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Lock, 
  Award, 
  FileText,
  ChevronRight,
  ArrowRight,
  Globe,
  Share2,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export default function ExecutiveDossier() {
  const [activeSection, setActiveSection] = useState('arquitectura');

  const scalabilityLevels = [
    {
      tier: "1.000 Usuarios (MVP)",
      infra: "Docker Compose / AWS ECS Fargate",
      database: "PostgreSQL 16 (TimescaleDB) Single-node",
      cache: "Redis Standalone 2GB",
      storage: "AWS S3 / Cloudflare R2",
      costoMes: "$ 250 USD",
      latency: "120ms p95"
    },
    {
      tier: "10.000 Usuarios (Lanús & Conurbano)",
      infra: "Kubernetes (EKS) 3 nodes m6i.large",
      database: "PostgreSQL Master + 1 Read Replica",
      cache: "Redis Cluster 8GB + Redis Sentinel",
      storage: "S3 + Cloudflare CDN Edge Cache",
      costoMes: "$ 1.200 USD",
      latency: "85ms p95"
    },
    {
      tier: "100.000 Usuarios (AMBA)",
      infra: "EKS Multi-AZ, HPA Autoscaling, Envoy Gateway",
      database: "PostgreSQL Sharding Citus + ClickHouse OLAP",
      cache: "Redis Enterprise Cluster 32GB + Kafka Bus",
      storage: "MinIO S3 Data Lake + Trino Query Engine",
      costoMes: "$ 7.800 USD",
      latency: "45ms p95"
    },
    {
      tier: "1.000.000 Usuarios (Líder Nacional)",
      infra: "Multi-region Hybrid Kubernetes, eBPF Cilium Mesh",
      database: "CockroachDB / Distributed Citus + ClickHouse Tiered",
      cache: "Global Redis / KeyDB in-memory + Apache Flink Stream",
      storage: "Iceberg / Parquet Data Lakehouse + Spark Streaming",
      costoMes: "$ 38.500 USD",
      latency: "28ms p95"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          <Building2 className="w-4 h-4" />
          <span>Institutional Venture & Engineering Blueprint</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          ECONOM-IA: Dossier Arquitectónico & Modelo Startup
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Especificación integral para fondos de inversión y comité de arquitectura. La empresa está diseñada como 
          un activo de datos soberano con propiedad intelectual del motor de optimización, sin dependencia de proveedores externos de IA.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'arquitectura', label: 'Arquitectura & Escalabilidad', icon: Server },
          { id: 'ia_pipeline', label: 'Pipeline IA Simbólica', icon: Cpu },
          { id: 'datos', label: 'Data Lakehouse & Entidades', icon: Database },
          { id: 'confianza', label: 'Motor Anti-Fraude & Outliers', icon: ShieldCheck },
          { id: 'monetizacion', label: 'Monetización & Unit Economics', icon: DollarSign },
          { id: 'moat', label: 'Moat & Ventajas Inimitables', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Section 1: Arquitectura & Escalabilidad */}
      {activeSection === 'arquitectura' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              Arquitectura de Microservicios Desacoplada
            </h3>
            
            {/* Visual Architecture Topology Diagram */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
              <div className="text-sky-400 font-bold">[CLIENT TIER]</div>
              <div className="pl-4">Mobile App (Flutter/Kotlin Compose) • PWA React • Widget Android/iOS • Merchant Portal</div>
              <div className="text-slate-500">            ↓ HTTPS / gRPC / WSS (Cloudflare Edge SSL + WAF)</div>
              <div className="text-emerald-400 font-bold">[INGRESS & SECURITY TIER]</div>
              <div className="pl-4">Envoy API Gateway (JWT Auth, Rate Limiting Token Bucket, Circuit Breaker)</div>
              <div className="text-slate-500">            ↓ Event Mesh & gRPC</div>
              <div className="text-purple-400 font-bold">[DOMAIN MICROSERVICES]</div>
              <div className="pl-4">
                • <strong>Auth & User Service</strong> (Go / OAuth2 / Biometrics)<br/>
                • <strong>OCR Ingestion Service</strong> (Python FastAPI / ONNX Runtime / TrOCR / PyTorch)<br/>
                • <strong>Price Catalog Service</strong> (Go / CQRS / Write Master + Read Replicas)<br/>
                • <strong>Confidence & Anti-Fraud Engine</strong> (Python / Scikit-learn / MAD / Isolation Forest)<br/>
                • <strong>Personal Inflation Engine</strong> (Rust / High-throughput Vectorized Calculations)<br/>
                • <strong>Economic Digital Twin Engine</strong> (Rust / Monte Carlo Simulation Engine)<br/>
                • <strong>Decision & Financial Engine</strong> (Deterministic Rules / Non-LLM Mathematical Core)<br/>
                • <strong>Contextual Synthesizer</strong> (Self-hosted Llama 3 8B / Mistral vLLM with RAG)
              </div>
              <div className="text-slate-500">            ↓ Async Bus (Apache Kafka / Redpanda)</div>
              <div className="text-amber-400 font-bold">[STORAGE & ANALYTICAL TIER]</div>
              <div className="pl-4">
                • <strong>OLTP Master:</strong> PostgreSQL 16 + TimescaleDB (Precios temporales, tickets, transacciones)<br/>
                • <strong>Cache & Fast State:</strong> Redis Cluster (Session, Rate Limits, Hot Price Keys, Geospatial Indices GEOADD)<br/>
                • <strong>Vector DB:</strong> Qdrant / pgvector (Product embeddings, ticket merchant matching)<br/>
                • <strong>OLAP Data Lakehouse:</strong> Apache Kafka → Apache Flink → MinIO/S3 (Parquet) → ClickHouse / Trino
              </div>
            </div>
          </div>

          {/* Scalability Roadmap Matrix */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Matriz de Escalabilidad por Tier de Crecimiento
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Usuarios Activos</th>
                    <th className="pb-2 font-semibold">Infraestructura de Cómputo</th>
                    <th className="pb-2 font-semibold">Capa de Base de Datos</th>
                    <th className="pb-2 font-semibold">Caché & Mensajería</th>
                    <th className="pb-2 font-semibold">Costo Operativo</th>
                    <th className="pb-2 font-semibold">Latencia p95</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {scalabilityLevels.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white">{row.tier}</td>
                      <td className="py-2.5 text-slate-300 font-sans">{row.infra}</td>
                      <td className="py-2.5 text-slate-300 font-sans">{row.database}</td>
                      <td className="py-2.5 text-slate-300 font-sans">{row.cache}</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{row.costoMes}</td>
                      <td className="py-2.5 text-sky-400">{row.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Pipeline IA Simbólica */}
      {activeSection === 'ia_pipeline' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Arquitectura de IA No-Dependiente (Zero Prompt-to-LLM Naivety)
              </h3>
              <p className="text-xs text-slate-400">
                Garantía institucional: el modelo generativo jamás calcula números ni inventa recomendaciones financieras.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Paso 1</span>
              <span className="font-bold text-white mt-1">BASE DE DATOS</span>
              <span className="text-[10px] text-slate-400 mt-1">PostgreSQL + Qdrant + TimescaleDB</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col justify-center">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">Paso 2</span>
              <span className="font-bold text-emerald-300 mt-1">MOTOR DE DECISIONES</span>
              <span className="text-[10px] text-slate-400 mt-1">Reglas deterministas & árbol de viabilidad</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 flex flex-col justify-center">
              <span className="text-[10px] text-cyan-400 font-bold block uppercase">Paso 3</span>
              <span className="font-bold text-cyan-300 mt-1">MOTOR FINANCIERO</span>
              <span className="text-[10px] text-slate-400 mt-1">Cálculo de TIR, CFT, IPC real, brecha pesos</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col justify-center">
              <span className="text-[10px] text-amber-400 font-bold block uppercase">Paso 4</span>
              <span className="font-bold text-amber-300 mt-1">MOTOR RECOMENDACIÓN</span>
              <span className="text-[10px] text-slate-400 mt-1">Filtrado colaborativo + Geo-scoring barrial</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/40 flex flex-col justify-center">
              <span className="text-[10px] text-purple-400 font-bold block uppercase">Paso 5</span>
              <span className="font-bold text-purple-300 mt-1">LLM LINGÜÍSTICO</span>
              <span className="text-[10px] text-slate-400 mt-1">Llama-3-8B local / Mistral (Solo redacción)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-sky-400 font-bold block uppercase">Paso 6</span>
              <span className="font-bold text-white mt-1">SALIDA HUMANA</span>
              <span className="text-[10px] text-slate-400 mt-1">Tono argentino, empático, sin alucinación</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-slate-200">¿Por qué este diseño es un Moat Defensivo inexpugnable?</h4>
            <p className="text-slate-400 leading-relaxed">
              Cualquier competidor que arme una app conectando un wrapper a OpenAI o Gemini sufrirá alucinaciones de precios,
              fallas en tasas de interés compuestas y costos astronómicos de API por token ($0.03 por consulta). 
              ECONOM-IA ejecuta el 100% de la lógica de optimización de forma simbólica-matemática en microsegundos, usando el modelo de lenguaje
              únicamente como un formateador prosódico con modismos locales argentinos. Si desconectamos el LLM, el motor financiero sigue funcionando al 100%.
            </p>
          </div>
        </div>
      )}

      {/* Content Section 3: Data Lakehouse & Entidades */}
      {activeSection === 'datos' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Modelo Entidad-Relación y Almacenamiento Histórico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 font-mono font-bold">
                <span>users & households</span>
                <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">OLTP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, email, password_hash, barrio_id, geohash_home, sueldo_neto, ingresos_extra, integrantes, hijos, risk_profile, created_at.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-sky-400 font-mono font-bold">
                <span>products & barcodes</span>
                <span className="text-[10px] bg-sky-500/10 px-1.5 py-0.5 rounded">Catalog</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, gtin_ean13, canonical_name, brand, category, subcategory, unit_measure, package_size, nutritional_tier, is_essential_basket.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-amber-400 font-mono font-bold">
                <span>merchants & branches</span>
                <span className="text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">Geo-Spatial</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, trade_name, channel_type (Chino, Mayorista, Cadena, Almacén), cuit, address, coordinates (PostGIS Point), is_partner, reputation_score.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-purple-400 font-mono font-bold">
                <span>price_observations</span>
                <span className="text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded">TimescaleDB</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, product_id, merchant_id, price_ars, promotion_type, observed_at, source (OCR, Community, Scraper, API), confidence_score, is_outlier.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-rose-400 font-mono font-bold">
                <span>tickets & line_items</span>
                <span className="text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded">OCR</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, user_id, raw_image_url, merchant_detected_id, total_ars, ocr_confidence, verified_by_user, status, processed_at, line_items (JSONB).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-cyan-400 font-mono font-bold">
                <span>personal_inflation_log</span>
                <span className="text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded">OLAP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                id, user_id, period_month, official_indec_rate, personal_pocket_rate, breach_amount_ars, category_weights (JSONB), computed_at.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 4: Motor de Confianza & Anti-Fraude */}
      {activeSection === 'confianza' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Algoritmo de Confianza Estilo Waze & Detección de Fraude
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="font-mono text-emerald-300">
              ConfidenceScore = [ (0.40 * UserReputation) + (0.35 * MultiUserCorroboration) + (0.15 * OCRProofBonus) + (0.10 * TimeDecay) ] * AntiAnomalyPenalty
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">1. Detección de Outliers (MAD)</span>
                <p className="text-slate-400 text-[11px]">
                  Utilizamos la <em>Median Absolute Deviation (MAD)</em> en lugar de la desviación estándar estándar, 
                  para evitar que precios abusivos o errores de tipografía alteren el promedio del clúster barrial.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">2. Reputación Bayesiana</span>
                <p className="text-slate-400 text-[11px]">
                  Cada usuario acumula karma según cuántas personas confirman sus reportes en góndola. Comerciantes asociados
                  poseen un multiplicador inicial tras verificación presencial con código QR en vidriera.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">3. Anti-Spoofing Geográfico</span>
                <p className="text-slate-400 text-[11px]">
                  Un reporte sólo es admitido si el GPS del dispositivo coincide con el polígono del local en un radio de 50 metros,
                  o si proviene del escaneo OCR de un ticket fiscal con CAI/CAE válido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 5: Monetización */}
      {activeSection === 'monetizacion' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Flujos de Monetización Multi-Canal (Diversificación Anti-Suscripción)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-400 block uppercase tracking-wider">1. Consumidor (B2C)</span>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Freemium:</strong> Copiloto básico, 3 escaneos de tickets/mes, mapa de ahorro.</li>
                <li>• <strong>Premium ($ 3.990 ARS/mes):</strong> Gemelo económico completo, alertas en tiempo real, tickets ilimitados, modo voz prioritario.</li>
                <li>• <strong>Familiar ($ 6.490 ARS/mes):</strong> Consolidación multi-integrante del hogar con presupuesto unificado.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">2. Comercios & Chinos (B2B)</span>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Comercio Asociado Básico:</strong> Gratis a cambio de actualizar 4 precios gancho semanalmente.</li>
                <li>• <strong>Comercio Pro ($ 14.500 ARS/mes):</strong> Aparición destacada en rutas de compra de vecinos, promociones flash zonales.</li>
                <li>• <strong>Mayoristas & Marcas CPG ($ 850 USD/mes):</strong> Acceso a reportes de elasticidad precio y cuota de mercado en góndola.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 block uppercase tracking-wider">3. Fintech & Finanzas</span>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Comisión por Originación:</strong> Créditos a tasa conveniente para refinanciación de tarjetas con bancos asociados.</li>
                <li>• <strong>Cashback de Afiliados:</strong> Acuerdos con MODO, Cuenta DNI, y billeteras virtuales al activar promociones.</li>
                <li>• <strong>Suscripción a Inteligencia de Consumo:</strong> API anonimizada para fondos y consultoras macroeconómicas.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 6: Moat & Ventajas */}
      {activeSection === 'moat' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Moat Inexpugnable (¿Por qué no nos pueden copiar?)
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-white">Base Propietaria de Precios de Autoservicios Chinos</h4>
                <p className="text-slate-400 mt-0.5">
                  Las cadenas tradicionales y scrapers web solo ven a Coto o Carrefour. Ninguna API del mundo tiene el precio de la yerba en el chino de la calle Lynch en Monte Chingolo. Solo nosotros tenemos la red comunitaria y el incentivo directo.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-white">Efectos de Red Locales (Local Network Effects)</h4>
                <p className="text-slate-400 mt-0.5">
                  Cada vecino que sube un ticket en Lanús incrementa la precisión de la canasta para los siguientes 500 vecinos. La barrera de entrada por barrio es infranqueable para una startup extranjera.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-white">El Gemelo Económico Digital</h4>
                <p className="text-slate-400 mt-0.5">
                  Una vez que el Gemelo conoce la elasticidad, el alquiler, la escuela de los hijos y los horarios de compra del usuario, el costo de cambio (Switching Cost) hacia otra aplicación es prohibitivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
