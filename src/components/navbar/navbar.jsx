import React, { useEffect } from "react";
import "./navbar.css";
import axios from "axios";
import { url } from "../../backend";
import Button from '../button/button'
import Graph from '../graph/graph'

const filterArr = (arr) => {
  const newArr = []
  for(var i=0;i<arr.length;i++) if(arr[i].original_value!=null && arr[i].min_band!=null && arr[i].max_band!=null && arr[i].timestamp!=null) newArr.push(arr[i]);
  return newArr
}

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
  var str = ''
  var myList=[]
    const onClick = (e, _id, str)=>{
        e.preventDefault()
        toggleNav()
        axios.get(url + `/singlemetric/${_id}`)
        .then(response=>{
            console.log(response.data.result[0])
            if(response.data.success==false) {
                setGraph(
                    <div className="center">
                        <h1><i class="fas fa-exclamation-circle"></i> Error in loading graph. Please try again after sometime</h1>
                    </div>
                )
            } 
            else {
                myList = response.data.result
                myList = filterArr(myList)
                myList.sort(function(x, y){
                  if(x.timestamp>y.timestamp) return 1
                  else return -1
                })
                console.log(myList)
                setGraph(
                  <>
                    <div className="container center">
                      <Graph newArr = {myList} str={str} />
                      <div className='row'>
                        <input className='col' type="number" placeholder={`Enter Xmin(0-${myList.length-1})`} id='min' min={0} max={myList.length-1} />
                        <input className='col' type="number" id='max' placeholder={`Enter Xmax(0-${myList.length-1})`} min={0} max={myList.length-1} />
                        <div className="col">
                          <button className id='slide' onClick={()=>changeBoudaries()}>Change</button>
                        </div>
                      </div>
                    </div>
                  </>
                )
            }
        })
        .catch(err=>{
            console.log(err)
            alert('Please try again after sometime.')
            setGraph(
              <div className="center">
                <h1><i class="fas fa-exclamation-circle"></i> Error in loading graph. Please try again after sometime</h1>
              </div>
            )
            // setGraph(<h1>Error in loading graph. Please try again after sometime</h1>)
        })
        console.log(_id)
        setGraph(
          <div className="center">
              
              <h1><i class="fas fa-spinner"></i>Graph is Loading....</h1>
          </div>
        )
    }

    const [buttonList, setButtonList] = React.useState("");
    const [graph,setGraph] = React.useState('Graph is loading....')
    var buttonsArr
    useEffect(()=>{
        setGraph(<div className="center">
              
        <h1><i class="fas fa-spinner"></i>Please wait while we fetch data from backend....</h1>
    </div>)
        setButtonList(buttonList)
        axios.get(url+'/metrics')
        .then(response=>{
            // console.log(response.data);
            if(response.data.status==false) {
              setGraph(
                <div className="center">
                    <h1><i class="fas fa-exclamation-circle"></i> Error in loading metrics. Please try again after sometime</h1>
                </div>
            )
            }
            buttonsArr = response.data.result
            setButtonList(buttonsArr.map((button)=>{
                str = remove_(button.measure, button.dimensions)
                return <Button key={button._id} _id={button._id} str = {str} onClick={(e)=>{onClick(e,button._id, str)}} />
            }))
            setGraph(<div className="center">
                <h1><i class="fas fa-asterisk"></i> Please select a metric from the Navbar</h1>
            </div>)
        })
        .catch(err=>{
            console.log(err)
            alert('Something went wrong, Please try again after sometime')
            setGraph(
              <div className="center">
                        <h1><i class="fas fa-exclamation-circle"></i> Error in loading graph. Please try again after sometime</h1>
                    </div>
            )
        })
    }, [])

    const changeBoudaries = () => {
      var mini = document.getElementById('min').value
      var maxi = document.getElementById('max').value
      var arr_ = myList.slice(mini, maxi)
      setGraph(
        <>
          <div className="container center">
            <Graph newArr = {arr_} str={str} />
            <div className='row'>
              <input className='col' type="number" placeholder={`Enter Xmin(0-${myList.length-1})`} id='min' min={0} max={myList.length-1} />
              <input className='col' type="number" id='max' placeholder={`Enter Xmax(0-${myList.length-1})`} min={0} max={myList.length-1} />
              <div className="col">
                <button className id='slide' onClick={()=>changeBoudaries()}>Change</button>
              </div>
            </div>
          </div>
        </>
      )
    }
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
        <h1 className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 align-center">
        <i class="fas fa-database"></i> Data Visualiser
        </h1>
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
