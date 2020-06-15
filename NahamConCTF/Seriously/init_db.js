// mongo  127.0.0.1/shop init_db.js

var item0 = {
    "name": "Haworthiopsis attenuata",
    "description": "Haworthiopsis attenuata, formerly Haworthia attenuata, commonly known as zebra haworthia, is a small species of succulent plant from the Eastern Cape Province, South Africa. As an ornamental, it is one of the most commonly cultivated of the Haworthiopsis species.",
    "category": "Indoor",
    "price": 19.99,
    "rating": 4.0,
    "image": "/images/haworthia.jpg",
    "thumbnail": "/images/haworthia_sm.jpg",
    "reviews": [
        {
            "author": "Thomas",
            "content": "Really good looking plant. 100% recommend it."
        }
    ]
}

var item1 = {
"name": "Lemon tree",
"description": "The lemon, Citrus limon Osbeck, is a species of small evergreen tree in the flowering plant family Rutaceae, native to South Asia, primarily North eastern India. Its fruits are round in shape.",
"category": "Outdoor",
"price": 49.99,
"rating": 3.0,
"image": "/images/lemon.jpg",
"thumbnail": "/images/lemon_sm.jpg",
"reviews": []
}

var item2 = {
"name": "Dracaena trifasciata",
"description": "Dracaena trifasciata is a species of flowering plant in the family Asparagaceae, native to tropical West Africa from Nigeria east to the Congo. It is most commonly known as the snake plant, Saint George's sword, mother-in-law's tongue, and viper's bowstring hemp, among other names.",
"category": "Indoor",
"price": 14.99,
"rating": 4.0,
"image": "/images/snake.jpg",
"thumbnail": "/images/snake_sm.jpg",
"reviews": [
    {
        "author": "Sophia",
        "content": "Great plant, very little watering is required."
    }
]
}


var item3 = {
"name": "Cactus",
"description": "Get a selection of or best looking cactuses.",
"category": "Indoor",
"price": 24.99,
"rating": 3.0,
"image": "/images/cactus.jpg",
"thumbnail": "/images/cactus.jpg",
"reviews": []
}

var item4 = {
"name": "Cherry tree",
"description": "Prunus cerasus is a species of Prunus in the subgenus Cerasus, native to much of Europe and southwest Asia. It is closely related to the sweet cherry, but has a fruit that is more acidic. Its sour pulp is edible.",
"category": "Outdoor",
"price": 64.99,
"rating": 4.5,
"image": "/images/cherry.jpg",
"thumbnail": "/images/cherry_sm.jpg",
"reviews": []
}

var item5 = {
"name": "Banana palm",
"description": "The Banana Palm has a clustered, cylindrical collection of leaf stalk bases instead of the trunk. Each palm has around 7-15 oblong leaves with leaf veins running from the mid-rib straight to the outer edge of the leaf.",
"category": "Indoor",
"price": 79.99,
"rating": 5,
"image": "/images/banana.jpg",
"thumbnail": "/images/banana_sm.jpg",
"reviews": []
}


db.items.drop();
db.items.createIndex({name: 1},{unique:true});
db.items.insert(item0);
db.items.insert(item1);
db.items.insert(item2);
db.items.insert(item3);
db.items.insert(item4);
db.items.insert(item5);


var admin = {"username":"admin","password":"!B^#YuqLVCEz[d%rTwv%dG!:k(G8jw*{"}

db.users.drop();
db.users.createIndex({username: 1},{unique:true});
db.users.insert(admin);