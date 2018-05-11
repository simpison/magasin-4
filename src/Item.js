import React, { Component } from 'react';
import * as firebase from 'firebase';

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
    return y+'-'+ (m<9 ? '0'+(m+1) : (m+1)) +'-'+(d<10 ? '0'+d : d);
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
        <span className="category1">{item.mainCategory}</span><br/>
        <span className="category2">{item.subCategory}</span><br/>
        <span className="category3">{item.color}    {item.material}</span><br/>
        <span className="category3">Prisgrupp: {item.priceGroup}</span><br/>
        <div className={item.available ? "ribbon-green" : "ribbon-red"}>
          <span>{item.available ? 'Tillgänglig' : 'Åter: '+ this.getReturnDate(item.rentalDate)}</span>
        </div>
      </div>
      );
  }
}

export default Item;