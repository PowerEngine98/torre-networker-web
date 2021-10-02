
import React, {
    useState,
    useMemo,
    useContext,
    useCallback
} from 'react'
import axios from 'axios'

const GraphContext = React.createContext()

const initialState = {
    users: [],
    organizations: []
}

const initialGraphData = {
    nodes: [],
    links: []
}

const GraphProvider = (props) => {

    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(initialState)
    const [graphData, setGraphData] = useState(initialGraphData)

    const expandNetwork = useCallback(async (targetUser) => {
        setLoading(true)
        const response = await axios.post(`/api/organizations/${targetUser.username}?limit=20`, {
            exclude_users: state.users.map(user => user.username)
        })
        setLoading(false)
        const newOrganizations = response.data
        const current_organizations = targetUser.organizations ?? []
        targetUser.organizations = current_organizations.concat(
            newOrganizations
                .map(organization => organization.name)
                .filter(name => !current_organizations.includes(name))
        )
        if (!newOrganizations) {
            return
        }
        let newUsers = []
        let newLinks = []
        let user
        for (let organization of newOrganizations) {
            if (!organization.members) {
                continue
            }
            //Add a new link to the existent users if one of them is part of this organization
            for (let existent_user of graphData.nodes) {
                if (existent_user.organizations?.includes(organization.name)) {
                    newLinks.push({
                        source: organization.members[0].username,
                        target: existent_user.username,
                        organization: organization.name
                    })
                }
            }
            //Connect the new direct users of this organization
            //selecting the user with more weight to represent the main organization node
            for (let index = 0; index < organization.members.length; index++) {
                user = organization.members[index]
                newUsers.push(user)
                newLinks.push({
                    source: index > 0 ? organization.members[0].username : targetUser.username,
                    target: user.username,
                    organization: organization.name
                })
            }
        }
        setGraphData(({ nodes, links }) => ({
            nodes: nodes.concat(newUsers),
            links: links.concat(newLinks)
        }))
        setState(({ users, organizations }) => {
            const organizations_by_id = organizations.map(o => o.id)
            return {
                users: users.concat(newUsers),
                organizations: organizations.concat(newOrganizations.filter(o => !organizations_by_id.includes(o.id)))
            }
        })
    }, [
        graphData,
        state
    ])

    const selectNewRoot = useCallback((root) => {
        if (!root) {
            setGraphData(initialGraphData)
            setState(initialState)
            return
        }
        setSelected(root)
        setGraphData({
            nodes: [root],
            links: []
        }, () => {
            setState(previous => ({
                users: previous.users.concat(root.username),
                organizations: []
            }), () => {
                expandNetwork(root)
            })
        })


    }, [expandNetwork])


    const value = useMemo(() => {
        return {
            state,
            setState,
            graphData,
            setGraphData,
            selected,
            setSelected,
            loading,
            selectNewRoot,
            expandNetwork
        }
    }, [
        state,
        graphData,
        selected,
        loading,
        expandNetwork,
        selectNewRoot
    ])

    return <GraphContext.Provider value={value} {...props} />
}

const useGraph = () => {
    const context = useContext(GraphContext)
    if (!context) {
        throw new Error('Invalid use of useGraph, GraphProvider must be defined in parent hierarchy')
    }
    return context
}

export { GraphContext, GraphProvider, useGraph }