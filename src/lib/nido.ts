/**
 * Geometria del nido d'api.
 *
 * Un solo reticolo continuo di esagoni a punta in alto. I lati fra due celle
 * vicine sono lo STESSO segmento, disegnato una volta sola: e' questo che
 * elimina il filo doppio e che permette di accendere il singolo lato di
 * collegamento fra un ramo e l'altro.
 *
 * Tutto e' espresso in "passo": la distanza fra i centri di due celle
 * adiacenti, uguale in tutte e sei le direzioni. Nessun numero magico.
 */

/** sin(60°) = √3/2. Lega passo, altezza e distanza verticale fra le file. */
export const K = Math.sqrt(3) / 2

/** Passo di riferimento: tutta la geometria e' in queste unita'. */
const PASSO = 1

/** Raggio circoscritto (centro → vertice): per un esagono regolare di lato R
 *  la distanza fra due centri adiacenti vale R·√3, quindi R = passo/√3. */
const RAGGIO = PASSO / Math.sqrt(3)

/** Larghezza della cella, piatto contro piatto. */
const LARGHEZZA = PASSO

/** Altezza della cella, punta contro punta: 2R ≈ 1,1547 passi. */
const ALTEZZA = 2 * RAGGIO

/** Distanza verticale fra due file: 1,5R ≈ 0,866 passi, cioe' il 75%
 *  dell'altezza della cella. E' il valore che fa incastrare le file. */
const PASSO_RIGA = 1.5 * RAGGIO

/**
 * Rettangolo utile dentro un esagono a punta in alto.
 *
 * A distanza |y| dal centro la semilarghezza disponibile vale W/2 finche'
 * |y| ≤ H/4, poi cala linearmente fino a zero in |y| = H/2:
 *     semiLarghezza(y) = (W/2) · (H/2 − |y|) / (H/4)
 *
 * Con semialtezza 0,29·H serve semilarghezza ≤ (W/2)·(0,21H)/(0,25H) = 0,42·W,
 * quindi un rettangolo 78% × 58% ci sta con margine. Il rettangolo di area
 * massima sarebbe 100% × 50%, piu' largo e piu' basso: qui serve invece
 * altezza, perche' il contenuto e' una colonna: icona, nome, pulsante.
 */
const UTILE_LARGA = 0.78
const UTILE_ALTA = 0.58

/**
 * Rientro del contenuto dai lati della cella, in percentuale della cella.
 * Deriva dal rettangolo utile, non e' un valore scelto a occhio: cambiando le
 * due frazioni qui sopra, il riempimento nel CSS si adegua da solo.
 */
export const RIENTRO = {
  x: `${(((1 - UTILE_LARGA) / 2) * 100).toFixed(2)}%`,
  y: `${(((1 - UTILE_ALTA) / 2) * 100).toFixed(2)}%`,
}

/** Verifica formale che il rettangolo utile stia davvero dentro l'esagono. */
export function rettangoloStaDentro(fLarga = UTILE_LARGA, fAlta = UTILE_ALTA) {
  const semiAltezza = (fAlta * ALTEZZA) / 2
  const disponibile =
    semiAltezza <= ALTEZZA / 4
      ? LARGHEZZA / 2
      : (LARGHEZZA / 2) * ((ALTEZZA / 2 - semiAltezza) / (ALTEZZA / 4))
  const serve = (fLarga * LARGHEZZA) / 2
  return { serve, disponibile, ok: serve <= disponibile }
}

/** Centro della cella nella fila `riga`, posizione `colonna`. Le file dispari
 *  sono spostate di mezzo passo: e' lo sfalsamento che fa combaciare i lati. */
function centro(riga: number, colonna: number) {
  return { x: (colonna + (riga & 1 ? 0.5 : 0)) * PASSO, y: riga * PASSO_RIGA }
}

/** I sei vertici, in senso orario dalla punta in alto. Il vertice i sta
 *  all'angolo (60·i − 90)°: il −90 porta il primo vertice in cima. */
function vertici(cx: number, cy: number): [number, number][] {
  const punti: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angolo = ((60 * i - 90) * Math.PI) / 180
    punti.push([cx + RAGGIO * Math.cos(angolo), cy + RAGGIO * Math.sin(angolo)])
  }
  return punti
}

/** I sei vicini di (riga, colonna) in coordinate di fila e colonna sfalsate. */
function vicini(riga: number, colonna: number): [number, number][] {
  // Le file dispari sporgono a destra di mezzo passo, quindi le due celle
  // della fila sopra e della fila sotto cambiano indice a seconda della parita'.
  const d = riga & 1 ? 0 : -1
  return [
    [riga, colonna - 1],
    [riga, colonna + 1],
    [riga - 1, colonna + d],
    [riga - 1, colonna + d + 1],
    [riga + 1, colonna + d],
    [riga + 1, colonna + d + 1],
  ]
}

/**
 * Dove stanno i rami. Ogni schema elenca, per ogni fila, le colonne occupate.
 *
 *   largo   → 3-2-3       (da tablet in su)
 *   stretto → 2-1-2-1-2   (telefono)
 *
 * Sono schemi di favo validi: due file contigue sono sempre sfalsate di mezzo
 * passo. Riempire le file in ordine produrrebbe invece cose come 3-2-2, dove
 * due file uguali partono dallo stesso punto e le celle si sovrappongono.
 */
const SCHEMI = {
  largo: [[0, 1, 2], [0, 1], [0, 1, 2]],
  stretto: [[0, 1], [0], [0, 1], [0], [0, 1]],
} as const

export type NomeSchema = keyof typeof SCHEMI

/**
 * Chiave stabile di un punto.
 *
 * Due celle vicine calcolano lo stesso vertice per strade diverse (una col
 * coseno di 150°, l'altra con quello di −90°) e arrivano a 5,55e−17 invece che
 * a zero: va arrotondato, altrimenti il lato non viene riconosciuto come
 * condiviso e resta disegnato due volte.
 *
 * `toFixed` pero' non basta: un valore di −1e−17 diventa la stringa "-0.00000",
 * diversa da "0.00000", e i lati che passano per l'asse x = 0 sfuggono alla
 * fusione. Con `Math.round` lo zero negativo si stampa "0" e le due chiavi
 * coincidono davvero.
 */
const GRIGLIA = 1e5
const chiavePunto = (p: [number, number]) => `${Math.round(p[0] * GRIGLIA)},${Math.round(p[1] * GRIGLIA)}`

/** Chiave di un lato, indipendente dal verso di percorrenza. */
const chiaveLato = (a: [number, number], b: [number, number]) => {
  const ka = chiavePunto(a)
  const kb = chiavePunto(b)
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
}

export type Lato = {
  a: [number, number]
  b: [number, number]
  /** Indici dei rami che possiedono questo lato: 0, 1 o 2. */
  rami: number[]
  /** Vero se unisce due rami: e' il "collegamento" da accendere. */
  condiviso: boolean
  /** Rami che toccano questo lato passando per un vicino: l'eco dell'accensione. */
  eco: number[]
}

export type CellaRamo = {
  indice: number
  punti: [number, number][]
  adiacenti: number[]
  /** Riquadro della cella intera, in percentuale della vista: l'SVG e il
   *  livello HTML usano lo stesso sistema, quindi restano allineati a ogni
   *  larghezza. Il collegamento riempie questo riquadro e viene ritagliato a
   *  esagono, cosi' l'area cliccabile e' la cella e non il rettangolo che la
   *  contiene: niente zone morte che appartengono alla cella sbagliata. */
  stile: { left: string; top: string; width: string; height: string }
}

export type Nido = {
  vista: { x: number; y: number; larghezza: number; altezza: number }
  latiEsterni: Lato[]
  latiAttivi: Lato[]
  rami: CellaRamo[]
  rapporto: number
}

/**
 * Costruisce il nido.
 *
 * @param schema   quale disposizione dei rami
 * @param margineX celle vuote a destra e a sinistra dell'area dei rami, in
 *                 passi. Frazionario di proposito: cosi' l'ultimo anello viene
 *                 tagliato dal bordo e si vedono celle parziali, come in un
 *                 nido vero che continua oltre l'inquadratura.
 * @param margineY lo stesso in verticale, in passi verticali.
 */
export function costruisci(schema: NomeSchema, margineX: number, margineY: number): Nido {
  const file = SCHEMI[schema]

  // --- Celle dei rami, in ordine di lettura -------------------------------
  // Le file corte vanno ricentrate sulla larghezza massima dello schema; lo
  // sfalsamento di mezzo passo delle file dispari e' gia' dentro `centro`.
  const attive: { riga: number; colonna: number }[] = []
  const massimo = Math.max(...file.map((f) => f.length))
  file.forEach((colonne, riga) => {
    const scarto = Math.round((massimo - colonne.length) / 2)
    const spostamento = Math.max(0, riga & 1 ? scarto - 1 : scarto)
    colonne.forEach((c) => attive.push({ riga, colonna: c + spostamento }))
  })

  // --- Vista: l'area dei rami piu' i margini di celle vuote ----------------
  const centri = attive.map((c) => centro(c.riga, c.colonna))
  const minX = Math.min(...centri.map((c) => c.x)) - LARGHEZZA / 2
  const maxX = Math.max(...centri.map((c) => c.x)) + LARGHEZZA / 2
  const minY = Math.min(...centri.map((c) => c.y)) - ALTEZZA / 2
  const maxY = Math.max(...centri.map((c) => c.y)) + ALTEZZA / 2

  const vista = {
    x: minX - margineX * PASSO,
    y: minY - margineY * PASSO_RIGA,
    larghezza: maxX - minX + 2 * margineX * PASSO,
    altezza: maxY - minY + 2 * margineY * PASSO_RIGA,
  }

  // --- Tutte le celle che toccano la vista, piu' un anello di sicurezza ----
  // Cosi' e' il bordo a tagliare il reticolo, non la fine dei dati.
  const indiceAttiva = new Map<string, number>()
  attive.forEach((c, i) => indiceAttiva.set(`${c.riga}:${c.colonna}`, i))

  const celle: { x: number; y: number; attiva: number | null }[] = []
  const rigaDa = Math.floor((vista.y - ALTEZZA) / PASSO_RIGA)
  const rigaA = Math.ceil((vista.y + vista.altezza + ALTEZZA) / PASSO_RIGA)
  const colDa = Math.floor((vista.x - LARGHEZZA) / PASSO) - 1
  const colA = Math.ceil((vista.x + vista.larghezza + LARGHEZZA) / PASSO) + 1
  for (let r = rigaDa; r <= rigaA; r++) {
    for (let c = colDa; c <= colA; c++) {
      const { x, y } = centro(r, c)
      if (x + LARGHEZZA / 2 < vista.x - PASSO || x - LARGHEZZA / 2 > vista.x + vista.larghezza + PASSO) continue
      if (y + ALTEZZA / 2 < vista.y - PASSO_RIGA || y - ALTEZZA / 2 > vista.y + vista.altezza + PASSO_RIGA) continue
      celle.push({ x, y, attiva: indiceAttiva.get(`${r}:${c}`) ?? null })
    }
  }

  // --- Lati unici ---------------------------------------------------------
  // E' il cuore della soluzione: ogni lato viene registrato una volta sola,
  // con l'elenco delle celle che lo possiedono. Due celle vicine producono la
  // stessa chiave, quindi resta UN solo filo e niente fessure fra le celle.
  const mappa = new Map<string, { a: [number, number]; b: [number, number]; proprietari: (number | null)[] }>()
  for (const cella of celle) {
    const v = vertici(cella.x, cella.y)
    for (let i = 0; i < 6; i++) {
      const a = v[i]
      const b = v[(i + 1) % 6]
      const chiave = chiaveLato(a, b)
      const lato = mappa.get(chiave) ?? { a, b, proprietari: [] }
      lato.proprietari.push(cella.attiva)
      mappa.set(chiave, lato)
    }
  }

  // --- Adiacenze fra rami: servono all'eco dell'accensione -----------------
  const adiacenti = attive.map((c, i) => {
    const insieme = new Set<number>()
    for (const [r, cc] of vicini(c.riga, c.colonna)) {
      const j = indiceAttiva.get(`${r}:${cc}`)
      if (j !== undefined && j !== i) insieme.add(j)
    }
    return [...insieme].sort((a, b) => a - b)
  })

  const latiEsterni: Lato[] = []
  const latiAttivi: Lato[] = []
  for (const lato of mappa.values()) {
    const rami = lato.proprietari.filter((i): i is number => i !== null)
    const eco = new Set<number>()
    for (const i of rami) for (const j of adiacenti[i]) if (!rami.includes(j)) eco.add(j)
    const completo: Lato = { a: lato.a, b: lato.b, rami, condiviso: rami.length === 2, eco: [...eco] }
    // I lati che non toccano nessun ramo finiscono in un unico path: sono
    // centinaia e non devono mai cambiare da soli. Gli altri restano separati,
    // perche' ognuno deve potersi accendere per conto proprio.
    if (rami.length) latiAttivi.push(completo)
    else latiEsterni.push(completo)
  }

  const pc = (v: number, tot: number) => `${((v / tot) * 100).toFixed(4)}%`
  const rami = attive.map((c, i) => {
    const { x, y } = centro(c.riga, c.colonna)
    return {
      indice: i,
      punti: vertici(x, y),
      adiacenti: adiacenti[i],
      stile: {
        left: pc(x - LARGHEZZA / 2 - vista.x, vista.larghezza),
        top: pc(y - ALTEZZA / 2 - vista.y, vista.altezza),
        width: pc(LARGHEZZA, vista.larghezza),
        height: pc(ALTEZZA, vista.altezza),
      },
    }
  })

  return { vista, latiEsterni, latiAttivi, rami, rapporto: vista.larghezza / vista.altezza }
}

/** Un lato come comando di path: "M ax ay L bx by". */
export const latoInPath = (l: Lato) =>
  `M${l.a[0].toFixed(4)} ${l.a[1].toFixed(4)}L${l.b[0].toFixed(4)} ${l.b[1].toFixed(4)}`

/** Un poligono come valore dell'attributo `points`. */
export const puntiInAttributo = (p: [number, number][]) =>
  p.map(([x, y]) => `${x.toFixed(4)},${y.toFixed(4)}`).join(' ')
