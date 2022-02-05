import React, { useEffect } from "react";
import "./navbar.css";
import axios from "axios";
import { url } from "../../backend";
import Button from '../button/button'
import Graph from '../graph/graph'

const toggleNav = () =>{
    // e.preventDefault()
    if(document.getElementById('sidebarCollapse').style.display=='none') document.getElementById('sidebarCollapse').style.display='unset'
    else document.getElementById('sidebarCollapse').style.display='none'
}
const remove_ = (measure, dimensions) =>{
  var arr = measure.split('_')
  var str = ''
  for(var i=0;i<arr.length;i++) {
    str+=arr[i]+' '
  }
  str+='of '+dimensions[1].value+' in '+dimensions[0].value
  return str
}

const Navbar = () => {
    const onClick = (e, _id, str)=>{
        e.preventDefault()
        toggleNav()
        axios.get(url + `/singlemetric/${_id}`)
        .then(response=>{
            console.log(response.data.result[0])
            if(response.data.success==false) {
                setGraph(
                    <div className="center">
                        <h1>Error in loading graph. Please try again after sometime</h1>
                    </div>
                )
            } 
            else {
                var myList = response.data.result
                myList.sort(function(x, y){
                  if(x.timestamp>y.timestamp) return 1
                  else return -1
                })
                setGraph(
                  <>
                  <Graph arr = {myList} str={str} />
                  </>
                )
            }
        })
        .catch(err=>{
            console.log(err)
            alert('Please try again after sometime.')
            // setGraph(<h1>Error in loading graph. Please try again after sometime</h1>)
        })
        console.log(_id)
        setGraph(
          <div className="center">
              <h1>Graph is Loading....</h1>
          </div>
        )
    }

    const [buttonList, setButtonList] = React.useState("");
    const [graph,setGraph] = React.useState('Graph is loading....')
    var buttonsArr
    useEffect(()=>{
        setGraph(<div className="center">
            <h1>Please select a graph from the left</h1>
        </div>)
        setButtonList(buttonList)
        axios.get(url+'/metrics')
        .then(response=>{
            // console.log(response.data);
            buttonsArr = response.data.result
            setButtonList(buttonsArr.map((button)=>{
                const str = remove_(button.measure, button.dimensions)
                return <Button key={button._id} _id={button._id} str = {str} onClick={(e)=>{onClick(e,button._id, str)}} />
            }))
        })
        .catch(err=>{
            console.log(err)
            alert('Something went wrong, Please try again after sometime')
        })
    }, [])
  return (
      <>
    <nav
      className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler ms-n2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={()=>{toggleNav()}}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <h4 className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0" href="#">
          <span className="header__link">
            Data Visualiser</span>
        </h4>
        <div className="navbar-user d-lg-none"></div>
        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <ul className="navbar-nav">
            {buttonList}
          </ul>
        </div>
      </div>
    </nav>
    {graph}
    </>
  );
};

export default Navbar;
