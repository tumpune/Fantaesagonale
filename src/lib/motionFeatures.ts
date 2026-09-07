import { domAnimation } from 'motion/react'

/**
 * Insieme di funzionalita' passato a LazyMotion.
 *
 * Un primo tentativo lo importava in modo dinamico per tenerlo fuori dal
 * pacchetto iniziale, ma non funziona: i componenti importano gia'
 * staticamente lo stesso modulo, quindi il separatore non puo' spostarlo
 * altrove e il risultato pesava di piu', non di meno.
 *
 * Si ferma a `domAnimation`: il pacchetto completo costa 13,6 KB compressi in
 * piu' e serviva a un solo dettaglio, l'indicatore scorrevole del menu, che si
 * ottiene identico misurando la voce attiva e lasciando la transizione al CSS.
 */
export const funzionalitaMovimento = domAnimation
