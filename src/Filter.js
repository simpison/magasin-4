import React, { Component } from 'react';
import * as firebase from 'firebase';

class Filter extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      displayCat:[]
    }

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  toggleFilter(){
    const state = !this.state.open;
    this.setState({
      open: state
    })
  }


  render(){
    const categories = this.props.categories;
    const filter = this.props.filter;
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
              </button>
            )}
          </div>
          <div className="filter-item2">
          {this.props.categories.map(cat =>
            <button
              onClick={() => this.props.onFiltering(cat)}
              key={cat.main}
              className="category-btn"
            >
              {cat.main}
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