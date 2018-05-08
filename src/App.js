import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import { Link, Route, Switch } from 'react-router-dom';
import Filter from './Filter.js';
import Item from './Item.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowCircleLeft from '@fortawesome/fontawesome-free-solid/faArrowCircleLeft';


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
      filter: [],
      priceFilter:[]
    }

    this.handleFiltering = this.handleFiltering.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.backToMainCategories = this.backToMainCategories.bind(this);
    this.priceFilter = this.priceFilter.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
  }

  componentDidMount(){
    const department = this.props.location.pathname.substring(1);
    const db = firebase.firestore();
    db.collection("categories").doc(department).get().then((doc) => {
      if (doc.exists) {
          var categories = doc.data().category;
          var cat2;
          var cat3;
          if(department === "rekvisita" || department === "rekvisita"){
            cat2 = doc.data().color;
            cat3 = doc.data().material;
          }else{
            cat2 = doc.data().type;
            cat3 = doc.data().size;
          }

          //var stringCategories = categories.map(category => category.main)
          this.setState({
            categories: categories,
            currentCat: categories,
            cat2: cat2,
            cat3: cat3
          });
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


    // const newResult = [];
    // db.collection("items").where("department", "==", department)
    //     .get()
    //     .then((col) => {
    //         col.forEach((doc) => {
    //             newResult.push(doc.data());
    //         });

    //         this.setState({
    //           list: newResult
    //       });
    //     })
    //     .catch(function(error) {
    //         console.log("Error getting documents: ", error);
    //     });

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
    const catFilter = this.state.filter;
    const priceFilter = this.state.priceFilter;
    const main = [];
    const sub = [];


    // for (var i = main.length - 1; i >= 0; i--) {
    //   for(var j=0;j<sub.length;j++){
    //     if(main[i].value === sub[j].parent){
    //       main.splice(i,1);
    //     }
    //   }
    // }

    //console.log(main);
    //console.log(sub);

    const results = [];
    catFilter.map(cat => {
      db.collection("items").where("mainCategory", "==", cat.value)
          .get()
          .then((col) => {
              col.forEach((doc) => {
                  results.push(doc.data());
              });

              this.filterResults(results);

          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
    })

    // console.log(array1);
    // console.log(array2);

    // const a = array1.concat(array2);
    // console.log(a);

}

  filterResults(results){
    const filteredResults = results;
    const filter = this.state.filter;
    const parents = [];
    const children = [];

    filter.map(cat =>{
      if(cat.parent){
        children.push(cat.value);
        parents.push(cat.parent);
      }
    })

    for (var i = filteredResults.length-1; i >= 0; i--) {
      if(parents.includes(filteredResults[i].mainCategory) && !children.includes(filteredResults[i].subCategory)){
        filteredResults.splice(i,1);
      }
    }

    //console.log(filteredResults);
    this.setState({
      list: filteredResults
    })
    
  }


  changeCategory(str){
    let options = [];
    if(str === "Kategori"){
      options = this.state.categories;
    }if(str === "Färg"){
      options = this.state.cat2;
    }if(str === "Material"){
      options = this.state.cat3;
    }if(str === "Artikeltyp"){
      options = this.state.cat2;
    }if(str === "Storlek"){
      options = this.state.cat3;
    }

    this.setState({
      currentCat: options
    })
  }


  backToMainCategories(){

    this.setState({
      currentCat: this.state.categories
    });
  }


  handleFiltering(obj){
    for(var i=0;i<this.state.filter.length;i++){
      if(obj.main === this.state.filter[i].value){
        if(!obj.parent){
            const setCat = [];
            obj.sub.map( sub => {
              setCat.push({
                main: sub,
                parent: obj.main
              });
            });
            this.setState({
              currentCat: setCat,
            });     
          }
        return;
      }
    }
    const newFilter = this.state.filter;
    if(!obj.parent){                      //If button clicked is main category
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


    }else{                                //If button clicked is sub category
      newFilter.push({
        value: obj.main,
        parent: obj.parent
      });

      this.setState({
        filter: newFilter
      });
    }
    //console.log(this.state.filter);

    this.fetchResults();
  }

  priceFilter(obj){
    const newFilter = this.state.priceFilter;
      newFilter.push(obj);
    
    this.setState({
      priceFilter: newFilter
    });
    //console.log(this.state.priceFilter);
  }

  removeFilter(filter){
    const index = [];
    const newFilter = this.state.filter;

    for(var i = 0; i < newFilter.length; i++){
      if(newFilter[i].value === filter.value || newFilter[i].parent === filter.value){
        index.push(i);
      }
    }

    for (var j = index.length -1; j >= 0; j--)
       newFilter.splice(index[j],1);

    this.setState({
      filter: newFilter
    })
    this.fetchResults();
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
            onBackToMain={this.backToMainCategories}
            onPriceFilter={this.priceFilter}
            onChangeCategory={this.changeCategory}
            department={this.props.location.pathname.substring(1)}
        />
        <Link to='/'>
          <FontAwesomeIcon 
            className="back-to-menu-btn icon" 
            icon={faArrowCircleLeft} 
          /> 
        </Link>

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
