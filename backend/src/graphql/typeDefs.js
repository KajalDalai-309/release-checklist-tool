const typeDefs = `#graphql
  type Step {
    id: ID!
    order: Int!
    title: String!
    description: String
    completed: Boolean!
  }

  type Release {
    id: ID!
    name: String!
    targetDate: String!
    additionalInfo: String
    status: String!
    completedCount: Int!
    totalSteps: Int!
    progressPercentage: Int!
    completedStepIds: [String!]!
    steps: [Step!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
    steps: [Step!]!
  }

  input CreateReleaseInput {
    name: String!
    targetDate: String!
    additionalInfo: String
    completedStepIds: [String!]
  }

  input UpdateReleaseInput {
    name: String
    targetDate: String
    additionalInfo: String
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Release!
    updateRelease(id: ID!, input: UpdateReleaseInput!): Release!
    updateReleaseSteps(id: ID!, completedStepIds: [String!]!): Release!
    toggleStep(id: ID!, stepId: String!, completed: Boolean!): Release!
    deleteRelease(id: ID!): Release!
  }
`;

module.exports = { typeDefs };
