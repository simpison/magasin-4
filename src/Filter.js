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
      categoryTypes: []
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
              priceGroups: this.props.onSortDict(price),
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
    //const priceFil = this.props.filter.price;
    const catFil = this.props.filter.category;
    const colFil = this.props.filter.colormaterial;
    const sizeFil = this.props.filter.size;
    const typeFil = this.props.filter.type;
    for(var l=0;l<catFil.length;l++){
      if(!catFil[l].parent){
        inOrder.push(catFil[l]);
      }    
    }

    for (var i = inOrder.length-1; i >= 0; i--) {
      for (var j = 0; j < catFil.length; j++) {
        if(catFil[j].parent === inOrder[i].value){
            inOrder.splice(i+1, 0, catFil[j]);
        }
      }
    }

    for(var m=0;m<colFil.length;m++){
        inOrder.push(colFil[m]);
    }
    for(var n=0;n<typeFil.length;n++){
        inOrder.push(typeFil[n]);
    }
    for(var q=0;q<sizeFil.length;q++){
      if(!sizeFil[q].parent){
        inOrder.push(sizeFil[q]);
      }    
    }
    for (var s = inOrder.length-1; s >= 0; s--) {
      for (var t = 0; t < sizeFil.length; t++) {
        if(sizeFil[t].parent === inOrder[s].value){
            inOrder.splice(s+1, 0, sizeFil[t]);
        }
      }
    }
    // for(var p=0;p<priceFil.length;p++){
    //     inOrder.push(priceFil[p]);
    // }


    return inOrder;
  }

  generateBackBtn(){
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
          <Button
            onClick={() => this.props.onFiltering(cat)}
            key={cat.main? cat.main : cat}
            className="category-btn"
          >
            {cat.main? cat.main : cat}
          </Button>
        )
      )
    }if(this.state.department === "kostym"){
      return (
        this.props.categories.map(cat =>
          <Button
            onClick={() => this.props.onFiltering(cat)}
            key={cat.main? cat.main : cat.name}
            className="category-btn"
          >
            {cat.main? "("+cat.code+") "+cat.main : cat.name+" ("+cat.code+")"}
          </Button>
        )  
      )    
    }
  }

  render(){
    const categories = this.props.categories;
    const filter = this.filterInOrder();
    return (
      <div className={this.state.open ? "filter open-filter" : "filter"}>
        <div className="filter-container">
          <div className="filter-item1">
            {filter.map(fil =>
              <button
                className={fil.parent ? "filter-btn-sub" : "filter-btn-main"}
                onClick={() => this.props.onRemoveFilter(fil)}
                key={fil.value? fil.value : fil.priceGroup}
              >
                {fil.value? fil.value : fil.priceGroup}
              <FontAwesomeIcon className="remove" icon={faTimesCircle} /> 
              </button>
            )}
            <div className="borderRight"></div>
          </div>
          <div className="filter-item2">
            <div className="header-btn-container">
              {this.state.categoryTypes.map(cat =>
              <Tab 
                className="header-btn"
                nu={this.props.tab}
                onClick={() => this.props.onChangeCategory(cat)}
                key={cat}
                name={cat}
                >
                {cat}
              </Tab>
              )}
            </div>
          <div className="category-btn-container">
            {this.generateBackBtn()}
            {this.generateOptions()}
          </div>
          <div className="borderLeft"></div>
          </div>
          <div className="filter-item3">
              <div className="price-title">
                <span>Price Groups </span>
              </div>
            <div className="price-btn-container">
              {this.state.priceGroups.map(pg =>
                <Button
                  key={pg.priceGroup}
                  className="price-btn"
                  onClick={() => this.props.onPriceFilter(pg)}
                >
                  {pg.priceGroup}
                </Button>
              )}    
            </div>      
          </div>  
          <div className="filter-item4">
            <div>
              <button 
                  style={{"background": "#97cba0"}} 
                  className="available-btn"
                  onClick={()=> this.props.onAvailableFilter(true)}
                  >
                Tillgänglig
              </button>
              <button 
                  style={{"background": "#e69495"}} 
                  className="available-btn"
                  onClick={()=> this.props.onAvailableFilter(false)}
                  >
                Uthyrd
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

class Button extends Component {
  constructor(){
    super();
    this.state = {
      active:false
    }

  }

  toggleActive(){
    console.log("Ldhshcls");
    const state = !this.state.active;
    this.setState({
      active: state
    })
    this.props.onClick();
    console.log(this.state.active);
  }

  render(){
    return(
      <button
        className={this.state.active ? "active-btn "+this.props.className : this.props.className}
        onClick={()=> this.toggleActive()}
      >
        {this.props.children}
      </button>
    )
  }
}

class Tab extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:false,
      name:props.name
    }
  }

  toggleActive(){
    console.log(this.state.name);
    console.log(this.props.nu);
    console.log("_____________");
    if(this.state.name === this.props.nu){
      console.log("MATCH");
       this.setState({
        active: true
      })     
    }

    this.props.onClick();
  }

  render(){
    return(
      <button
        className={this.state.active ? "active-btn "+this.props.className : this.props.className}
        onClick={()=> this.toggleActive()}
      >
        {this.props.children}
      </button>
    )
  }
}

export default Filter;