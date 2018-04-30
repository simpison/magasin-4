import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import { Link, Route, Switch } from 'react-router-dom';

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
      category: [],
      filter: {cat:'',price:'',}
    }

    this.handleFiltering = this.handleFiltering.bind(this);
  }

  componentDidMount() {
    const department = this.props.location.pathname.substr(1);
    firebase.database().ref(department).on('value', snap => {
      const results = this.snapshotToArray(snap.child('items'));
      const categories = [];
      snap.child('categories').forEach(function(cat) { 
        categories.push(cat.key.toString())
        });

      this.setState({
        list: results,
        category: categories,
      });
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

  // fetchResults(){
  //   this.state.filter foreach
  //     const string +/ /
  //   firebase.database().ref('rekvisita/'+string).orderByChild(child).equalTo(value).on('value', snap => {
  //     const results = this.snapshotToArray(snap);
      
  //     console.log(results);
  //     this.setState({
  //       list: results,
  //     });
  //   });
  // }


  handleFiltering(id){
    const department = this.props.location.pathname.substr(1);
    const newFilter = this.state.filter;
    newFilter.push(id);
    this.setState({
      filter: newFilter
    })
    firebase.database().ref(department+'/categories').on('value', snap => {
      const subcategories = snap.child(id).val();
      if(subcategories){
        this.setState({
          category: subcategories
        });
      }
    });

  }

  render() {
    const result = this.state.list;
    console.log(this.state.category);
    return (

      <div className="page">
        <Filter 
            categories={this.state.category}
            filter={this.state.filter}
            onFiltering={this.handleFiltering}
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



class Item extends Component {
  constructor(){
    super();
    this.state = {
      imgUrl:'',
      open: false
    }

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidMount() {
    firebase.storage().ref().child(this.props.object.image).getDownloadURL().then(url => 
      this.setState({
        imgUrl: url
      })
    );
  }

  toggleExpand(){
    this.setState({
      open: !this.state.open
    })
  }

  getReturnDate(string){
    const date = new Date(string);
    date.setDate(date.getDate()+14);
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return y+'-'+ (m<10 ? '0'+(m+1) : (m+1)) +'-'+(d<10 ? 0+d : d);
  }

  render(){
    const item = this.props.object;
    return (
      <div 
          key={item.id} 
          className={this.state.open ? "grid-item-expand" : "grid-item"}
          onClick={this.toggleExpand}
        >
        <div className="img-container">
          <img src={this.state.imgUrl} alt="hey" width="10%" height="auto"/><br/>
        </div>
        <span className="category1">{item.category}</span><br/>
        <span className="category2">{item.subcategory}</span><br/>
        <span>{item.price}</span>
        <span>{item.price_group}</span><br/>
        <div className={item.available ? "ribbon-green" : "ribbon-red"}>
          <span>{item.available ? 'Tillgänglig' : 'Åter: '+ this.getReturnDate(item.rental_date)}</span>
        </div>
      </div>
      );
  }
}

class Filter extends Component {
  constructor(){
    super();
    this.state = {
      open: false
    }
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  toggleFilter(){
    const state = !this.state.open;
    this.setState({
      open: state
    })
    console.log(this.state.open)
  }

  render(){
    const categories = this.props.categories;
    const filter = this.props.filter;
    return (
      <div className={this.state.open ? "filter open-filter" : "filter"}>
        <div className="filter-container">
          <div className="filter-item1">
            <h3>Filter</h3>
            {filter.map(fil =>
              <p>{fil}</p>
            )}
          </div>
          <div className="filter-item2">
          {categories.map(cat =>
            <button
              onClick={() => this.props.onFiltering(cat)}
              key={cat}
              className="category-btn"
            >
              {cat}
            </button>
          )}
          </div>
          <div className="filter-item3">Upper</div>  
          <div className="filter-item4">Lower</div>
        </div>
        <button onClick={this.toggleFilter} className="open-filter-btn">
          OPEN
        </button>
      </div>
  )}
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
