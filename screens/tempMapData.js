const Images = [
    {image: require('../assets/images/food1.jpg')},
    {image: require('../assets/images/food2.jpg')},
    {image: require('../assets/images/food3.jpg')},
    {image: require('../assets/images/food4.jpg')},
]

const latitude = 37.0006896 
const longitude = -122.0585876

export const markers = [
    {
        coordinate: {
            latitude: latitude - 0.01,
            longitude: longitude - 0.01
        },
        title: "Amazing food place",
        description: "Good food place",
        image: Images[0].image,
        ratings: 4,
        reviews: 99
    },
    {
        coordinate: {
            latitude: latitude + 0.01,
            longitude: longitude + 0.01
        },
        title: "food place",
        description: "food",
        image: Images[1].image,
        ratings: 4.5,
        reviews: 30
    },
    {
        coordinate: {
            latitude: latitude - 0.01,
            longitude: longitude + 0.01
        },
        title: "Amazing food place",
        description: "Good food place",
        image: Images[2].image,
        ratings: 2,
        reviews: 10
    },
    {
        coordinate: {
            latitude: latitude + 0.01,
            longitude: longitude - 0.01
        },
        title: "Amazing food place",
        description: "Good food place",
        image: Images[3].image,
        ratings: 2.5,
        reviews: 9
    }
]