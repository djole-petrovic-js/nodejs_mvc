( async function(){

  'use strict';

  const response = await fetch('/index/xhr',{
    method:'GET',
    headers:{
      'Content-type':'application/json',
      'X-Requested-With':'XMLHttpRequest'
    }
  });

  console.log(response);

  const data = await response.text();

  console.log(data);


}());