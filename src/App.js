import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
  constructor(){
    super();
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    firebase.database().ref('rekvisita').on('value', snap => {
      const results = this.snapshotToArray(snap.child('items'));

      this.setState({
        list: results
      });
    });
  }

  snapshotToArray(snapshot) {
    const returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        const item = childSnapshot.val();
        //console.log(item.image);
        //const url = firebase.storage().ref().child(item.image).getDownloadURL().getResult();
        //console.log(url);
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};

  render() {
    const result = this.state.list;
    return (
      <div className="page">
        <Filter/>
        {result && 
          <div className="grid-container">
          {this.state.list.map(item =>
            <Item object={item}/>
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
      imgUrl:''
    }
  }


  componentDidMount() {
    firebase.storage().ref().child(this.props.object.image).getDownloadURL().then(url => 
      this.setState({
        imgUrl: url
      })
    );
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
      <div key={item.id} className="grid-item">
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
    return (
      <div className={this.state.open ? "filter open-filter" : "filter"}>
        <div className="filter-container">
          <div className="filter-item1">Filter</div>
          <div className="filter-item2">Main</div>
          <div className="filter-item3">Upper</div>  
          <div className="filter-item4">Lower</div>
        </div>
        <button onClick={this.toggleFilter} className="open-filter-btn">
          OPEN
        </button>
      </div>


  )}

}

export default App;
