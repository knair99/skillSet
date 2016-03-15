/**
 * Created by Karunakaran_Prasad on 3/3/2016.
 */
employees: [
    {
        id: 0,
        name: 'shailesh',
        title: 'manager',
        phone: '911',
        skills: [{skill: 'C++', link: '', upvotes:0, comments:[]}]
    },
    {
        id: 1,
        name: 'kk',
        title: 'developer',
        phone: '911',
        skills:} [{skill: 'C++', link: '', upvotes:0, comments:[]}]
    }
]


db.employees.update( {"_id" : ObjectId("56d6f0c563b2fdda16e3f005")},
    {"id": 0, "name": "kk", "title": "developer",
    "phone":"911", "skills": [] }
)


/*
sample users:
 { "_id" : ObjectId("56e09ace42020ea023c893b9"), "hash" : "3ab686507db2d6043e9c2ead8e20e62d4758c596f8b6904c5f4aa52abdc07ed54087d3cce76d1a1eff1e6543cdc98b26715b5df8d328cdfdb54386c75a4c0a6f", "salt" : "311b271ee67a2a59d797ec2a99151b
 c2", "username" : "kk", "__v" : 0 }

sample employee:
 { "_id" : ObjectId("56e86d5efea13b880de14e61"), "name" : "kk", "phone" : "911", "id" : 1, "skills" : [ ObjectId("56e86d6efea13b880de14e62") ], "__v" : 1 }
 { "_id" : ObjectId("56e86da1fea13b880de14e63"), "name" : "Mimo", "phone" : "912", "id" : 2, "skills" : [ ObjectId("56e86dbdfea13b880de14e64") ], "__v" : 1 }

sample skills w/o comments:
 { "_id" : ObjectId("56e86d6efea13b880de14e62"), "skill" : "C++", "link" : "www.cpp.com", "employee" : [ ObjectId("56e86d5efea13b880de14e61") ], "comments" : [ ], "upvotes" : 0, "__v" : 0 }
 { "_id" : ObjectId("56e86dbdfea13b880de14e64"), "skill" : "Axure", "employee" : [ ObjectId("56e86da1fea13b880de14e63") ], "comments" : [ ], "upvotes" : 1, "__v" : 0 }

sample skills w/ comments:
 { "_id" : ObjectId("56e86dbdfea13b880de14e64"), "skill" : "Axure", "employee" : [ ObjectId("56e86da1fea13b880de14e63") ], "comments" : [ ObjectId("56e86e53fea13b880de14e65") ], "upvotes" : 1, "__v" : 1

 sample comment:
 { "_id" : ObjectId("56e86e53fea13b880de14e65"), "body" : "Mimo helped me quickly prototype a web project for Alchemy", "author" : "kk", "skill" : [ ObjectId("56e86dbdfea13b880de14e64") ], "upvotes" : 1, "__v" : 0 }

 */