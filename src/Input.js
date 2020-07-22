import debounce from 'lodash.debounce';
import React, { useMemo } from 'react';

export default function Input({
  query,
  setQuery,
  normalizeQuery,
  trie,
  filterResultsText,
}) {
  const debounceTimeout = 200; //ms
  const debouncedSetQuery = debounce(
    (value) => setQuery(normalizeQuery(value)),
    debounceTimeout
  );

  const queryAutocomplets = useMemo(() => {
    if (!query || !trie) return [];
    return trie.getWordsWithPrefix(query);
  }, [query, trie]);

  return (
    <>
      <input
        id="query-input"
        type="text"
        placeholder="Label starts with..."
        autoComplete="off"
        onChange={({ target: { value } }) => debouncedSetQuery(value)}
      />{' '}
      {filterResultsText}
      {queryAutocomplets.length && queryAutocomplets[0].word !== query ? (
        <ol
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            minWidth: '150px',
          }}
        >
          {queryAutocomplets.map(({ word }) => (
            <li
              key={word}
              onClick={() => {
                const queryInput = document.getElementById('query-input');
                queryInput.value = word;
                setQuery(word);
              }}
              style={{
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              {word.slice(0, query.length)}
              <strong>{word.slice(query.length)}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
