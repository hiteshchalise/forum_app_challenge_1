import React, { Component } from "react";
import PostContainer from "./postContainer";

class Body extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, items } = this.state;
    console.log("This state: ", this.state);
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let postsContainers = [];
      items.forEach((item)=>{
        postsContainers.push(<PostContainer post={item} />);
      });
      return postsContainers;
    }
  }
}

export default Body;
