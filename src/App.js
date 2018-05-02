import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import { Link, Route, Switch } from 'react-router-dom';
import Filter from './Filter.js';
import Item from './Item.js';


const App = () => 
  <Main />

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/rekvisita' component={Search} />
      <Route path='/kostym' component={Search} />
      <Route path='/mobel' component={Search} />
    </Switch>
  </main>
)

class Search extends Component {
  constructor(){
    super();
    this.state = {
      department: '',
      list: [],
      categories: [],
      currentCat: [],
      filter: []
    }

    this.handleFiltering = this.handleFiltering.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
  }

  componentDidMount(){
    const department = this.props.location.pathname.substring(1);
    const db = firebase.firestore();
    db.collection("categories").doc(department).get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data().category);
          var categories = doc.data().category
          //var stringCategories = categories.map(category => category.main)
          this.setState({
            categories: categories,
            currentCat: categories
          });
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    const newResult = [];
    console.log("DEP "+department)
    db.collection("items").where("department", "==", department)
        .get()
        .then((col) => {
            col.forEach((doc) => {
                newResult.push(doc.data());
            });

            this.setState({
              list: newResult
          });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

  }

  snapshotToArray(snapshot) {
    const returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};

  fetchResults(){
    const db = firebase.firestore();
    const newResult = [];
    console.log(this.state.filter[0].value);
    const filter = this.state.filter;
    for(var i=0;i<filter.length;i++){
      if(filter[i].parent){
        console.log(filter.value);
        db.collection("items").where("subCategory", "==", filter.value)
            .get()
            .then((col) => {
                col.forEach((doc) => {
                    newResult.push(doc.data());
                    console.log(doc.data().subCategory);
                });

                this.setState({
                  list: newResult
              });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }
    }
  }


  handleFiltering(obj){
    const newFilter = this.state.filter;
    if(!obj.parent){
      const dict = [];
      obj.sub.map( sub => {
        dict.push({
          main: sub,
          parent: obj.main
        });
      });

      newFilter.push({
        value: obj.main
      });

      this.setState({
        currentCat: dict,
        filter: newFilter
      });


    }else{
      newFilter.push({
        value: obj.main,
        parent: obj.parent
      });

      this.setState({
        filter: newFilter
      });
    }

    this.fetchResults();
  }

  removeFilter(filter){
    const index = [];
    const newFilter = this.state.filter;

    for(var i = 0; i < newFilter.length; i++){
      if(newFilter[i].value === filter.value || newFilter[i].parent === filter.value){
        index.push(i);
      }
    }

    for (var i = index.length -1; i >= 0; i--)
       newFilter.splice(index[i],1);

    this.setState({
      filter: newFilter
    })

  }

  render() {
    const result = this.state.list;
    return (
      <div className="page">
        <Filter 
            categories={this.state.currentCat}
            filter={this.state.filter}
            onFiltering={this.handleFiltering}
            onRemoveFilter={this.removeFilter}
        />
        {result && 
          <div className="grid-container">
          {this.state.list.map(item =>
            <Item object={item} key={item.id}/>
          )}
          </div> 
        }
      </div>
    );
  }
}



const Home = () =>
    <nav>
      <ul>
        <li><Link to='/kostym'>Kostym</Link></li>
        <li><Link to='/rekvisita'>Rekvisita</Link></li>
        <li><Link to='/mobel'>Möbel</Link></li>
      </ul>
    </nav>

export default App;
