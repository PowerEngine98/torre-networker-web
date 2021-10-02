import clsx from 'clsx'
import { useState } from 'react'
import HexagonImage from './HexagonImage'
import {
    MdChevronRight,
    MdExpandMore,
    MdMyLocation,
    MdWork,
    MdZoomOutMap
} from 'react-icons/md'
import profile_placeholder from '../assets/images/profile_placeholder.png'
import { useGraph } from '../contexts/GraphContext'
import OrganizationList from './OrganizationList'
import Button from './Button'

const UserDetail = (props) => {

    const {focus} = props

    const [open, setOpen] = useState(true)
    const { selected, loading, expandNetwork } = useGraph()

    if (!selected) {
        return null
    }

    return (
        <div>
            <div
                className={clsx(
                    'flex',
                    'flex-row',
                    'justify-between',
                    'px-4 py-2',
                    'bg-secondary',
                    'hover:bg-light2',
                    'border border-light2',
                    'hover:border-light1',
                    'shadow-xl',
                    'focus:outline-none'
                )}
                onClick={() => setOpen(!open)}
            >
                <h3 className='text-white truncate'>
                    {selected.name}
                </h3>
                <span className='flex items-center text-xl text-light1' >
                    {
                        open ? <MdExpandMore /> : <MdChevronRight />
                    }
                </span>
            </div>
            {
                open &&
                <div className={clsx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'bg-secondary',
                    'p-4',
                    'space-y-2',
                    'text-white',
                    'overflow-x-hidden',
                    'overflow-y-auto',
                    'hide-scroll'
                )}
                >
                    <HexagonImage
                        src={selected.photo}
                        fallBack={profile_placeholder}
                        onClick={focus}
                    />
                    <p className='max-h-20 text-center overflow-y-scroll hide-scroll'>
                        {selected.headline}
                    </p>
                    <a
                        className={clsx(
                            'text-primary',
                            'hover:underline',
                            'focus:underline',
                            'hover:opacity-70',
                            'focus:opacity-70'
                        )}
                        href={`https://bio.torre.co/${selected.username}`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {`@${selected.username}`}
                    </a>
                    {
                        selected.organizations &&
                        <>
                            <div className='flex items-center text-center space-x-1 text-light1'>
                                <MdWork />
                                <span>{`${selected.name.split(' ')[0]}'s organizations`}</span>
                            </div>
                            <OrganizationList organizations={selected.organizations} />
                        </>
                    }
                </div>
            }
            <div className='flex w-full p-4 space-x-3'>
                <Button
                    disabled={loading}
                    onClick={() => expandNetwork(selected)}
                >
                    <MdZoomOutMap />
                    <span>EXPAND</span>
                </Button>
                <Button
                    onClick={() => focus()}
                >
                    <MdMyLocation />
                    <span>FOCUS</span>
                </Button>
            </div>
        </div>
    )
}

export default UserDetail
