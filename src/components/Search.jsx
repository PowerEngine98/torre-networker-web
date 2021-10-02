import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import UserResult from './UserResult'
import { useGraph } from '../contexts/GraphContext'
import { MdSearch } from 'react-icons/md'

const Search = () => {

    const [name, setName] = useState('')
    const [results, setResults] = useState()
    const {selectNewRoot} = useGraph()

    const search = useCallback(async (name) => {
        try {
            if(!name) {
                setResults(undefined)
            }
            const response = await axios.post('https://search.torre.co/people/_search?size=5', {
                name: {
                    term: name
                }
            })
            const results = response.data?.results?.map(result => {
                return {
                    username: result.username,
                    name: result.name,
                    weight: result.weight,
                    headline: result.professionalHeadline,
                    photo: result.picture,
                    organizations: []
                }
            })
            setResults(results)
        }
        catch (error) {
            console.error(error)
        }
    }, [setResults])

    useEffect(() => {
        const timeOutId = setTimeout(async () => {
            await search(name)
        }, 300)
        return () => clearTimeout(timeOutId)
    }, [name, search])

    return (
        <div className='flex flex-col'>
            <div className='p-2'>
                <div
                    className={clsx(
                        'flex',
                        'items-center',
                        'px-3',
                        'border border-primary',
                        'rounded-l-full rounded-r-full',
                    )}
                >
                    <MdSearch className='text-xl text-primary hover:opacity-70' />
                    <input
                        className={clsx(
                            'w-full',
                            'bg-transparent',
                            'p-1',
                            'text-white',
                            'focus:outline-none'
                        )}
                        placeholder='Search someone...'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            </div>
            {
                results &&
                results.map((result, index) =>
                    <UserResult
                        key={index}
                        user={result}
                        onClick={() => {
                            selectNewRoot(result)
                            setName('')
                            setResults(undefined)
                        }}
                    />
                )
            }
        </div>
    )
}

export default Search