const 

const url =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000128b62a2b46904c986bb81d02c47919f7&format=json";

fetch(url)
  .then((res) => res.json())
  .then((data) => console.log(data));
