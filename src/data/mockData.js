// Initial mock data calibrated to current Argentine economic context
export const INITIAL_USER_PROFILE = {
  name: "Martín Gómez",
  email: "martin.gomez@ejemplo.com",
  provincia: "Buenos Aires",
  ciudad: "Lanús",
  barrio: "Monte Chingolo",
  integrantesHogar: 3,
  hijos: 1,
  sueldoNeto: 1300000,
  ingresosExtra: 150000,
  alquiler: 350000,
  expensasServicios: 120000,
  vehiculoGasto: 90000,
  educacionSalud: 85000,
  tarjetaCreditoPromedio: 180000,
  gastosFijosTotal: 825000,
  gastoSupermercadoMensual: 280000,
};

export const ARGENTINE_ZONES = [
  {
    id: "monte_chingolo",
    nombre: "Monte Chingolo",
    partido: "Lanús",
    canastaBasica: 72000,
    promedioZona: 79000,
    ahorroPorcentaje: 11,
    destacado: "Mayor densidad de autoservicios chinos y ferias barriales con precios hasta 18% menores.",
    tipo: "Alta oportunidad de ahorro"
  },
  {
    id: "lanus_oeste",
    nombre: "Lanús Oeste / Centro",
    partido: "Lanús",
    canastaBasica: 79000,
    promedioZona: 81500,
    ahorroPorcentaje: 3,
    destacado: "Gran oferta de cadenas (Coto, Día, Carrefour Express). Clave aprovechar promociones bancarias (Cuenta DNI / Modo).",
    tipo: "Ahorro moderado"
  },
  {
    id: "quilmes_oeste",
    nombre: "Quilmes Oeste",
    partido: "Quilmes",
    canastaBasica: 74500,
    promedioZona: 80000,
    ahorroPorcentaje: 7,
    destacado: "Cercanía a Mayorista Maxiconsumo y ferias francas municipales.",
    tipo: "Alta oportunidad"
  },
  {
    id: "lomas_zamora",
    nombre: "Lomas de Zamora",
    partido: "Lomas de Zamora",
    canastaBasica: 78200,
    promedioZona: 81000,
    ahorroPorcentaje: 4,
    destacado: "Variedad en peatonales y autoservicios de cercanía.",
    tipo: "Ahorro moderado"
  },
  {
    id: "caba_palermo",
    nombre: "Palermo / Recoleta",
    partido: "CABA",
    canastaBasica: 94000,
    promedioZona: 91000,
    ahorroPorcentaje: -3,
    destacado: "Precios de cercanía más altos del AMBA. Conviene compra mensual agrupada o mayorista.",
    tipo: "Zona de costo elevado"
  }
];

export const PRODUCTS_CATALOG = [
  {
    id: "yerba_playadito_1k",
    nombre: "Yerba Mate Playadito 1 Kg",
    categoria: "Alimentos",
    rubro: "alimentos",
    presentacion: "Paquete 1kg",
    precios: {
      coto: 4790,
      carrefour: 4650,
      dia: 4599,
      chino: 4200,
      mayorista: 3850
    },
    precioPromedio: 4417,
    variacionMensual: 4.2,
    mejorOpcion: "Mayorista Vital ($3.850) o Chino Lynch ($4.200)"
  },
  {
    id: "aceite_natura_15l",
    nombre: "Aceite de Girasol Natura 1.5L",
    categoria: "Alimentos",
    rubro: "alimentos",
    presentacion: "Botella 1.5L",
    precios: {
      coto: 3100,
      carrefour: 2990,
      dia: 2890,
      chino: 2650,
      mayorista: 2400
    },
    precioPromedio: 2806,
    variacionMensual: 6.8,
    mejorOpcion: "Mayorista ($2.400) o Autoservicio Chen ($2.650)"
  },
  {
    id: "leche_serenisima_1l",
    nombre: "Leche Clásica La Serenísima 1L",
    categoria: "Alimentos",
    rubro: "alimentos",
    presentacion: "Sachet 1L",
    precios: {
      coto: 1550,
      carrefour: 1480,
      dia: 1420,
      chino: 1350,
      mayorista: 1250
    },
    precioPromedio: 1410,
    variacionMensual: 3.1,
    mejorOpcion: "Chino de barrio ($1.350) o marca Día ($1.150)"
  },
  {
    id: "fideos_matarazzo_500g",
    nombre: "Fideos Tirabuzón Matarazzo 500g",
    categoria: "Alimentos",
    rubro: "alimentos",
    presentacion: "Paquete 500g",
    precios: {
      coto: 1750,
      carrefour: 1690,
      dia: 1590,
      chino: 1450,
      mayorista: 1280
    },
    precioPromedio: 1552,
    variacionMensual: 5.5,
    mejorOpcion: "Mayorista Maxiconsumo ($1.280)"
  },
  {
    id: "azucar_ledesma_1k",
    nombre: "Azúcar Ledesma Superior 1 Kg",
    categoria: "Alimentos",
    rubro: "alimentos",
    presentacion: "Paquete 1kg",
    precios: {
      coto: 1390,
      carrefour: 1350,
      dia: 1250,
      chino: 1100,
      mayorista: 980
    },
    precioPromedio: 1214,
    variacionMensual: 1.8,
    mejorOpcion: "Super Chino Lynch ($1.100)"
  },
  {
    id: "detergente_ala_750ml",
    nombre: "Detergente Lavavajilla Ala Limón 750ml",
    categoria: "Limpieza",
    rubro: "limpieza",
    presentacion: "Botella 750ml",
    precios: {
      coto: 2550,
      carrefour: 2490,
      dia: 2350,
      chino: 2100,
      mayorista: 1890
    },
    precioPromedio: 2276,
    variacionMensual: 4.9,
    mejorOpcion: "Mayorista Vital ($1.890)"
  },
  {
    id: "jabon_skip_3l",
    nombre: "Jabón Líquido Skip Bio-Enzimas 3L",
    categoria: "Limpieza",
    rubro: "limpieza",
    presentacion: "Doypack / Botella 3L",
    precios: {
      coto: 12900,
      carrefour: 12400,
      dia: 11800,
      chino: 10900,
      mayorista: 9600
    },
    precioPromedio: 11520,
    variacionMensual: 7.2,
    mejorOpcion: "Mayorista Diarco ($9.600 - Ahorrás $3.300)"
  },
  {
    id: "papel_higienol_4u",
    nombre: "Papel Higiénico Higienol Max 4x80m",
    categoria: "Limpieza",
    rubro: "limpieza",
    presentacion: "Pack 4 rollos",
    precios: {
      coto: 3400,
      carrefour: 3250,
      dia: 2990,
      chino: 2750,
      mayorista: 2390
    },
    precioPromedio: 2956,
    variacionMensual: 3.8,
    mejorOpcion: "Mayorista / Chino ($2.390 - $2.750)"
  },
  {
    id: "fernet_branca_750",
    nombre: "Fernet Branca Tradicional 750ml",
    categoria: "Bebidas",
    rubro: "bebidas",
    presentacion: "Botella 750ml",
    precios: {
      coto: 13500,
      carrefour: 13200,
      dia: 12900,
      chino: 11900,
      mayorista: 10800
    },
    precioPromedio: 12460,
    variacionMensual: 8.4,
    mejorOpcion: "Mayorista Vital ($10.800) o Chino en efectivo ($11.900)"
  },
  {
    id: "gaseosa_coca_225",
    nombre: "Coca-Cola Sabor Original 2.25L",
    categoria: "Bebidas",
    rubro: "bebidas",
    presentacion: "Botella 2.25L",
    precios: {
      coto: 3950,
      carrefour: 3890,
      dia: 3690,
      chino: 3400,
      mayorista: 3100
    },
    precioPromedio: 3606,
    variacionMensual: 6.1,
    mejorOpcion: "Chino de barrio ($3.400)"
  },
  {
    id: "shampoo_pantene_400",
    nombre: "Shampoo Pantene Restauración 400ml",
    categoria: "Perfumería",
    rubro: "perfumeria",
    presentacion: "Botella 400ml",
    precios: {
      coto: 5800,
      carrefour: 5600,
      dia: 5200,
      chino: 4800,
      mayorista: 4200
    },
    precioPromedio: 5120,
    variacionMensual: 5.0,
    mejorOpcion: "Mayorista o Farmacia con descuento bancario"
  },
  {
    id: "desodorante_rexona_150",
    nombre: "Desodorante Antitranspirante Rexona 150ml",
    categoria: "Perfumería",
    rubro: "perfumeria",
    presentacion: "Aerosol 150ml",
    precios: {
      coto: 3500,
      carrefour: 3400,
      dia: 3150,
      chino: 2900,
      mayorista: 2550
    },
    precioPromedio: 3100,
    variacionMensual: 4.5,
    mejorOpcion: "Chino ($2.900) o Mayorista x3 ($2.550 c/u)"
  }
];

export const COMMUNITY_PRICE_REPORTS = [
  {
    id: "rep_1",
    producto: "Yerba Playadito 1 Kg",
    comercio: "Supermercado Luna (Chino calle Lynch 2840)",
    barrio: "Monte Chingolo, Lanús",
    precio: 4150,
    reportadoPor: 19,
    confiabilidad: 98,
    haceCuanto: "Hace 2 horas",
    asociado: true,
    verificadoPorIA: true
  },
  {
    id: "rep_2",
    producto: "Aceite Natura 1.5L",
    comercio: "Autoservicio Chen (Av. 9 de Julio)",
    barrio: "Lanús Este",
    precio: 2600,
    reportadoPor: 14,
    confiabilidad: 95,
    haceCuanto: "Hace 4 horas",
    asociado: true,
    verificadoPorIA: true
  },
  {
    id: "rep_3",
    producto: "Leche La Serenísima 1L",
    comercio: "Día% Sucursal Hipólito Yrigoyen",
    barrio: "Lanús Centro",
    precio: 1390,
    reportadoPor: 26,
    confiabilidad: 99,
    haceCuanto: "Hace 1 hora",
    asociado: false,
    verificadoPorIA: true
  },
  {
    id: "rep_4",
    producto: "Jabón Skip Líquido 3L",
    comercio: "Mayorista Vital Lanús",
    barrio: "Gerli / Lanús",
    precio: 9500,
    reportadoPor: 31,
    confiabilidad: 99,
    haceCuanto: "Hoy a la mañana",
    asociado: false,
    verificadoPorIA: true
  },
  {
    id: "rep_5",
    producto: "Fideos Matarazzo 500g",
    comercio: "Supermercado El Trébol (Chino Eva Perón)",
    barrio: "Monte Chingolo",
    precio: 1400,
    reportadoPor: 8,
    confiabilidad: 91,
    haceCuanto: "Ayer",
    asociado: true,
    verificadoPorIA: true
  }
];

export const RECENT_SCANNED_TICKETS = [
  {
    id: "ticket_101",
    comercio: "Supermercado Luna (Chino de Lynch)",
    tipoComercio: "Autoservicio Chino",
    fecha: "2026-09-03",
    total: 18950,
    items: [
      { descripcion: "Yerba Playadito 1kg", cantidad: 2, precioUnitario: 4200, total: 8400 },
      { descripcion: "Aceite Natura 1.5L", cantidad: 1, precioUnitario: 2650, total: 2650 },
      { descripcion: "Fideos Matarazzo 500g", cantidad: 3, precioUnitario: 1450, total: 4350 },
      { descripcion: "Azúcar Ledesma 1kg", cantidad: 2, precioUnitario: 1100, total: 2200 },
      { descripcion: "Leche sachet", cantidad: 1, precioUnitario: 1350, total: 1350 }
    ],
    ahorroDetectado: 3450,
    confianzaOCR: 97
  },
  {
    id: "ticket_102",
    comercio: "Coto C.I.C.S.A. Sucursal 45",
    tipoComercio: "Supermercado Grande",
    fecha: "2026-08-28",
    total: 44200,
    items: [
      { descripcion: "Jabón Skip Líquido 3L", cantidad: 1, precioUnitario: 12900, total: 12900 },
      { descripcion: "Detergente Ala 750ml", cantidad: 2, precioUnitario: 2550, total: 5100 },
      { descripcion: "Papel Higiénico 4u", cantidad: 2, precioUnitario: 3400, total: 6800 },
      { descripcion: "Shampoo Pantene 400ml", cantidad: 1, precioUnitario: 5800, total: 5800 },
      { descripcion: "Coca-Cola 2.25L", cantidad: 2, precioUnitario: 3950, total: 7900 },
      { descripcion: "Desodorante Rexona", cantidad: 1, precioUnitario: 3500, total: 3500 },
      { descripcion: "Fideos Lucchetti", cantidad: 1, precioUnitario: 2200, total: 2200 }
    ],
    ahorroDetectado: 1200,
    confianzaOCR: 99
  }
];

export const INFLATION_BENCHMARK = {
  oficialMensual: 2.3,
  oficialInteranual: 42.5,
  rubrosOficial: {
    alimentosYBebidas: 2.8,
    viviendaYServicios: 3.9,
    transporteYCombustible: 2.4,
    saludYEducacion: 2.1,
    equipamientoHogar: 1.5,
    indumentaria: 1.2
  },
  // Default pocket weight for middle class household
  ponderacionUsuarioDefault: {
    alimentosYBebidas: 42,
    viviendaYServicios: 28,
    transporteYCombustible: 14,
    saludYEducacion: 12,
    otros: 4
  }
};
