import { ChangeEvent } from 'react'

type Props = {
    neighborhoods: string[]
    selectedNeighborhood: string
    selectNeighborhood: (neighborhood: string) => void
    resetFilters: () => void
}

function FilterPanel({
    neighborhoods,
    selectedNeighborhood,
    selectNeighborhood,
    resetFilters,
}: Props): JSX.Element {
    return (
        <div className="module__info-panel">
            <header className="info-panel__header">
                <h1 className="info-panel__heading">Filters</h1>
                <button className="text-btn" onClick={resetFilters}>
                    Reset Filters
                </button>
            </header>

            <form>
                <div className="form-group">
                    <label htmlFor="neighborhood">Neighborhood</label>
                    <select
                        id="neighborhood"
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            selectNeighborhood(event.currentTarget.value)
                        }}
                        value={selectedNeighborhood}
                    >
                        <option disabled value=""></option>
                        {neighborhoods.map((neighborhood, i) => (
                            <option key={i} value={neighborhood}>
                                {neighborhood}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    )
}

export default FilterPanel
