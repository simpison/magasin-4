import React, { Component } from 'react';
import './App.css';
import './tablet.css';
import * as firebase from 'firebase';
import { Link, Route, Switch } from 'react-router-dom';
import Filter from './Filter.js';
import Item from './Item.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowCircleLeft from '@fortawesome/fontawesome-free-solid/faArrowCircleLeft';
import _ from 'lodash';

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
      currentTab: "Kategori",
      currentCat: [],
      filter: {category:[],price:[],colormaterial:[],type:[],size:[],available: null}
    }

    this.handleFiltering = this.handleFiltering.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.backToMainCategories = this.backToMainCategories.bind(this);
    this.priceFilter = this.priceFilter.bind(this);
    this.availableFilter = this.availableFilter.bind(this);
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
          if(department === "rekvisita" || department === "mobel"){
            cat2 = doc.data().color;
            cat3 = doc.data().material;
          }else{
            cat2 = doc.data().type;
            cat3 = doc.data().size;
          }

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
    const department = this.props.location.pathname.substring(1);
    console.log("fetchResults");
    const db = firebase.firestore();
    const newResult = [];
    const filter = Object.assign({}, this.state.filter);
    const catFilter = filter.category;
    const priceFilter = this.state.filter.price;
    const main = [];
    const sub = [];


    if(!filter.category.length>0 && !filter.price.length>0 && !filter.colormaterial.length>0 && !filter.type.length>0 && !filter.size.length>0 && !filter.price.length>0 && filter.available == null){
        console.log("INGET FILTER");
        this.setState({
          list: []
        });
        return;
    }
    const results = [];
    if(catFilter.length>0){
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
    }else{
        db.collection("items").where("department", "==", department)
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
    }

}

  filterResults(results){
    const filteredResults = results;
    const filter = Object.assign({}, this.state.filter);
    const parents = [];
    const children = [];
    const price = [];
    const colormaterials = [];
    const type = [];
    const size = [];

    filter.category.map(category =>{
      if(category.parent){
        children.push(category.value);
        parents.push(category.parent);
      }
    })

    filter.colormaterial.map(attribute =>{
      colormaterials.push(attribute.value);
    })

    filter.type.map(t =>{
      type.push(t.value);
    })

    filter.price.map(p =>{
      price.push(p.priceGroup);
    })

    //Filter on category
    if(filter.category.length>0){
      for (var i = filteredResults.length-1; i >= 0; i--) {
        if(parents.includes(filteredResults[i].mainCategory) && !children.includes(filteredResults[i].subCategory)){
          filteredResults.splice(i,1);
        }
      }
    }

    //Filter on color & material
    if(filter.colormaterial.length>0){
      for (var j = filteredResults.length-1; j >= 0; j--) {
        if(!colormaterials.includes(filteredResults[j].color) && !colormaterials.includes(filteredResults[j].material)){
          filteredResults.splice(j,1);
        }
      }
    }


    //Filter on type
    if(filter.type.length>0){
      for (var k = filteredResults.length-1; k >= 0; k--) {
        if(!type.includes(filteredResults[k].type)){
          filteredResults.splice(k,1);
        }
      }
    }

    children.splice(0,children.length);
    parents.splice(0,parents.length);
    const gender = [];

    filter.size.map(size =>{
      if(!size.parent){
        gender.push(size.value);
      }
      if(size.parent){
        children.push(size.value);
        parents.push(size.parent);
      }
    })

    //Filter on size
    if(filter.size.length>0){
      for (var l = filteredResults.length-1; l >= 0; l--) {
        if(!gender.includes(filteredResults[l].gender)){
          filteredResults.splice(l,1);
        }else if(parents.includes(filteredResults[l].gender) && !children.includes(filteredResults[l].size)){
          filteredResults.splice(l,1);
        }
      }
    }

    //Filter on price
    if(filter.price.length>0){
      for (var m = filteredResults.length-1; m >= 0; m--) {
        if(!price.includes(filteredResults[m].priceGroup)){
          filteredResults.splice(m,1);
        }
      }     
    }

    //Filter on availability
    console.log(filter.available);
    if(filter.available != null){
      console.log(filter.available);
      for (var n = filteredResults.length-1; n >= 0; n--) {
        if(filteredResults[n].available != filter.available){
          filteredResults.splice(n,1);
        }
      } 
    }

    this.setState({
      list: filteredResults
    });
   
  }


  changeCategory(str){
    let options;
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
      currentCat: options,
      currentTab: str
    })

  }


  backToMainCategories(){
    let options;
    const curTab = this.state.currentTab;
    if(curTab === "Kategori"){
      options = this.state.categories;
    }if(curTab === "Färg"){
      options = this.state.cat2;
    }if(curTab === "Material"){
      options = this.state.cat3;
    }if(curTab === "Artikeltyp"){
      options = this.state.cat2;
    }if(curTab === "Storlek"){
      options = this.state.cat3;
    }   
    this.setState({
      currentCat: options
    });
  }


  handleFiltering(obj){
    if(this.inFilter(obj)){
      if(obj.sub){
        const subCat = [];
        obj.sub.map(sub => {
          subCat.push({                     //Set catbuttons to subcategories
            main: sub,
            parent: obj.main
          });
        });  
        this.setState({
          currentCat: subCat
        });   
      }
      return;
    }
    const curTab = this.state.currentTab;
    let filter = Object.assign({}, this.state.filter);
    if(curTab === "Kategori"){
        if(!obj.parent && obj.sub){               //If button is main
            const subCat = [];
            obj.sub.map( sub => {
                subCat.push({                     //Set catbuttons to subcategories
                  main: sub,
                  parent: obj.main
                });
              });
            filter.category.push({value:obj.main});
            this.setState({
              currentCat: subCat,
              filter: {...this.state.filter, category:filter.category}
            });

        }else if(obj.parent){
          if(!this.inFilter(obj.parent)){
            filter.category.push({value:obj.parent});
          }
          filter.category.push({value:obj.main, parent:obj.parent});
          this.setState({
              filter: {...this.state.filter, category:filter.category}
          });         
        }else if(obj.code){
          filter.category.push({value:obj.main, code:obj.code});
          this.setState({
            filter: {...this.state.filter, category:filter.category}
          });         
        }

    }if(curTab === "Färg" || curTab == "Material"){
      console.log(curTab);
      if(typeof obj === "string"){
        filter.colormaterial.push({value:obj});
      }else{
        filter.colormaterial.push(obj);
      }
      this.setState({
        filter: {...this.state.filter, colormaterial:filter.colormaterial}
      });  

    }if(curTab === "Artikeltyp"){
      filter.type.push({value:obj.main});
      this.setState({
        filter: {...this.state.filter, type:filter.type}
      });

    }if(curTab === "Storlek"){
        if(!obj.parent && obj.sub){               //If button is main
            const subCat = [];
            obj.sub.map( sub => {
                subCat.push({                     //Set catbuttons to subcategories
                  main: sub,
                  parent: obj.main
                });
              });
            filter.size.push({value:obj.main, code:obj.code});
            this.setState({
              currentCat: subCat,
              filter: {...this.state.filter, size:filter.size}
            });

        }else if(obj.parent){
          if(!this.inFilter(obj.parent)){
            filter.size.push({value:obj.parent});
          }
          filter.size.push({value:obj.main, parent:obj.parent});
          this.setState({
              filter: {...this.state.filter, size:filter.size}
          });         
        }
    }   

    this.fetchResults();
  }

  priceFilter(obj){
    for (var i = 0; i < this.state.filter.price.length; i++) {
      if(obj.priceGroup === this.state.filter.price[i].priceGroup){
        return;
      }
    }
    const newFilter = this.state.filter.price;
    newFilter.push(obj);
    
    this.setState({
      filter: {...this.state.filter, price:newFilter}
    });
    this.fetchResults();
  }

  availableFilter(bool){
    this.setState({
      filter: {...this.state.filter, available:bool}
    });
    this.fetchResults();
  }

  inFilter(obj){
    console.log(this.state.filter);
    console.log(obj);
    const filter = Object.assign({}, this.state.filter);
    for(var i = 0; i < filter.category.length; i++){
      if(filter.category[i].value === obj.main || filter.category[i].value === obj || filter.category[i] === obj){
          return "category";
        }
      }

    for(var i = 0; i < filter.price.length; i++){
      if(filter.price[i] === obj){
          return "price";
        }
      }

    console.log(filter.colormaterial.length);
    for(var i = 0; i < filter.colormaterial.length; i++){
      console.log(obj);
      console.log(filter.size[i]);
      if(filter.colormaterial[i].value === obj || filter.colormaterial[i] === obj){
          return "colormaterial";
        }
      }

    for(var i = 0; i < filter.type.length; i++){
      if(filter.type[i] === obj || filter.type[i].value === obj.main){
          return "type";
        }
      }

    for(var i = 0; i < filter.size.length; i++){
      if(filter.size[i] === obj || filter.size[i].value === obj.main || filter.size[i].value == obj){
          return "size";
        }
      }
  }

  removeFilter(obj){
    const index = [];
    let filter = Object.assign({}, this.state.filter);

    const categoryType = this.inFilter(obj);
    console.log(categoryType);
    if(categoryType === "category"){
      filter = filter.category;
    }else if(categoryType === "price"){
      filter = filter.price;
    }else if(categoryType === "colormaterial"){
      filter = filter.colormaterial;
    }else if(categoryType === "type"){
      filter = filter.type;
    }else if(categoryType === "size"){
      filter = filter.size;
    }


    for(var i = 0; i < filter.length; i++){
        if(obj.priceGroup){
            if(filter[i].priceGroup === obj.priceGroup){
              index.push(i);
            }          
        }else {
          if(filter[i].value === obj.value || filter[i].parent === obj.value){
            index.push(i);
          }
        }
    }

    for (var j = index.length -1; j >= 0; j--){
      filter.splice(index[j],1);
    }

    if(categoryType === "category"){
      this.setState({
        filter: {...this.state.filter, category:filter}
      })
    }else if(categoryType === "price"){
      this.setState({
        filter: {...this.state.filter, price:filter}
      })
    }else if(categoryType === "colormaterial"){
      this.setState({
        filter: {...this.state.filter, colormaterial:filter}
      })
    }else if(categoryType === "type"){
      this.setState({
        filter: {...this.state.filter, type:filter}
      })
    }else if(categoryType === "size"){
      this.setState({
        filter: {...this.state.filter, size:filter}
      })
    }

    console.log(this.state.filter);
    this.fetchResults();
  }


  sortDict(array){
    const sortedArray = _.sortBy(array, 'priceGroup', function(n) {
      return Math.sin(n);
    });

    return sortedArray;
  }


  render() {
    console.log(this.state.currentTab);
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
            onAvailableFilter={this.availableFilter}
            onSortDict={this.sortDict}
            tab={this.state.currentTab}
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
  <div className="home-page">
    <div className="menu-wrapper">
        <button className="menu-btn">
            <Link 
                to='/kostym' 
                style={{ textDecoration: 'none',color: '#fff' }}
            >
                Kostym
            </Link>
        </button><br/>
        <button className="menu-btn"><Link to='/rekvisita' style={{ textDecoration: 'none',color: '#fff' }}>Rekvisita</Link></button><br/>
        <button className="menu-btn"><Link to='/mobel' style={{ textDecoration: 'none',color: '#fff' }}>Möbel</Link></button>
    </div>
  </div>


export default App;