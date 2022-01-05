// https://github.com/prisma-labs/graphql-request
const { GraphQLClient, gql } = require('graphql-request');
const util = require('util');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(rl.question);

const SERVER_URL = 'http://localhost:3000/graphql';
const client = new GraphQLClient(SERVER_URL);
 
const fetchMovies = async() => {
    const query = gql`
        {
            directors{
                name
                age
                movies{
                    name
                }
            }
        }
        `;
    const response = await client.request(query);
    console.log(response);
};

const fetchDirectors = async() => {
    const query = gql`
    {
        directors{
          name
          movies{
            name
            genre
          }
        }
    }
    `;
    const response = await client.request(query);
    console.log(response);
};

const addDirector = async(name, age = null) => {
    const query = gql`
    mutation{
        director(name: ${name}, age: ${age}){
            id
            name
        }
    }
    `;
    const response = await client.request(query);
    console.log(`Created: ${response}`);
};

const promptUser = async () => {
    const resp = await question('>>> This is a client for testing GraphQL backend. Do you want to fetch Movies (1), fetch Directors (2), add a Movie (3), add a Director (4) ?');
    let option;
    try {
        option = parseInt(resp);
    } catch(err){
        console.error(err);
        rl.close();
    }
    
    switch(option) {
        case 1:
            await fetchMovies();
            break;
        case 2:
            await fetchDirectors();
            break;
        case 3:
            const name = rl.question('>>> Director name?');
            await addDirector(name);
            break;
        case 4:
            console.log(option);
            break;
        default:
            console.log('Invalid selection');
    }
    rl.close();
};

rl.on('close', () => {
    console.log('\nBYE BYE !!!');
    process.exit(0);
});

(async () => {
    await promptUser();
})();