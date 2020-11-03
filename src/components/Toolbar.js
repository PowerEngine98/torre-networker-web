import { useState } from 'react'

function Toolbar({ onInputChange, onSelectChange }) {

    const [state, setState] = useState({
        input: '',
        select: false
    })

    function handleInputChange(event) {
        setState({ ...state, input: event.target.value })
    }

    function handleSelectChange() {
        onSelectChange(!state.select)
        setState({ ...state, select: !state.select })
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            notifySearch()
        }
    }

    function notifySearch() {
        onInputChange(state.input)
    }

    return (
        <div className='grid grid-flow-col auto-cols-min h-12 text-lg border border-solid border-black'>
            <button className='px-2 hover:bg-light2 focus:outline-none' onClick={notifySearch}>
                <i className='icofont-ui-search'></i>
            </button>
            <input className='bg-transparent text-white placeholder-white px-3 border-solid border-l border-r border-black hover:bg-light2 active:bg-light2 focus:outline-none' type='text' value={state.input} placeholder='Type a torre username...' spellCheck={false} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            <button className={'px-2 hover:bg-light2 focus:outline-none ' + (state.select ? '' : 'bg-secondary')} onClick={handleSelectChange}>
                <i className='icofont-plus-square'></i>
            </button>
            <button className={'px-2 hover:bg-light2 focus:outline-none ' + (!state.select ? '' : 'bg-secondary')} onClick={handleSelectChange}>
                <i className='icofont-location-arrow'></i>
            </button>
        </div>
    )
}

export default Toolbar