import { useEffect, useRef, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'
import { TextureLoader, SpriteMaterial, Sprite } from 'three'
import SpriteText from 'three-spritetext'

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

    function handleFocus(node) {
        const distance = 60
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        focusReference.current.cameraPosition({
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
        }, node, 1000)
        setSelected(node)
    }

    function handleExpand(node) {
        async function fetchOrganizations() {
            let currentOrganizations = graphData.nodes
                .filter(node => node.organization)
                .map(node => node.organization)
                .filter((organization, index, array) => array.indexOf(organization) === index)
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
            let organizationLeader
            for (let organization of organizations) {
                if(organization.members.length > 0) {
                    organizationLeader = getUser(organization.members[0])
                    newUsers.push(organizationLeader)
                    newLinks.push({
                        source: node.id,
                        target: organizationLeader.id,
                        organization: organization.name
                    })
                    for (let index = 1; index < organization.members.length; index++) {
                        user = getUser(organization.members[index])
                        user.organization = organization.name
                        newUsers.push(user)
                        newLinks.push({
                            source: organizationLeader.id,
                            target: user.id,
                            organization: organization.name
                        })
                    }
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
                linkWidth={0.5}
                linkDirectionalParticles={1}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                linkAutoColorBy={link => link.organization}
                linkThreeObjectExtend={true}
                linkThreeObject={link => {
                    const sprite = new SpriteText(link.organization)
                    sprite.color = 'lightgrey'
                    sprite.textHeight = 1.5
                    return sprite;
                }}
                linkPositionUpdate={(sprite, { start, end }) => {
                    const middle = Object.assign(...['x', 'y', 'z'].map(c => ({
                        [c]: start[c] + (end[c] - start[c]) / 2
                    })))
                    Object.assign(sprite.position, middle)
                }}
                nodeLabel = {node => node.name + ' ' + Math.floor(node.weight)}
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