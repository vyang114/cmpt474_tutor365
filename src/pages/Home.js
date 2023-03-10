


const Home = () => {

  // define the callAPI function that takes a first name and last name as parameters
  var callAPI = (id, courseName)=>{
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"id":id,"courseName":courseName});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://farget4we1.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
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
        <input type="text" id="id"></input>
        <label>courseName :</label>
        <input type="text" id="courseName"></input>
        <button type="button" onClick={callAPI("2", "Hello")}>Call API</button>
    </form>
    </>
  )
};

  export default Home;