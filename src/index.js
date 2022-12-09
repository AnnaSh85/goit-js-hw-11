import axios from "axios";
axios.get('/users')
  .then(res => {
    console.log(res.data);
  });
  
import Notiflix from 'notiflix';
