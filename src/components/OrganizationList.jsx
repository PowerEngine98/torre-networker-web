import clsx from 'clsx'
import { useCallback } from 'react'
import { useGraph } from '../contexts/GraphContext'

const OrganizationList = (props) => {

    const { organizations } = props
    const {state} = useGraph()

    const getOrganizationColor = useCallback((organization_name) => {
        const organization = state.organizations.find(o => o.name === organization_name)
        return organization?.color ?? 'white'
    }, [state.organizations])

    return (
        <div className={clsx(
            'flex',
            'flex-wrap',
            'w-full max-h-24',
            'px-2',
            'justify-center items-center',
            'text-center',
            'space-x-1',
            'text-xs',
            'font-hairline',
            'overflow-y-auto'
        )}
        >
            {
                organizations.map((organization, index) =>
                    <>
                        {
                            index > 0 &&
                            <span
                                key={index}
                                className='text-primary'
                            >
                                &bull;
                            </span>
                        }
                        <span
                            key={organization}
                            className='truncate'
                            style={{
                                color: getOrganizationColor(organization)
                            }}
                        >
                            {organization}
                        </span>
                    </>
                )
            }
        </div>

    )
}

export default OrganizationList