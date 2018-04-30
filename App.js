import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { List, ListItem } from "react-native-elements";
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAt8ZZqjFV-1YAwu_5tceSQaeRDQKSVHz8",
  authDomain: "movil-segundo-entregable.firebaseapp.com",
  databaseURL: "https://movil-segundo-entregable.firebaseio.com",
  projectId: "movil-segundo-entregable",
  storageBucket: "movil-segundo-entregable.appspot.com",
  messagingSenderId: "2959232333"
};
firebase.initializeApp(config);
const userRef = firebase.database().ref('/users');

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      fireData: []
    }
  }

  componentWillMount() {
    this.fetchData();
    this.loadDataFromFirebase();
  }

  fetchData = async () => {
    const response = await fetch("https://randomuser.me/api?results=1");
    const json = await response.json();
    let users = json.results;
    let items = [];
    users.map((u) => {
      const {name, picture} = u;
      let mappedUser = {name, picture};
      items.push(mappedUser);
    });
    this.setState({
      data: items,
      fireData: this.state.fireData
    });
  }

  loadDataFromFirebase = () => {
    userRef.on('value', snapshot => {
      let items = [];
      snapshot.forEach(s => {
        items.push(s.val());
        console.log(items);
      });
      this.setState({
        data: this.state.data,
        fireData: items
      });
    });
  }

  beginSave = () => {
    this.state.data.forEach(item => {
      userRef.push().set(item);
    });
  }



  saveDataToFirebase = (user) => {
    userRef.push().set(user);
  }

  render() {
    return (
      <View style={styles.container}>
        <List>
          <FlatList
            data={this.state.fireData}
            keyExtractor={(x, i) => i}
            renderItem={({item}) =>
              <View style={{flex:1, justifyContent: 'center', width: 300, padding: 15, marginTop: 50}}>
                <ListItem
                  roundAvatar
                  avatar={{ uri: item.picture.thumbnail }}
                  title={`${item.name.first} ${item.name.last}`}
                  />
              </View>
            } 
          >
          </FlatList>
        </List>
        <Button title="Save to firebase" onPress={this.beginSave} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
});
