import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"hello",
    },
    {
        id:"2",
        text:"every",
    }
];

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
    }

    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID): Tweet
        ping: String!
    }
    
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        tweet(root, { id }) {
            return tweets.find(tweets => tweets.id === id);
        },
        ping() {
            console.log('call ping');
            return "pong";
        },
        allTweets() {
            return tweets;
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
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({url}) => {
    console.log(`Running on ${url}`)
});