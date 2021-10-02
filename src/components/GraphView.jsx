

import { useRef } from 'react'
import { ForceGraph3D } from 'react-force-graph'
import { TextureLoader, SpriteMaterial, Sprite } from 'three'
import SpriteText from 'three-spritetext'
import { useGraph } from '../contexts/GraphContext'

import profile_placeholder from '../assets/images/profile_placeholder.png'
import { MdHourglassEmpty, MdSearch } from 'react-icons/md'
import TopBar from './TopBar'

const GraphView = () => {

    const {
        setState,
        graphData,
        setGraphData,
        selected,
        setSelected,
        loading
    } = useGraph()

    const focusReference = useRef()

    const focusSelectedNode = () => {
        selected.x = selected.x ? selected.x : 0
        selected.y = selected.y ? selected.y : 0
        selected.z = selected.z ? selected.z : 0
        const distance = 100
        const distRatio = 1 + distance / Math.hypot(selected.x, selected.y, selected.z)
        focusReference.current.cameraPosition({
            x: selected.x ? selected.x * distRatio : 0,
            y: selected.y ? selected.y * distRatio : 0,
            z: selected.y ? selected.z * distRatio : distance
        }, selected, 1000)
    }

    return (
        <div className='flex fixed w-full h-full flex-col bg-secondary font-muli'>
            <TopBar focus={focusSelectedNode}/>
            <div className='flex w-full h-full items-center justify-center overflow-x-hidden overflow-y-hidden'>
                {
                    !selected &&
                    <div className='absolute z-20 flex w-full h-full items-center justify-center'>
                        <div className='flex flex-col items-center w-64 space-y-3 animate-bounce'>
                            <MdSearch className='text-5xl' />
                            <p className='text-white text-center'>
                                Seach someone to start exploring his professional network
                            </p>
                        </div>
                    </div>
                }
                {
                    loading &&
                    <div className='absolute z-20 flex w-full h-full items-center justify-center'>
                        <div className='flex w-16 h-16 rounded-full bg-modal-shadow items-center justify-center'>
                            <MdHourglassEmpty className='text-5xl animate-spin text-primary' />
                        </div>
                    </div>
                }
                <ForceGraph3D
                    ref={focusReference}
                    width={1920}
                    height={1080}
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
                        sprite.color = 'white'
                        sprite.textHeight = 1.5
                        setState(({ users, organizations }) => {
                            const organization = organizations.find(organization => organization.name === link.organization)
                            if (organization) {
                                organization.color = link.color
                            }
                            return {
                                users,
                                organizations
                            }
                        })
                        return sprite
                    }}
                    linkPositionUpdate={(sprite, { start, end }) => {
                        const middle = Object.assign(...['x', 'y', 'z'].map(c => ({
                            [c]: start[c] + (end[c] - start[c]) / 2
                        })))
                        Object.assign(sprite.position, middle)
                    }}
                    nodeId='username'
                    nodeColor='black'
                    onNodeClick={setSelected}
                    nodeThreeObject={node => {
                        let loader = new TextureLoader()
                        let texture = loader.load(
                            node.photo && !node.image_error ? node.photo : profile_placeholder,
                            (texture) => { },
                            (xhr) => { },
                            (xhr) => {
                                node.image_error = true
                                setGraphData({ ...graphData })
                            })
                        let material = new SpriteMaterial({ map: texture })
                        let sprite = new Sprite(material)
                        sprite.scale.set(12, 12)
                        return sprite
                    }}
                />
            </div>
        </div>
    )
}


export default GraphView