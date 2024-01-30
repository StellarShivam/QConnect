const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    input userInputData{
        email:String!
        name:String!
        password:String!
        pic:String!
    }

    input postInputData{
        image:String!
        text:String!
    }

    type User{
        _id:ID!
        name:String!
        email:String!
        password:String!
        pic:String!
        isAdmin:Boolean!
    }

    type Post{
        _id:ID!
        image:String!
        text:String!
        creator:User!
    }

    type Message{
        _id:ID!
        sender:User!
        content:String!
        chat:Chat!
    }

    type Chat{
        _id:ID!
        chatName:String!
        isGroupChat:Boolean!
        isPostChat:Boolean!
        users:[User!]!
        latestMessage:Message!
        groupAdmin:User!
        post:Post!
    }

    type AuthData{
        token:String!
        userId:String!
    }

    type AllPostsData{
        posts:[Post!]!
    }
    type MyPostsData{
        posts:[Post!]!
    }

    type CommentsData{
        comments:[Message!]!
    }

    type MessagesData{
        messages:[Message!]!
    }

    type ChatsData{
        chats:[Chat!]!
    }

    type RootQuery{
        signin(email:String!, password:String!): AuthData!
        fetchAllPosts():AllPostsData!
        fetchMyPosts():MyPostsData!
        fetchComments(id:ID!):CommentsData!
        allMessages(id:ID!):MessagesData!
        fetchChats():ChatsData!
    }

    type RootMutation{
        signup(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
        deletePost(postId: ID!): Post!
        sendComment(postId: ID!, content: String!): Message!
        sendMessage(chatId: ID!, content: String!): Message!
        accessChat(chatId: ID!): Chat!
        createGroupChat(chatName: String!): Chat!
        renameGroup(chatId: ID!, newChatName: String!): Chat!
        addToGroup(chatId: ID!, userId: ID!): Chat!
        removeFromGroup(chatId: ID!, userId: ID!): Chat!
    }

    schema{
        query: RootQuery
        mutation : RootMutation
    }
`);