 const mongoose = require('mongoose');
 const cities = require('./cities')
 const {descriptors , places} = require('./seedHelpers')
 const Campground = require('../models/campground');

 mongoose.connect('mongodb://127.0.0.1:27017/app',{
    useNewUrlParser:true
 });

 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', ()=>{
    console.log('database connected');
 });

 const sample = array => array[Math.floor(Math.random() * array.length)]
 
 const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i= 0;i<50;i++){
        const random1001 = Math.floor(Math.random() * 1000) ;
        const price = Math.floor(Math.random() * 20)+10;
        const camp = new Campground({
            location: `${cities[random1001].city} , ${cities[random1001].state}`,
            title: `${sample(descriptors), sample(places)}`,
            author: '654907b0cf8baa52e1c4b37f',
            description: 'image',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1001].longitude,
                  cities[random1001].latitude,
              ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/daj2igvhk/image/upload/v1699737484/yellcamp/m9enav7pwnpsrt2ltj5l.jpg',
                  filename: 'yellcamp/m9enav7pwnpsrt2ltj5l',
                },
                {
                  url: 'https://res.cloudinary.com/daj2igvhk/image/upload/v1699737484/yellcamp/ecvehaa2vssvqfflacru.jpg',
                  filename: 'yellcamp/ecvehaa2vssvqfflacru',
                }
              ]
        })
        await camp.save();
    }

}
seedDb().then(() =>{
     mongoose.connection.close();
    });