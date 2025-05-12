import React, { useState, useEffect, useRef } from 'react';

const SearchBar = () => {
    // Stato per salvare il testo digitato dall'utente
    const [query, setQuery] = useState('');
    // Stato per memorizzare i risultati suggeriti dell'API
    const [suggestions, setSuggestions] = useState([]);
    // Ref per gestire il debounce (ritardo nella chiamata API)
    const debounceRef = useRef(null);

    // Effetto che si attiva ogni volta che l'utente digita qualcosa
    useEffect(() => {
        // Se il campo è vuoto, resetta i suggerimenti e non effettua nessuna chiamata
        if (query.trim() === '') {
            setSuggestions([]);
            return;
        }

        // Se esiste già un timeout attivo, lo cancella (per evitare troppe chiamate)
        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Imposta un nuovo timeout per ritardare la chiamata API di 400ms
        debounceRef.current = setTimeout(() => {
            // Effettua la chiamata API con il termine di ricerca attuale
            fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`)
                .then(res => res.json())
                .then(data => {
                    // Se la risposta è un array (valida), aggiorna i suggerimenti
                    if (Array.isArray(data)) {
                        setSuggestions(data);
                    } else {
                        // Se la risposta non è valida, svuota i suggerimenti
                        setSuggestions([]);
                    }
                })
                .catch(err => {
                    // In caso di errore nella fetch, stampa l’errore e svuota i suggerimenti
                    console.error('Errore nella fetch:', err);
                    setSuggestions([]);
                });
        }, 400);

        // Cleanup: cancella il timeout precedente quando il componente si aggiorna o smonta
        return () => clearTimeout(debounceRef.current);
        // Dipendenza: ogni volta che cambia la query
    }, [query]);

    return (
        <div style={{ position: 'relative', width: '300px' }}>
            {/* Campo input dove l'utente digita la ricerca */}
            <input
                type="text"
                placeholder="Cerca un prodotto..."
                value={query}
                onChange={e => setQuery(e.target.value)} // Aggiorna lo stato ad ogni battuta
                style={{ width: '100%', padding: '8px' }}
            />

            {/* Lista dei suggerimenti (mostrata solo se ci sono risultati) */}
            {suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',      // Sovrapposta sotto l'input
                    top: '100%',               // Subito sotto l'input
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '1px solid #ccc',
                    maxHeight: '200px',        // Scrollabile se troppi elementi
                    overflowY: 'auto',
                    zIndex: 10,
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                }}>
                    {/* Cicla i suggerimenti ricevuti dall'API e li stampa come lista */}
                    {suggestions.map(item => (
                        <li
                            key={item.id}
                            style={{
                                padding: '8px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer'
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
