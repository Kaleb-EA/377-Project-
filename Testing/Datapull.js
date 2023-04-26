import fetch from 'node-fetch';

export async function LoadData(req, res, next) {
    try {
      const url = 'https://www.superheroapi.com/api.php/1952847071749817/69/powerstats';
      const data = await fetch(url);
      const json = await data.json();
  
      const reply = json.filter((item) => Boolean(item.geocoded_column_1)).fileter((item) => Boolean(item.name));
      return reply;
  
      console.log("results of data search", json.length);
      req.Loaddata = reply;
      next();
    } catch (err) {
      console.log("Data Request failed", err);
      res.json({ message: 'data request failed', error: err});
    }
   }