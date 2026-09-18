/**
 * Geometria del favo.
 *
 * Tutto e' espresso in "passo": la distanza fra i centri di due celle vicine,
 * che in un favo vero e' la stessa in tutte e sei le direzioni. Da li' si
 * ricavano larghezza, altezza, passo verticale e sfalsamento delle file.
 */

/** sin(60°) = √3/2: lega altezza, larghezza e passo verticale. */
const K = Math.sqrt(3) / 2

/** Vuoto fra due celle, in frazione di passo. Zero sarebbe un favo contiguo. */
const VUOTO = 0.045

export type CellaFavo = {
  /** left, top e width in percentuale del contenitore, pronti per lo style. */
  x: string
  y: string
  w: string
  /** Ritardo d'entrata: 0 al centro del favo, massimo sul bordo esterno. */
  ritardo: string
  /** Indici delle celle adiacenti: servono alla reazione al passaggio del mouse. */
  vicine: number[]
}

export type Favo = {
  celle: CellaFavo[]
  /** Larghezza/altezza del contenitore: va su aspect-ratio. */
  rapporto: number
  /** Lo schema scelto, per esempio [3, 2, 3]. */
  file: number[]
}

/**
 * Sceglie lo schema delle file per `quante` celle, con al massimo `perFila`.
 *
 * Valgono due tipi di favo: quello alternato (3-2-3, 2-3-2) e quello a file
 * uguali sfalsate (3-3, 3-3-3). In entrambi due file contigue sono spostate di
 * mezzo passo, ed e' questo che fa combaciare i lati obliqui. Un'alternanza
 * ingenua ("riempi, poi una corta") produce invece schemi come 3-2-2, dove due
 * file uguali partono dallo stesso punto e le celle si sovrappongono.
 *
 * A parita' di tutto si preferisce: usare tutta la larghezza disponibile, poi
 * la forma piu' stretta (celle piu' grandi), poi meno file, poi la simmetria.
 */
function schemaFile(quante: number, perFila: number): number[] {
  const candidati: number[][] = []

  for (let grande = perFila; grande >= 2; grande--) {
    for (const iniziaGrande of [true, false]) {
      const file: number[] = []
      let somma = 0
      let piena = iniziaGrande
      while (somma < quante && file.length < 14) {
        const misura = piena ? grande : grande - 1
        if (misura < 1) break
        file.push(misura)
        somma += misura
        piena = !piena
      }
      if (somma === quante) candidati.push(file)
    }
  }
  for (let misura = perFila; misura >= 1; misura--) {
    if (quante % misura === 0) candidati.push(Array(quante / misura).fill(misura))
  }

  if (!candidati.length) {
    const ripiego: number[] = []
    for (let restanti = quante; restanti > 0; restanti -= perFila) ripiego.push(Math.min(restanti, perFila))
    return ripiego
  }

  /** Larghezza dello schema, misurata in mezze colonne. */
  const mezzeColonne = (file: number[]) => {
    const massimo = Math.max(...file)
    return file.every((n) => n === file[0]) ? 2 * massimo + 1 : 2 * massimo
  }
  const simmetrico = (file: number[]) => file.join() === [...file].reverse().join()

  candidati.sort(
    (a, b) =>
      perFila - Math.max(...a) - (perFila - Math.max(...b)) ||
      mezzeColonne(a) - mezzeColonne(b) ||
      a.length - b.length ||
      (simmetrico(b) ? 1 : 0) - (simmetrico(a) ? 1 : 0),
  )
  return candidati[0]
}

/**
 * Posizione di ogni cella, in percentuale del contenitore.
 *
 * Il contenitore ha altezza definita da `rapporto` (aspect-ratio), quindi le
 * percentuali verticali sono affidabili: niente margini negativi e niente
 * padding di compensazione, che nella versione precedente servivano a
 * rimediare allo sbordamento delle colonne sfalsate.
 */
export function favo(quante: number, perFila: number): Favo {
  const file = schemaFile(quante, perFila)
  const massimoPerFila = Math.max(...file)
  const fileUguali = file.every((n) => n === file[0])

  // Si misura in mezze colonne larghe mezzo passo: cosi' lo sfalsamento di
  // mezza cella e' un numero intero e non accumula errori di arrotondamento.
  const mezzeColonne = fileUguali ? 2 * massimoPerFila + 1 : 2 * massimoPerFila

  const larghezza = 1 - VUOTO
  const altezza = larghezza / K
  const totaleLarghezza = mezzeColonne / 2
  const totaleAltezza = (file.length - 1) * K + altezza

  const centri: { cx: number; cy: number }[] = []
  file.forEach((quantita, riga) => {
    // Le file piene partono dalla mezza colonna 1, quelle corte dalla 2: due
    // file contigue restano sempre sfalsate di mezzo passo.
    const inizio = fileUguali ? 1 + (riga % 2) : (mezzeColonne - 2 * quantita) / 2 + 1
    for (let i = 0; i < quantita; i++) {
      centri.push({ cx: (inizio + 2 * i) / 2, cy: riga * K + altezza / 2 })
    }
  })

  // Distanza dal baricentro normalizzata fra 0 e 1: la cascata dura sempre lo
  // stesso tempo, qualunque sia lo schema.
  const baricentro = { x: totaleLarghezza / 2, y: totaleAltezza / 2 }
  const distanze = centri.map((c) => Math.hypot(c.cx - baricentro.x, c.cy - baricentro.y))
  const minima = Math.min(...distanze)
  const massima = Math.max(...distanze)

  const percentuale = (valore: number) => `${(valore * 100).toFixed(4)}%`

  return {
    file,
    rapporto: totaleLarghezza / totaleAltezza,
    celle: centri.map((c, i) => ({
      x: percentuale((c.cx - larghezza / 2) / totaleLarghezza),
      y: percentuale((c.cy - altezza / 2) / totaleAltezza),
      w: percentuale(larghezza / totaleLarghezza),
      ritardo: `${Math.round(((distanze[i] - minima) / (massima - minima || 1)) * 300)}ms`,
      // Adiacenti: quelle a un passo esatto, con tolleranza per gli arrotondamenti.
      vicine: centri
        .map((altra, j) => [j, Math.hypot(c.cx - altra.cx, c.cy - altra.cy)] as const)
        .filter(([j, distanza]) => j !== i && distanza < 1.08)
        .map(([j]) => j),
    })),
  }
}
