import React, { useState, useMemo } from 'react';
import Image from './Image';
import Input from './Input';
import { normalizeText } from './Trie';
import useCSVImageLabels from './useCSVImageLabels';

function App() {
  const [labels, trie] = useCSVImageLabels('/datasets/train_labels.csv');

  const [query, setQuery] = useState('');

  const labelsEntries = Object.entries(labels);
  const filteredLabelsEntries = useMemo(() => {
    if (!query || !trie) return [];
    const wordsWithData = trie.getWordsWithPrefix(query);

    const data = wordsWithData.reduce((acc, cur) => {
      if (cur && cur.data) {
        Object.entries(cur.data).forEach(([key, labels]) => {
          if (key in acc) {
            acc[key].push(...labels);
          } else {
            acc[key] = [...labels];
          }
        });
      }
      return acc;
    }, {});

    return Object.entries(data);
  }, [query, trie]);

  return (
    <div style={{ fontFamily: 'arial' }}>
      <style scoped>{'ol { margin: 0; padding: 0; list-style: none; }'}</style>
      <Input
        {...{
          query,
          setQuery,
          normalizeQuery: normalizeText,
          trie,
          filterResultsText:
            'showing datasets: ' +
            (filteredLabelsEntries.length
              ? `${filteredLabelsEntries.length} / ${labelsEntries.length}`
              : `${labelsEntries.length}`),
        }}
      />
      <ol>
        {(filteredLabelsEntries.length
          ? filteredLabelsEntries
          : labelsEntries
        ).map(([key, labels]) => (
          <li style={{ margin: '10px auto' }} {...{ key }}>
            <Image src={`datasets/train_images/${key}`} {...{ labels }} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
