const graphql = require('graphql');
const _ = require('lodash');

const Movie = require('../models/movie');
const Director = require('../models/director');

const { 
    GraphQLObjectType, GraphQLString, GraphQLInt, 
    GraphQLSchema, GraphQLID, GraphQLList,
    GraphQLNonNull 
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
                return Director.findById(parent.directorId);
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
                return Movie.find({ directorId: parent.id });
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
                return Movie.findById(args.id);
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
                return Director.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movie.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return Director.find({});
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull((GraphQLString)) },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let director = new Director({
                    name: args.name,
                    age: args.age
                });
                return director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull((GraphQLString)) },
                directorId: { type: new GraphQLNonNull((GraphQLID)) }
            },
            resolve(parent, args) {
                let movie = new Movie({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId
                });
                return movie.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});