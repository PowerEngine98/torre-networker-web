import { useEffect, useRef, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'
import { TextureLoader, SpriteMaterial, Sprite } from 'three'

function getUser(networkUser) {
    let user = { ...networkUser }
    user.id = user.username
    delete user.organizations
    return user
}

function GraphView({ username, select }) {

    const [selected, setSelected] = useState(null)
    const focusReference = useRef()
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: []
    })

    useEffect(() => {
        async function fetchUser() {
            let root = await fetch('api/user/' + username).then(res => res.json())
            if (!root.username) {
                setGraphData({
                    nodes: [],
                    links: []
                })
            }
            else {
                setGraphData({
                    nodes: [getUser(root)],
                    links: []
                })
            }
        }
        if (username) {
            fetchUser()
        }
    }, [username])

    useEffect(() => {
        if (!select) {
            setSelected(null)
        }
    }, [select])

    const handleFocus = node => {
        const distance = 60
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        focusReference.current.cameraPosition({
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
        }, node, 1000)
        setSelected(node)
    }

    const handleExpand = node => {
        async function fetchOrganizations() {
            let currentOrganizations = graphData.nodes
                .filter(node => node.organization)
                .map(node => node.organization)
                .filter((organization, index, array) => array.indexOf(organization) == index)
            let payload = {
                organizations: currentOrganizations,
                users: graphData.nodes.map(node => node.id)
            }
            let options = {
                method: 'post',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }
            let organizations = await fetch('api/organizations/' + node.username, options).then(res => res.json())
            let newUsers = []
            let newLinks = []
            let user
            for (let organization of organizations) {
                for (let targetUser of organization.members) {
                    user = getUser(targetUser)
                    user.organization = organization.name
                    newUsers.push(user)
                    newLinks.push({
                        source: node.id,
                        target: user.id
                    })
                }
            }
            setGraphData(({ nodes, links }) => ({
                nodes: nodes.concat(newUsers),
                links: links.concat(newLinks)
            }))
        }
        fetchOrganizations()
    }

    return (
        <div className='absolute justify-center'>
            <ForceGraph3D
                ref={focusReference}
                graphData={graphData}
                backgroundColor='rgba(0, 0, 0, 0)'
                showNavInfo={false}
                linkOpacity={0.5}
                linkColor='rgba(0, 0, 0, 1)'
                linkWidth={0.5}
                linkDirectionalParticles={1}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                nodeThreeObject={(node) => {
                    const texture = new TextureLoader().load(node.photo)
                    const material = new SpriteMaterial({ map: texture })
                    const sprite = new Sprite(material)
                    sprite.scale.set(12, 12)
                    return sprite
                }}
                onNodeClick={select ? handleFocus : handleExpand}
            />
        </div>
    )
}

export default GraphView