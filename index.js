var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    item: 1,
    name: "WoodsHill",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    item: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    item: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  item: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  item : Int
  name: String
  description: String
  dishes: [DishInput]
}
input DishInput{
  name: String
  price: Int
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, input: restaurantInput): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    // Your code goes here
    return restaurants[arg.id]},
  restaurants: () => {
    // Your code goes here
    return restaurants
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
   ({item: input.item,name:input.name, description:input.description, dishes: {name: input.name, price: input.price}}),
    
    restaurants.push(input),
    console.log(JSON.stringify(restaurants))
    console.log(JSON.stringify(input))
    return input

  },
  
  deleterestaurant: ({ id }) => {
    // Your code goes here
    const ok = Boolean(restaurants[id])
    let delr = restaurants[id];
    restaurants = restaurants.filter(item => item.id !== id);
    
    console.log(JSON.stringify(restaurants));
    console.log(JSON.stringify(delr)) ;
    

    return {ok}
  },

  editrestaurant: ({ id, input }) => {
    // Your code goes here
    if(!restaurants[id]) {
      throw new Error("Restaurant ID doesn't exist " + id)
    }
    
    restaurants[id] = input
    console.log(JSON.stringify(restaurants[id]))
    return restaurants[id]
    },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
