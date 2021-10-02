import React, { useState } from 'react'

const HexagonImage = (props) => {

    const {
        src,
        fallBack,
        onClick
    } = props

    const [loading, setLoading] = useState(false)

    return (
        <svg
            className='p-1 stroke-current stroke-2 text-primary hover:opacity-70'
            viewBox='0 0 100 100'
            onClick={() => onClick?.()}
        >
            <defs>
                <pattern
                    id='img'
                    patternUnits='userSpaceOnUse'
                    width='100'
                    height='100'
                >
                    <image
                        href={!src || loading ? fallBack : src}
                        alt='Profile photo'
                        x='-25'
                        width='150'
                        height='100'
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                    />
                </pattern>
            </defs>
            <polygon points='50 1 95 25 95 75 50 99 5 75 5 25' fill='url(#img)' />
        </svg>
    )
}

export default HexagonImage
