import { useState } from "react";
import axios from 'axios'

const AddCourse = () => {

  const [id, setID] = useState("");
  const [courseName, setCourseName] = useState("");

  console.log(id, courseName)

  // define the callAPI function that takes a first name and last name as parameters
  var callAPI = () => {
    // instantiate a headers object
    const headers = {
      "Content-Type": "application/json"
    }

    console.log(headers)
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"id":id,"courseName":courseName});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://56j70ao9r7.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
}

  return(
    <>
      <title>Home</title>
      <h1>Courses</h1>
      <form>
        <label>id :</label>
        <input type="text" id="id" onChange={e => setID(e.target.value)}></input>
        <label>courseName :</label>
        <input type="text" id="courseName" onChange={e => setCourseName(e.target.value)}></input>
        <button onClick={callAPI}>Call API</button>
        {/* <button type="button" onclick="callAPI(document.getElementById('id').value,document.getElementById('courseName').value)">Call API</button> */}
    </form>
    </>
  )
};

  export default AddCourse;