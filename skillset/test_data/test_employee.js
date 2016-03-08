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
