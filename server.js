import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"hello",
        userId: "2"
    },
    {
        id:"2",
        text:"every",
        userId: "1"
    }
];

let users = [
    {
        id: "1",
        firstName: "Kim",
        lastName: "ChanHo"
    },
    {
        id: "2",
        firstName: "haha",
        lastName: "hohoho"
    }
];

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }

    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allTweets: [Tweet!]!
        allUsers: [User!]!
        allMovies: [Movie!]!
        tweet(id: ID): Tweet
        movie(id: ID): Movie
    }
    
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
    
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
    }
`;

const resolvers = {
    Query: {
        tweet(_, { id }) {
            return tweets.find(tweets => tweets.id === id);
        },
        movie(_, { id }) {
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
                    .then((r) => r.json())
                    .then((json) => json.data.movie);
        },
        allTweets() {
            return tweets;
        },
        allUsers() {
            console.log('allUsers = ');
            return users;
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json")
                    .then((r) => r.json())
                    .then((json) => json.data.movies);
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };

            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, { id }) {
            console.log('delete test1 :::: ', id);
            const tweet = tweets.find(tweet => tweet.id === id);
            console.log('delete test2 :::: ', tweet);
            if(!tweet) {
                return false;
            }

            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        }
    },
    User: {
        firstName({ firstName }) {
            return `${firstName}`;
        },
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({userId}) {
            return users.find(user => user.id === userId)
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({url}) => {
    console.log(`Running on ${url}`)
});