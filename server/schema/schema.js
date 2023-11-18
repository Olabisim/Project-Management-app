
// const {projects, clients} = require('../sampleData.js')

// mongoose models 

const Project = require('../models/Project.js') 
const Client = require('../models/Client.js') 

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql')


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
                // return clients.find(client => client.id === parent.clientId)
                return Client.findById(parent.clientId);
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
                // return projects
                return Project.find();
            }
        },

        // projects data by ID 
        
        project: {
            type: ProjectType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id)
                return Project.findById(args.id)
            }
        },

        // all clients data 

        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                // return clients;
                return Client.find();
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
                // return clients.find(client => client.id === parent.id) 
                return Client.findById(args.id)
            }
        }  
    }
})

// Mutations 

const mutation  = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add a client
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString) },
                email: {type: GraphQLNonNull(GraphQLString) },
                phone: {type: GraphQLNonNull(GraphQLString) },
            }, 
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                
                return client.save();
            },
        },

        // Delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id)
            }
        },


        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                })
                return project.save()
            }
        },
        // Delete a Project 
        deleteProject: {
            type: ProjectType,
            args: {
                id: GraphQLNonNull(GraphQLString)
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },

        // Update  a Project 
        updateProject: {
            type: ProjectType,
            args: {
                id: GraphQLNonNull(GraphQLString),
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    })
                },
                clientId: {type: GraphQLNonNull(GraphQLString)}
            }, 
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name, 
                        description: args.description,
                        status: args.status,
                    }
                },
                {new: true} //meaning if it is not there it's not going to create a new one.
                )
            }
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation//mutation: mutation 
})
