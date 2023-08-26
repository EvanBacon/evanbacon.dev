import React, { ChangeEvent, useState, useEffect } from 'react';

import DATA from '@/aka.json';

type AppDataItem = {
  category: string;
  author: string;
  bundleId: string;
  id: number;
  name: string;
  releaseDate: string;
  rank: number;
  rating: number;
  minimumOsVersion: string;
  url: string;
  iconUrl: string;
  expo: string[];
};

const data = DATA as AppDataItem[];

const AppData = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AppDataItem[]>([]);
  const [sortExpo, setSortExpo] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const toggleSortExpo = () => {
    setSortExpo(!sortExpo);
  };

  useEffect(() => {
    let filteredResults = data.filter(item =>
      [item.name, item.author, item.category, item.bundleId].some(field =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortExpo) {
      filteredResults.sort((a, b) => b.expo.length - a.expo.length);
    }

    setResults(filteredResults);
  }, [search, sortExpo]);

  return (
    <div className="container mx-auto p-2 px-4">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg shadow-sm"
      />
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 sm:px-4 py-2 border-b">Name</th>
              {/* Hide on mobile */}
              <th className="px-2 sm:px-4 py-2 border-b hidden sm:table-cell">
                Author
              </th>
              <th className="px-2 sm:px-4 py-2 border-b hidden sm:table-cell">
                Category
              </th>
              <th className="px-2 sm:px-4 py-2 border-b">Bundle ID</th>
              <th
                className="px-2 sm:px-4 py-2 border-b cursor-pointer"
                onClick={toggleSortExpo}
              >
                Expo
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map(item => (
              <tr key={item.id}>
                <td className="px-2 sm:px-4 py-2 border-b flex items-center">
                  <img
                    src={item.iconUrl}
                    alt={item.name}
                    className="w-6 h-6 mr-2"
                  />
                  <a
                    href={item.url}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    {item.name}
                  </a>
                </td>
                <td className="px-2 sm:px-4 py-2 border-b hidden sm:table-cell">
                  {item.author}
                </td>
                <td className="px-2 sm:px-4 py-2 border-b hidden sm:table-cell">
                  {item.category}
                </td>
                <td className="px-2 sm:px-4 py-2 border-b break-all min-w-[200px]">
                  {item.bundleId}
                </td>
                <td className="px-2 sm:px-4 py-2 border-b break-all min-w-[200px]">
                  {item.expo.length ? '✅ ' : '❌'}
                  {item.expo.length ? (
                    <span className="hidden sm:table-cell">
                      {item.expo.join(',\n')}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppData;
