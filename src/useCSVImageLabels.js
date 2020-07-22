import { useEffect, useState } from 'react';
import Trie from './Trie';

export default function useCSVImageLabels(
  fileUrl,
  imageIdColumnIndex = 0,
  columnDelimiter = ',',
  lineDelimiter = '\n'
) {
  const [labels, setLabels] = useState({});
  const [trie, setTrie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(fileUrl);
      const result = await res.body.getReader().read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const [header, ...rows] = csv.split(lineDelimiter);
      const labelsMap = {};
      const columns = header.split(columnDelimiter);
      for (let row of rows) {
        const rowData = row.split(columnDelimiter);
        const id = rowData[imageIdColumnIndex];
        const label = Object.fromEntries(
          rowData.map((value, index) => [
            columns[index]?.toLowerCase(),
            Number(value) || value,
          ])
        );
        if (id in labelsMap) {
          labelsMap[id].push(label);
        } else {
          labelsMap[id] = [label];
        }
      }

      const trie = new Trie();
      Object.entries(labelsMap).forEach(([key, labelGroups]) => {
        labelGroups.forEach((labelGroup) => {
          const { label } = labelGroup;
          trie.addWord(label, { ...labelGroup, key });
        });
      });

      setLabels(labelsMap);
      setTrie(trie);
    }
    fetchData();
  }, [columnDelimiter, fileUrl, imageIdColumnIndex, lineDelimiter]);

  return [labels, trie];
}
