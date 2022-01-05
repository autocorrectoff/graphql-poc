const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, GraphQLString, GraphQLInt, 
    GraphQLSchema, GraphQLID, GraphQLList 
} = graphql;

const movies = [
    { name: 'Joker', genre: 'Drama', id: '1', directorId: '1'},
    { name: 'Moonrise Kingdom', genre: 'Romance', id: '2', directorId: '2'},
    { name: 'La La Land', genre: 'Musical', id: '3', directorId: '3'},
    { name: 'Interstellar', genre: 'Sci-Fi', id: '4', directorId: '4'},
    { name: 'Tenet', genre: 'Sci-Fi', id: '5', directorId: '4'}
];

const directors = [
    { name: 'Todd Philips', age: 51, id: '1'},
    { name: 'Wes Anderson', age: 52, id: '2'},
    { name: 'Damien Chazelle', age: 36, id: '3'},
    { name: 'Christopher Nolan', age: 51, id: '4'}
];

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return _.find(directors, { id: parent.directorId });
            }
        }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args){
                return _.filter(movies, { directorId: parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        movie: {
            type: MovieType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(movies, {id: args.id});
            }
        },
        director: {
            type: DirectorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(directors, {id: args.id});
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return movies;
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return directors;
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
});