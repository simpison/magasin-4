import React, { Component } from 'react';
import * as firebase from 'firebase';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowCircleLeft from '@fortawesome/fontawesome-free-solid/faArrowCircleLeft';
import faChevronCircleDown from '@fortawesome/fontawesome-free-solid/faChevronCircleDown';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';


class Filter extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      priceGroups:[],
      department: null,
      categoryTypes: [],
    }

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount(){
    const db = firebase.firestore();
    const price = []; 
    db.collection("priceGroups")
        .get()
        .then((col) => {
            col.forEach((doc) => {
                price.push(doc.data());
            });
            let types = [];
            if(this.props.department === "kostym"){
              types = ["Kategori","Artikeltyp","Storlek"];
            }if(this.props.department === "mobel"){
              types = ["Kategori","Färg","Material"];
            }if(this.props.department === "rekvisita"){
              types = ["Kategori","Färg","Material"];
            }

            this.setState({
              priceGroups: price,
              open: true,
              department: this.props.department,
              categoryTypes: types
          });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
  }

  toggleFilter(){
    const state = !this.state.open;
    this.setState({
      open: state
    })
  }

  filterInOrder(){
    const inOrder = [];
    const fil = this.props.filter;

    for(var l=0;l<fil.length;l++){
      if(!fil[l].parent){
        inOrder.push(fil[l]);
      }    
    }

    for (var i = inOrder.length-1; i >= 0; i--) {
      for (var j = 0; j < fil.length; j++) {
        if(fil[j].parent === inOrder[i].value){
            inOrder.splice(i+1, 0, fil[j]);
        }
      }
    }

    return inOrder;
  }

  getCategoryType(){
    if(this.props.categories.length>0){
      if(this.props.categories[0].parent){
        return (
            <FontAwesomeIcon 
              className="category-back-btn icon" 
              icon={faArrowCircleLeft} 
              onClick={() => this.props.onBackToMain()} 
          />           
          )
      }
    }
    return null;
  }

  generateOptions(){
    if(this.state.department === "rekvisita" || this.state.department === "mobel"){
      return (
        this.props.categories.map(cat =>
          <button
            onClick={() => this.props.onFiltering(cat)}
            key={cat.main? cat.main : cat}
            className="category-btn"
          >
            {cat.main? cat.main : cat}
          </button>
        )
      )
    }if(this.state.department === "kostym"){
      return (
        this.props.categories.map(cat =>
          <button
            onClick={() => this.props.onFiltering(cat)}
            key={cat.main? cat.main : cat.name}
            className="category-btn"
          >
            {cat.main? "("+cat.code+") "+cat.main : cat.name+" ("+cat.code+")"}
          </button>
        )  
      )    
    }
  }

  render(){
    const categories = this.props.categories;
    const filter = this.filterInOrder();
    this.filterInOrder();
    return (
      <div className={this.state.open ? "filter open-filter" : "filter"}>
        <div className="filter-container">
          <div className="filter-item1">
            {filter.map(fil =>
              <button
                className={fil.parent ? "filter-btn-sub" : "filter-btn-main"}
                onClick={() => this.props.onRemoveFilter(fil)}
                key={fil.value}
              >
                {fil.value}
              <FontAwesomeIcon className="remove" icon={faTimesCircle} /> 
              </button>
            )}
            <div className="borderRight"></div>
          </div>
          <div className="filter-item2">
            <div className="category-header">
              {this.state.categoryTypes.map(cat =>
              <button 
                className="category-header-btn"
                onClick={() => this.props.onChangeCategory(cat)}
                key={cat}
                >
                {cat}
              </button>
              )}
            </div>

          {this.getCategoryType()}
          {this.generateOptions()}

          <div className="borderLeft"></div>
          </div>
          <div className="filter-item3">
            Price Groups
            {this.state.priceGroups.map(pg =>
              <button
                key={pg.priceGroup}
                className="price-btn"
                onClick={() => this.props.onPriceFilter(pg)}
              >
                {pg.priceGroup}
              </button>
            )}          
          </div>  
          <div className="filter-item4">
            <div>
              <button style={{"background": "#fce56d"}} className="available-btn">
                Tillgänglig
              </button>
              <button style={{"background": "#fda660"}} className="available-btn">
                Uthyrd
              </button>
              <button style={{"background": "#fc5c69"}} className="available-btn">
                Försenad
              </button>
            </div>
          </div>
        </div>
        <div className="open-filter-btn-wrapper">
          <FontAwesomeIcon icon={faChevronCircleDown} onClick={this.toggleFilter} className={this.state.open ? "close-filter-btn icon" : "open-filter-btn icon"} />
        </div>
      </div>
  )}
}

// class Button extends Component {
//     constructor(){
//       super();
//       this.state = {
//         type:"",
//         value:""
//       }

//   }
//   render(){
//     return()
//   }
//}

export default Filter;