import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [allUserData, setAllUserData] = useState(null)
  const [currentPageUsers, setCurrentPageUsers] = useState(null)
  const [currPage, setCurrPage] = useState(1)
  const [userSearch, setUserSearch] = useState("")

  const fetchAllUsers = async () => {
    const response = await axios.get('https://mock-api.mortgagebasket.co.uk/v1/users?pageSize=100')
    // console.log(response.data.data)
    setAllUserData(response.data.data)
    getCurrentPageData(response.data.data, currPage)
  }

  const getCurrentPageData = (allData, page) => {
    let start;
    if(page === 1){
      start = 0
    }else{
      start = (page - 1) * 5
    }
    const end = start + 5

    // console.log("Current Users", allData.slice(start, end))
    setCurrentPageUsers(allData.slice(start, end))
  }

  const searchForUser = () => {
    const filteredData = allUserData.filter((item) => item.name.toLowerCase().includes(userSearch.toLowerCase()))
    console.log("filteredData", filteredData)
    setCurrentPageUsers(filteredData.slice(0, 5))
  }

  useEffect(()=>{
    fetchAllUsers()
    
  },[])

  const pageChange = async(page) => {
    console.log("page", page)
    if(page<1 || page >=20){
      return
    }
    setCurrPage(page)
    getCurrentPageData(allUserData, page)
  }

  return (
    <div className="App">
      <div>
        <h1>Users</h1>
        <div style={{display: "flex", flexDirection: "column", justifyContent:"center", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "row", marginTop: "10px", marginBottom: "10px"}}>
            <button onClick={()=>pageChange(currPage-1)}>Previous</button>
            <div style={{marginLeft: "10px", marginRight: "10px"}}>Page - {currPage}</div>
            <button onClick={()=>pageChange(currPage+1)}>Next</button>
          
          </div>
          <div style={{display: "flex", flexDirection: "row", marginTop: "10px", marginBottom: "10px"}}>
          <input type="text" value={userSearch} onChange={(e)=>setUserSearch(e.target.value)}/>
          <button onClick={()=>searchForUser()}>Search</button>

          </div>
          <div  style={{display: "flex", flexDirection:"column",}}>
          {(currentPageUsers&& currentPageUsers.length>0) && 
          currentPageUsers.map((item,index) => (
          <div key={index} style={{display: "flex", flexDirection:"row", background: "lightgray", borderRadius: "30px", margin: "10px", padding: "10px"}}>
            <img src={item.imageUrl} alt="userpic" style={{width: "100px", height:"100px", borderRadius: "50%"}}/>
            <div style={{textAlign: "left", padding: "10px", marginLeft: "25px"}}>
              <div>name : {item.name}</div>
              <div>email : {item.email}</div>
              <div>dob : {item.date_of_birth}</div>
            </div>
          </div>
          ))}
          {(!currentPageUsers || currentPageUsers.length === 0) && <div>No Data Found</div>}
          </div>

      </div>
      </div>
    </div>
  );
}

export default App;
