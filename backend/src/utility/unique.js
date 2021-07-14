function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  module.exports ={
       returnUnique(myArray){
        var a = myArray;
        var unique = a.filter(onlyUnique);
        //
        let filteredList = [...new Set(unique.map(JSON.stringify))].map(JSON.parse);
        
        return filteredList;
      }
  }
 

  