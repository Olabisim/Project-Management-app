const {projects, clients} = require('../sampleData.js')

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql')


// Client Type

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields:() => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})


// Project Type

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        status: { type: GraphQLString},
        client: {
            type: ClientType,
            // the parent refers to the project Type 
            resolve(parent, args) {
                return clients.find(client => client.id === parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({   
    name: 'RootQueryType',
    fields: {
        
        // projects

        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects
            }
        },

        // projects data by ID 
        
        project: {
            type: ProjectType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id)
            }
        },

        // all clients data 

        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;
            }

        },

        // clients data by ID 

        client: {
            type: ClientType,
            // args is somthing like the params
            args: {
                id: {type: GraphQLID } 
            },
            resolve(parent, args) {
                return clients.find(client => client.id === parent.id) 
            }
        }  
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
