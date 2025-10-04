const typeDefs =`
scalar Date
type User{
    id:ID!
    name:String!
    email:String!
}
type Habit{
    id:ID!
    userId:ID!
    user:User
    title:String!
    category:String!
    frequency:String!
    streak:Int
    longestStreak:Int
    selectedDays:[String]!
    completedDates:[Date]
    createdAt:Date
    }

type Query{
    getUser:User
    getHabits:[Habit]
    getHabit(id:ID!):Habit
}
input CreateUserInput {
    name: String!
    email: String!
    password: String!
}

input CreateHabitInput {
    title: String!
    category: String!
    frequency: String!
    selectedDays: [String]
    completedDates: [Date]
}
input EditHabitInput {
    id:ID!
    title: String!
    category: String!
    frequency: String!
    selectedDays: [String]
}
input LoginUserInput{
    email:String!
    password:String!
}
    input updateCompleteDatesInput{
        id:ID!
        completedDates:[Date]
    }
    input updateStreakInput{
    id:ID!
    streak:Int
    longestStreak:Int
    }
type AuthPayload{
    token:String
}
type Mutation {
    createUser(input: CreateUserInput!): User
    createHabit(input: CreateHabitInput!): Habit
    loginUser(input:LoginUserInput!):AuthPayload
    logoutUser(id:ID!):User
    updateCompleteDates(input:updateCompleteDatesInput!): Habit
    updateStreak(input:updateStreakInput!): Habit
    deleteHabit(id:ID!): Habit
    editHabit(input:EditHabitInput!): Habit
}

`

export default typeDefs