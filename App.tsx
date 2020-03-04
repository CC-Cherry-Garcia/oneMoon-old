import React, { useReducer, useEffect } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import API, { graphqlOperation } from "@aws-amplify/api";
import PubSub from "@aws-amplify/pubsub";
import { createTodo } from "./src/graphql/mutations";

import config from "./aws-exports";
API.configure(config); // Configure Amplify
PubSub.configure(config);

async function createNewTodo() {
  const todo = { name: "Name TKTKT", description: "Realtime and Offline" };
  await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

// other imports
import { listTodos } from "./src/graphql/queries";
import { onCreateTodo } from "./src/graphql/subscriptions";

const initialState = { todos: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "QUERY":
      return { ...state, todos: action.todos };
    case "SUBSCRIPTION":
      return { ...state, todos: [...state.todos, action.todo] };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData();
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: eventData => {
        const todo = eventData.value.data.onCreateTodo;
        dispatch({ type: "SUBSCRIPTION", todo });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function getData() {
    const todoData = await API.graphql(graphqlOperation(listTodos));
    dispatch({ type: "QUERY", todos: todoData.data.listTodos.items });
  }

  return (
    // <View style={styles.container}>
    //   <Text>oneMoon</Text>
    //   <Image
    //     style={{ width: 500, height: 300 }}
    //     source={{
    //       uri: "https://source.unsplash.com/collection/190727/1600x900"
    //     }}
    //   />
    // </View>
    <View style={styles.container}>
      <Button onPress={createNewTodo} title="Create Todo" />
      {state.todos.map((todo, i) => (
        <Text key={todo.id}>
          {todo.name} : {todo.description}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
