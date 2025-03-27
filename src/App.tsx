import { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client"
import { GET_CHARACTERS } from "./queries/characters"
import { Character } from "./__generated__/graphql";

function App() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ status: '', species: '' });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [sortField, setSortField] = useState<'name' | 'origin' | ''>('')
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page, filter }
  });

  useEffect(() => {
    if (data?.characters?.results) {
      const results = data.characters.results.filter((char): char is Character => char !== null);
  
      if (sortField) {
        results.sort((a, b) => {
          if (!a || !b) return 0;

          const valueA = sortField === 'origin' ? a.origin?.name ?? '' : a[sortField] ?? '';
          const valueB = sortField === 'origin' ? b.origin?.name ?? '' : b[sortField] ?? '';
          return valueA.localeCompare(valueB);
        });
      }
  
      setCharacters(prevCharacters => 
        page === 1 ? results : [...prevCharacters, ...results]
      );
    }
  }, [data, sortField, page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setCharacters([]);
    setPage(1);
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as 'name' | 'origin' | '');
    setCharacters([]);
    setPage(1);
  }

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive': return 'Alive';
      case 'dead': return 'Dead';
      default: return 'Unknown';
    }
  }

  if (loading && page === 1) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  )

  if (error) return (
    <div className="error-container">
      <div className="error-message">Error: {error.message}</div>
    </div>
  )

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Rick and Morty Characters</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="filters-container">
          <label className="filter-label">
            Status:
            <select 
              name="status" 
              onChange={handleFilterChange}
              className="select"
              value={filter.status}
            >
              <option value="">All</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label className="filter-label">
            Species:
            <select 
              name="species" 
              onChange={handleFilterChange}
              className="select"
              value={filter.species}
            >
              <option value="">All</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
            </select>
          </label>
          <label className="filter-label">
            Sort by:
            <select 
              onChange={handleSortChange}
              className="select"
              value={sortField}
            >
              <option value="">None</option>
              <option value="name">Name</option>
              <option value="origin">Origin</option>
            </select>
          </label>
        </div>

        <section className="characters-grid">
          {characters.map((character) => (
            <article
              key={character.id}
              className="character-card"
            >
              <h2 className="character-name">{character.name}</h2>
              <div className="character-info">
                <p className="character-status">
                  <span className={character.status?.toLowerCase() === 'alive' ? 'status-alive' : 
                                   character.status?.toLowerCase() === 'dead' ? 'status-dead' : ''}>
                    {formatStatus(character.status ?? 'Unknown')}
                  </span>
                </p>
                <p><span className="info-label">Species:</span> {character.species}</p>
                <p><span className="info-label">Gender:</span> {character.gender}</p>
                <p><span className="info-label">Origin:</span> {character.origin && character.origin.name}</p>
              </div>
            </article>
          ))}
        </section>

        {data?.characters?.info?.next && (
          <div className="load-more-container">
            <button
              onClick={() => setPage(prevPage => prevPage + 1)}
              disabled={loading}
              className="button"
            >
              {loading ? (
                <div className="button-loading">
                  <div className="button-spinner"></div>
                  Loading...
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <label className="filter-label">
            Language:
            <select 
              onChange={e => console.log(e.target.value)} 
              className="select"
            >
              <option value="en">English</option>
              <option value="de">German</option>
            </select>
          </label>
        </div>
      </footer>
    </div>
  )
}

export default App
